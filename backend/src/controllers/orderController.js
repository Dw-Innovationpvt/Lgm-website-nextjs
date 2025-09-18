import prisma from "../lib/prismaClient.js";
import nodemailer from "nodemailer";
import { io } from "../server.js";
import PDFDocument from "pdfkit";
import path from 'path';

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
            studentAddress: academicDetails.studentAddress,
            orderId: newOrder.id,
          },
        });
      } catch (academicError) {
        console.error("Error creating academic details:", academicError);
        // Continue even if academic details creation fails
      }
    }

    const generateInvoicePdf = (order) => {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
          margin: 50,
          bufferPages: true,
          font: "Helvetica",
        });

        const chunks = [];
        const primaryColor = "#FF6B00";
        const accentColor = "#333333";
        const lightGray = "#F5F5F5";

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });
        doc.on("error", reject);

        // Load logo image path
        const logoPath = path.resolve('E:/Projects/Lgm-website-nextjs/Frontend/public/logo.jpg');


        // Header Section
        const headerHeight = 80;
        const pageWidth = doc.page.width;

        doc.fillColor(lightGray).rect(0, 0, doc.page.width, 80).fill();

        // Add Logo at Top Center
        doc.image(logoPath, (doc.page.width - 100) / 2, 15, {
          fit: [100, 50], // Adjust logo size (width:100px, height:50px)
          align: "center",
          valign: "top",
        });

        doc
          .fontSize(24)
          .fillColor("black")
          .text("INVOICE", 50, 30, { align: "left", bold: true })
          .fontSize(10)
          .text("LGMSports Pvt Ltd", { align: "right", lineBreak: false })
          .text("Proud Member of India Sports Association", { align: "right" });

        // Dealer Info Box
        doc
          .fillColor(lightGray)
          .rect(50, 100, 250, 75)
          .fill()
          .fontSize(10)
          .fillColor(accentColor)
          .text("Registered Office:", 60, 105)
          .text("Omkar Nandan Soc -A2-303, Near Navale Bridge,", 60, 120)
          .text("Vadgaon Budruk, Pune-411041", 60, 135)
          .text("support@lgmsports.in | +91-7744042929", 60, 150);

        // Invoice Metadata
        const invoiceDate = new Date().toLocaleDateString();
        doc
          .fontSize(14)
          .fillColor(accentColor)
          .text(`Invoice #${order.id}`, 50, 190, { bold: true })
          .fontSize(10)
          .fillColor("#666")
          .text(`Issue Date: ${invoiceDate}`, 50, 210);

        // Billing & Shipping Sections
        const sectionY = 240;
        doc
          .fontSize(12)
          .fillColor(primaryColor)
          .text("BILLING DETAILS", 50, sectionY)
          .text("SHIPPING DETAILS", 300, sectionY);

        const detailsText = [
          `${order.firstName} ${order.lastName}`,
          order.address,
          `${order.city}, ${order.state} - ${order.pincode}`,
          order.email,
          order.phone,
        ].join("\n");

        [50, 300].forEach((x) => {
          doc
            .fontSize(10)
            .fillColor("#444")
            .text(detailsText, x, sectionY + 20, {
              width: 200,
              lineBreak: true,
              paragraphGap: 4,
            });
        });

        // Divider Line
        doc
          .moveTo(50, sectionY + 85)
          .lineTo(550, sectionY + 85)
          .lineWidth(0.5)
          .strokeColor("#DDD")
          .stroke();

        // Items Table
        const tableTop = sectionY + 100;
        const colX = {
          quantity: 50,
          uom: 120,
          description: 180,
          unitPrice: 390,
          total: 480,
        };

        // Table Header with Gradient
        const gradient = doc
          .linearGradient(50, tableTop, 550, tableTop + 20)
          .stop(0, primaryColor)
          .stop(1, "#FF8C00");

        doc
          .fill(gradient)
          .rect(50, tableTop, 500, 20)
          .fill()
          .fillColor("white")
          .fontSize(10)
          .text("QTY", colX.quantity, tableTop + 5)
          .text("UNIT", colX.uom, tableTop + 5)
          .text("DESCRIPTION", colX.description, tableTop + 5)
          .text("PRICE (₹)", colX.unitPrice, tableTop + 5)
          .text("TOTAL (₹)", colX.total, tableTop + 5);

        // Table Rows
        let y = tableTop + 25;
        let subtotal = 0;

        order.items.forEach((item, index) => {
          if (index % 2 === 0) {
            doc
              .fillColor(lightGray)
              .rect(50, y - 5, 500, 20)
              .fill();
          }

          const itemTotal = (item.price / 100) * item.quantity;
          subtotal += itemTotal;

          doc
            .fillColor(accentColor)
            .fontSize(10)
            .text(item.quantity, colX.quantity, y)
            .text("EA", colX.uom, y)
            .text(item.name, colX.description, y)
            .text(
              (item.price / 100).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              colX.unitPrice,
              y
            )
            .text(
              itemTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              colX.total,
              y
            );

          y += 20;
        });

        // Totals Section
        const totalDue = subtotal;
        const totalsY = y + 30;

        doc
          .fontSize(12)
          .fillColor(accentColor)
          .text(
            `Subtotal: ₹${subtotal.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}`,
            400,
            totalsY,
            { align: "right" }
          )
          .font("Helvetica-Bold")
          .text(
            `Total Due: ₹${subtotal.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}`,
            400,
            totalsY + 20,
            {
              align: "right",
              underline: true,
            }
          );

        // Footer
        doc
          .fontSize(10)
          .fillColor("#666")
          .text(
            "Terms & Conditions: Payment due within 30 days",
            50,
            doc.page.height - 80
          )
          .text(
            "Late payments subject to 1.5% monthly interest",
            50,
            doc.page.height - 65
          )
          .text("Thank you for choosing LGMSports!", {
            align: "center",
            width: 500,
            color: primaryColor,
            bold: true,
            y: doc.page.height - 50,
          });

        // Watermark
        doc
          .opacity(0.1)
          .fontSize(80)
          .fillColor(primaryColor)
          .text("LGMSports", 100, 300, {
            align: "center",
            opacity: 0.1,
          })
          .opacity(1);

        doc.end();
      });
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
                Quantity: ${item.quantity} | Price: ₹${(
                  item.price / 100
                ).toFixed(2)}
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
      studentAddress,
      discountAmount,
    } = req.body;

    if (!orderId || !studentName || !academyName || !studentAddress) {
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
