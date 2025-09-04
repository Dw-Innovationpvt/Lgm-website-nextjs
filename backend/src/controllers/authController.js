import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";
import nodemailer from "nodemailer";

// setup nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =======================
// USER SIGNUP FUNCTION
// =======================
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// USER LOGIN FUNCTION
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// ADMIN LOGIN FUNCTION
// =======================
const adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { adminId } });

    if (!admin) {
      return res.status(400).json({ message: "Invalid admin ID or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid admin ID or password" });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Admin login successful", admin, token });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password - send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // store OTP with expiry (10 min)
    await prisma.passwordResetToken.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #fff7ed; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 12px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(90deg, #f97316, #fb923c); color: white; text-align: center; padding: 25px 0;">
              <h2 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">Password Reset Request</h2>
            </div>

            <!-- Body -->
            <div style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 15px;">Hi,</p>
              <p style="margin: 0 0 20px;">
                We received a request to reset your password. Please use the OTP below to proceed.
                This code will expire in <strong style="color: #f97316;">10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; font-size: 28px; font-weight: bold; color: #f97316; padding: 15px 30px; border: 2px dashed #f97316; border-radius: 10px; background: #fff7ed;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 20px 0 0;">If you did not request a password reset, you can safely ignore this email.</p>
              <p style="margin: 10px 0 0;">Thanks,<br/><strong style="color: #f97316;">LGM Sports</strong></p>
            </div>

            <!-- Footer -->
            <div style="background: #fff7ed; text-align: center; padding: 15px; font-size: 12px; color: #555;">
              &copy; ${new Date().getFullYear()} <span style="color: #f97316; font-weight: bold;">LGM Sports</span>. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const token = await prisma.passwordResetToken.findFirst({
      where: { email, otp },
      orderBy: { createdAt: "desc" },
    });

    if (!token) return res.status(400).json({ error: "Invalid OTP" });
    if (token.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // delete used token
    await prisma.passwordResetToken.delete({ where: { id: token.id } });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ✅ Export all three functions
export { signup, login, adminLogin, forgotPassword, resetPassword };
