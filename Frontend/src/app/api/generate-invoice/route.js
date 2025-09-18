import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";

export async function POST(req) {
  try {
    const { order } = await req.json();

    const pdfBuffer = await generateInvoicePdf(order);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${order.id}.pdf`,
      },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}

function generateInvoicePdf(order) {
  return new Promise((resolve, reject) => {
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );

    // Initialize PDFDocument with explicit font
    const doc = new PDFDocument({
      margin: 50,
      font: fontPath, // Set the custom font from the start
    });

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const logoPath = path.resolve(
      "E:/Projects/Lgm-website-nextjs/Frontend/public/logo.jpg"
    );

    // ✅ Draw logo at top center
    doc.image(logoPath, (doc.page.width - 150) / 2, 20, {
      fit: [150, 75], // Increased size
      align: "center",
      valign: "top",
    });
    doc.moveDown(2);

    // Header
    doc
      .fillColor("#2c3e50")
      .fontSize(28)
      .text("INVOICE", { align: "center", underline: false });
    doc.moveDown(2.5);

    // Order Info
    const infoLeftX = 50;
    const infoRightX = 350;
    let infoY = doc.y;

    doc
      .fillColor("#7f8c8d")
      .fontSize(10)
      .text("BILLED TO:", infoLeftX, infoY)
      .fillColor("#2c3e50")
      .fontSize(12)
      .text(order.email, infoLeftX, infoY + 15)
      .text(order.phone, infoLeftX, infoY + 30)

      .fillColor("#7f8c8d")
      .text("ORDER DETAILS:", infoRightX, infoY)
      .fillColor("#2c3e50")
      .text(`Order ID: ${order.id}`, infoRightX, infoY + 15)
      .text(
        `Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`,
        infoRightX,
        infoY + 30
      );

    doc
      .moveTo(50, infoY + 50)
      .lineTo(550, infoY + 50)
      .strokeOpacity(0.1)
      .stroke();
    doc.moveDown(3);

    // Table Header
    const tableTop = doc.y;
    const headers = [
      { text: "Item Description", x: 50 },
      { text: "Quantity", x: 300 },
      { text: "Unit Price (₹)", x: 370 },
      { text: "Total Price (₹)", x: 450 },
    ];

    doc.rect(50, tableTop - 10, 500, 25).fill("#f8f9fa");
    headers.forEach((header) => {
      doc
        .fillColor("#3498db")
        .fontSize(12)
        .text(header.text, header.x, tableTop);
    });
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke("#bdc3c7");

    // Table Rows
    let currentY = tableTop + 25;
    order.items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.rect(50, currentY - 5, 500, 20).fill("#f8f9fa");
      }

      const totalPrice = ((item.price * item.quantity) / 100).toFixed(2);
      const unitPrice = (item.price / 100).toFixed(2);

      doc
        .fillColor("#2c3e50")
        .fontSize(11)
        .text(item.name, 50, currentY)
        .text(item.quantity.toString(), 300, currentY, {
          width: 50,
          align: "center",
        })
        .text(unitPrice, 370, currentY, { width: 80, align: "right" })
        .text(totalPrice, 450, currentY, { width: 80, align: "right" });

      currentY += 20;
    });

    doc.moveTo(50, currentY).lineTo(550, currentY).strokeOpacity(0.3).stroke();
    currentY += 20;

    // Subtotal
    const subtotal = (order.totalAmount / 100).toFixed(2);
    doc
      .fillColor("#2c3e50")
      .fontSize(12)
      .text("Subtotal:", 50, currentY)
      .text(`₹${subtotal}`, 450, currentY, { width: 80, align: "right" });

    currentY += 20;

    // Discount
    const discountInfo =
      typeof order.discountAmount === "number" && order.discountAmount > 0
        ? `₹${(order.discountAmount / 100).toFixed(2)}`
        : "₹0.00";

    doc
      .fillColor("#2c3e50")
      .fontSize(12)
      .text("Discount Applied:", 50, currentY)
      .text(discountInfo, 450, currentY, { width: 80, align: "right" });

    currentY += 30;

    // Total Amount Payable (bold & larger)
    doc
      .fillColor("#e74c3c")
      .fontSize(14)
      .text("Total Amount Payable:", 50, currentY)
      .text(`₹${subtotal}`, 450, currentY, { width: 80, align: "right" });

    currentY += 40;

    // Footer Thank you note
    doc
      .fillColor("#2c3e50")
      .fontSize(12)
      .text("Thank you for shopping with LGMSports!", 50, currentY, {
        align: "center",
      });

    doc.end();
  });
}
