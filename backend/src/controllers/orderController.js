import prisma from "../lib/prismaClient.js";
import nodemailer from "nodemailer";
import { io } from "../server.js";
import puppeteer from "puppeteer";
import path from 'path';
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createOrder = async (req, res) => {
  try {
    const { formData, cart, totalAmount, totalAmountPaise, academicDetails } =
      req.body;

    const finalAmount =
      typeof totalAmountPaise === "number"
        ? totalAmountPaise
        : totalAmount * 100;

    if (!formData || !cart || !finalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing order data" });
    }

    // Extract user email from the form data
    const userEmail = formData.email;
    if (!userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User email is required" });
    }

    // Create order without transaction first
    const newOrder = await prisma.order.create({
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: userEmail,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
        totalAmount: finalAmount,
        paymentStatus: "pending",
        discountApplied: academicDetails ? true : false,
        discountAmount: academicDetails
          ? academicDetails.discountAmount || 0
          : 0,
        items: {
          create: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price * 100,
            selectedColor: item.selectedColor || null,
            selectedColorHex: item.selectedColorHex || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update stock for each product separately
    for (const item of cart) {
      try {
        // Check if product exists before updating
        const productExists = await prisma.product.findUnique({
          where: { id: item.id },
        });

        if (productExists) {
          await prisma.product.update({
            where: { id: item.id },
            data: {
              stockQuantity: {
                decrement: item.quantity, // Reduce stock
              },
            },
          });
        }
      } catch (stockError) {
        console.error(
          `Error updating stock for product ${item.id}:`,
          stockError
        );
        // Continue with other products even if one fails
      }
    }

    // Create academic details if provided
    if (academicDetails) {
      try {
        await prisma.academicDetails.create({
          data: {
            studentName: academicDetails.studentName,
            academyName: academicDetails.academyName,
            academyNo: academicDetails.academyNo,
            studentAddress: academicDetails.studentAddress,
            orderId: newOrder.id,
          },
        });
      } catch (academicError) {
        console.error("Error creating academic details:", academicError);
        // Continue even if academic details creation fails
      }
    }

    // ---- Puppeteer Invoice Generation ----
  const generateInvoicePdf = async (order) => {
  const browser = await puppeteer.launch({
  headless: "new",
  executablePath: '/root/.cache/puppeteer/chrome/linux-140.0.7339.82/chrome-linux64/chrome',
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--single-process"
  ]
});

  const page = await browser.newPage();

  // Convert logo to Base64
  const logoPath = path.join(__dirname, "../../public/logo.jpg");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoData = `data:image/jpeg;base64,${logoBase64}`;

  // Prepare table rows
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td>
          ${item.name} 
          ${
            item.selectedColor
              ? `<span style="
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background-color: ${item.selectedColorHex || '#ffffff'};
                  border: 1px solid #ccc;
                  margin-left: 5px;
                  vertical-align: middle;
                "></span>
                <span style="margin-left: 4px; font-size: 0.9em;">${item.selectedColor}</span>`
              : ''
          }
        </td>
        <td>${item.quantity}</td>
        <td>₹${(item.price / 100).toFixed(2)}</td>
        <td>₹${((item.price * item.quantity) / 100).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const subtotal = (order.totalAmount / 100).toFixed(2);
  const discount =
    typeof order.discountAmount === "number" && order.discountAmount > 0
      ? `₹${(order.discountAmount / 100).toFixed(2)}`
      : "₹0.00";

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        color: #2c3e50;
        background: #ffffff;
      }

      .header { text-align: center; padding: 10px 20px 0; border-bottom: 3px solid #3498db; }
      .header img { max-width: 100px; margin-top: 5px; }
      .header h1 { margin: 0; font-size: 28px; color: #fc6b03; letter-spacing: 1px; }

      .info-section { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 50px 10px; font-size: 14px; gap: 60px; }
      .info-left, .info-right { flex: 1; }
      .info-right { text-align: right; }
      .info-block { margin-bottom: 18px; }
      .info-block .label { font-size: 11px; color: #7f8c8d; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 0.5px; display: block; }
      .info-block strong { font-size: 16px; color: #2c3e50; }

      table { width: 90%; margin: 10px auto 30px; border-collapse: collapse; font-size: 14px; }
      thead { background: #ecf0f1; }
      th, td { padding: 12px 10px; border-bottom: 1px solid #dcdcdc; text-align: center; }
      th { color: #3498db; font-weight: 600; }
      td:first-child { text-align: left; }

      .totals { width: 90%; margin: 20px auto 40px; border-top: 2px solid #3498db; font-size: 16px; }
      .totals tr td { padding: 8px 0; }
      .totals td:nth-child(2) { text-align: right; }
      .grand td { font-size: 18px; font-weight: bold; color: #e74c3c; padding-top: 10px; }

      .footer { text-align: center; padding: 20px; color: #7f8c8d; font-size: 13px; border-top: 1px solid #ecf0f1; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>INVOICE</h1>
      <img src="${logoData}" alt="Logo" />
    </div>

    <div class="info-section">
      <div class="info-left">
        <div class="info-block">
          <span class="label">Order From</span>
          <strong>LGMSports Pvt Ltd</strong><br/>
          Omkar Nandan Soc -A2-303,<br/>
          Near Navale Bridge,<br/>
          Vadgaon Budruk, Pune-411041<br/>
          sportslgm@gmail.com | +91-7744042929
        </div>
      </div>

      <div class="info-right">
        <div class="info-block">
          <span class="label">Billed To</span>
          <b>Name</b> : ${order.firstName} ${order.lastName}<br/>
          <b>Email</b> : ${order.email}<br/>
          <b>Address</b> : ${order.address}<br/>
          <b>City</b> : ${order.city}<br/>
          <b>Pincode</b> : ${order.pincode}<br/>
          <b>State</b> : ${order.state}<br/>
          <b>Phone No.</b> : ${order.phone}
        </div>
        <div class="info-block">
          <span class="label">Order Details</span>
          Order ID: <strong>${order.id}</strong><br/>
          Payment Method: <strong>${order.paymentMethod}</strong><br/>
          Date: ${new Date(order.createdAt).toLocaleString("en-IN")}
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: left">Item Description</th>
          <th>Quantity</th>
          <th>Unit Price (₹)</th>
          <th>Total Price (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <table class="totals">
      <tr><td>Subtotal</td><td>₹${subtotal}</td></tr>
      <tr><td>Discount Applied</td><td>${discount}</td></tr>
      <tr class="grand"><td>Total Amount Payable</td><td>₹${subtotal}</td></tr>
    </table>

    <div class="footer">
      Thank you for shopping with LGMSports!
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "5mm", bottom: "20mm" },
  });

  await browser.close();
  return pdfBuffer;
};

    // Send Order Confirmation Email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Use env variables
          pass: process.env.EMAIL_PASS,
        },
      });

      const pdfBuffer = await generateInvoicePdf(newOrder);

      const orderItemsHtml = newOrder.items
        .map(
          (item) =>
            `<li>${item.name} - Quantity: ${item.quantity} - Price: ₹${(
              item.price / 100
            ).toFixed(2)}</li>`
        )
        .join("");

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "🎉 Order Confirmation from LGMSports",
        html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <header style="background: linear-gradient(90deg, #1E90FF, #FF8C00); padding: 20px; text-align: center; color: #fff;">
        <h1 style="margin: 0; font-size: 24px;">LGMSports</h1>
        <p style="font-size: 16px;">Your order has been confirmed!</p>
      </header>

      <main style="padding: 20px; color: #333;">
        <p>Hello <strong>${newOrder.firstName} ${
          newOrder.lastName
        }</strong>,</p>
        <p>Thank you for shopping with us. Below are your order and shipping details:</p>

        <section style="margin-top: 20px;">
          <h2 style="color: #1E90FF; border-bottom: 2px solid #FF8C00; padding-bottom: 8px;">🛒 Order Summary</h2>
          <ul style="list-style: none; padding: 0;">
            ${newOrder.items
              .map(
                (item) => `
              <li style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong><br/>
                Quantity: ${item.quantity} | Price: ₹${(item.price / 100).toFixed(2)}
                ${
                  item.selectedColor
                    ? ` | Color: 
                      <span style="
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: ${item.selectedColorHex || "#ffffff"};
                        border: 1px solid #ccc;
                        vertical-align: middle;
                        margin-left: 4px;
                      "></span>
                      <span style="margin-left: 4px; font-size: 0.9em;">${
                        item.selectedColor
                      }</span>`
                    : ""
                }
              </li>
            `
              )
              .join("")}
          </ul>

          <p style="margin-top: 15px; font-size: 1.1rem;">
            <strong>Total Amount:</strong> ₹${(
              newOrder.totalAmount / 100
            ).toFixed(2)}<br/>
            <strong>Payment Method:</strong> ${
              newOrder.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"
            }
          </p>
        </section>

        <section style="margin-top: 30px;">
          <h2 style="color: #1E90FF; border-bottom: 2px solid #FF8C00; padding-bottom: 8px;">📍 Shipping Address</h2>
          <p style="line-height: 1.6;">
            <strong>Phone:</strong> ${newOrder.phone}<br/>
            <strong>Address:</strong><br/>
            ${newOrder.address},<br/>
            ${newOrder.city}, ${newOrder.state} - ${newOrder.pincode}
          </p>
        </section>

        <div style="margin-top: 30px; text-align: center;">
          <a href="https://lgmsports.in" target="_blank" style="display: inline-block; background-color: #FF8C00; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
            Visit LGMSports
          </a>
        </div>

        <p style="margin-top: 25px; font-size: 0.9rem; color: #555;">
          If you have any questions, feel free to reply to this email or contact our support team.
        </p>
      </main>

      <footer style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 0.85rem; color: #777;">
        © ${new Date().getFullYear()} LGMSports. All rights reserved.
      </footer>
    </div>
  `,
        attachments: [
          {
            filename: `Invoice_${newOrder.id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getOrdersByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { email },
      include: {
        items: true, // include ordered products
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { deliveryStatus } = req.body;

  // Validate valid statuses
  const validStatuses = ["In Progress", "Shipped", "Delivered"];
  if (!validStatuses.includes(deliveryStatus)) {
    return res.status(400).json({ message: "Invalid delivery status" });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { deliveryStatus },
    });

    // Emit WebSocket event to notify user
    io.to(updatedOrder.email).emit("orderStatusUpdated", updatedOrder);

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update delivery status",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

/**
 * Get all academic details for admin panel
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllAcademicDetails = async (req, res) => {
  try {
    const academicDetails = await prisma.academicDetails.findMany({
      include: {
        order: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            totalAmount: true,
            discountAmount: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, academicDetails });
  } catch (err) {
    console.error("Error fetching academic details:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching academic details" });
  }
};

/**
 * Create academic details for an order
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createAcademicDetails = async (req, res) => {
  try {
    const {
      orderId,
      studentName,
      academyName,
      academyNo,
      studentAddress,
      discountAmount,
    } = req.body;

    if (!orderId || !studentName || !academyName || !academyNo || !studentAddress) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: orderId, studentName, academyName, and studentAddress are required",
      });
    }

    // Check if order exists
    const orderExists = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!orderExists) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if academic details already exist for this order
    const existingDetails = await prisma.academicDetails.findUnique({
      where: { orderId: parseInt(orderId) },
    });

    if (existingDetails) {
      return res.status(400).json({
        success: false,
        message: "Academic details already exist for this order",
      });
    }

    // Create academic details
    const academicDetails = await prisma.academicDetails.create({
      data: {
        studentName,
        academyName,
        academyNo,
        studentAddress,
        orderId: parseInt(orderId),
      },
    });

    // Update order with discount information if provided
    if (discountAmount) {
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          discountApplied: true,
          discountAmount: parseInt(discountAmount),
        },
      });
    }

    res.status(201).json({ success: true, academicDetails });
  } catch (err) {
    console.error("Error creating academic details:", err);
    res
      .status(500)
      .json({ success: false, message: "Error creating academic details" });
  }
};
