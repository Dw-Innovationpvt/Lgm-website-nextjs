import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const { order } = await req.json();

    // Start Puppeteer
    const browser = await puppeteer.launch({
      headless: "new", // For Next.js on Vercel use headless:true if needed
    });
    const page = await browser.newPage();

    // === Build HTML Template ===
    const logoBase64 = getBase64Logo(); // Convert logo.jpg to Base64
    const html = generateInvoiceHTML(order, logoBase64);

    // Load the HTML into Puppeteer
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate the PDF buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "5mm", bottom: "20mm" },
    });

    await browser.close();

    // Send PDF back as a response
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

// === Helper: Convert logo to Base64 ===
function getBase64Logo() {
  const logoPath = path.resolve(
    "E:/Projects/Lgm-website-nextjs/Frontend/public/logo.jpg"
  );
  const img = fs.readFileSync(logoPath);
  return `data:image/jpeg;base64,${img.toString("base64")}`;
}

// === Helper: Generate Styled HTML ===
function generateInvoiceHTML(order, logo) {
  const itemsRows = order.items
    .map(
      (item, i) => `
      <tr>
        <td>${item.name}</td>
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

  return `
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

  /* ===== HEADER ===== */
  .header {
    text-align: center;
    padding: 10px 20px 0;  
    border-bottom: 3px solid #3498db;
  }
  .header img {
  max-width: 100px;       /* ↓↓↓ Smaller logo size */
  margin-top: 5px;        /* ↓↓↓ Less gap above logo */
}
  .header h1 {
    margin: 0;
    font-size: 28px;
    color: #fc6b03;
    letter-spacing: 1px;
  }

  /* ===== INFO SECTION ===== */
.info-section {
  display: flex;                     /* ← Use flex for left/right layout */
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 50px 10px;
  font-size: 14px;
  gap: 60px;
}

.info-left {
  flex: 1;
}

.info-right {
  flex: 1;
  text-align: right;                  /* ← Align text to right side */
}

.info-block {
  margin-bottom: 18px;
}

.info-block .label {
  font-size: 11px;
  color: #7f8c8d;
  text-transform: uppercase;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
  display: block;
}

.info-block strong {
  font-size: 16px;
  color: #2c3e50;
}

  /* ===== TABLE ===== */
  table {
    width: 90%;
    margin: 10px auto 30px;
    border-collapse: collapse;
    font-size: 14px;
  }
  thead {
    background: #ecf0f1;
  }
  th, td {
    padding: 12px 10px;
    border-bottom: 1px solid #dcdcdc;
    text-align: center;
  }
  th {
    color: #3498db;
    font-weight: 600;
  }
  td:first-child {
    text-align: left;
  }

  /* ===== TOTALS ===== */
  .totals {
    width: 90%;
    margin: 20px auto 40px;
    border-top: 2px solid #3498db;
    font-size: 16px;
  }
  .totals tr td {
    padding: 8px 0;
  }
  .totals td:nth-child(2) {
    text-align: right;
  }
  .grand td {
    font-size: 18px;
    font-weight: bold;
    color: #e74c3c;
    padding-top: 10px;
  }

  /* ===== FOOTER ===== */
  .footer {
    text-align: center;
    padding: 20px;
    color: #7f8c8d;
    font-size: 13px;
    border-top: 1px solid #ecf0f1;
  }
</style>
</head>
<body>

  <div class="header">
    <h1>INVOICE</h1>
    <img src="${logo}" alt="Logo" />
  </div>

  <div class="info-section">
  <div class="info-left">
    <div class="info-block">
      <span class="label">Order From</span>
      <strong>LGM Sports</strong><br/>
      Omkar Nandan Soc -A2-303,<br/>
      Near Navale Bridge,<br/>
      Vadgaon Budruk, Pune-411041<br/>
      support@lgmsports.in | +91-7744042929
    </div>
  </div>

  <div class="info-right">
    <div class="info-block">
      <span class="label">Billed To</span>
      <b>Name</b> : ${order.firstName} ${order.lastName}<br/>
      <b>Email</b> : ${order.email}<br/>
      <b>Address</b> : ${order.address}<br/>
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
        <th>Item Description</th>
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
    Thank you for shopping with LGM Sports!
  </div>

</body>
</html>`;
}

