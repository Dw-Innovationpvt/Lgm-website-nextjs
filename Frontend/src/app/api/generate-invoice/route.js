import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const { order } = await req.json();

    // ✅ Launch Puppeteer (Hostinger/Vercel-friendly flags)
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // ✅ Convert both logos to Base64
    const firstLogoBase64 = getBase64FromPublic("logo.jpg");
    const secondLogoBase64 = getBase64FromPublic("new-logo.png");

    // ✅ Build HTML with both logos
    const html = generateInvoiceHTML(order, firstLogoBase64, secondLogoBase64);

    // ✅ Generate PDF
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "5mm", bottom: "20mm" },
    });

    await browser.close();

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

// ✅ Helper to convert a file in /public to Base64
function getBase64FromPublic(fileName) {
  const logoPath = path.resolve(`./public/${fileName}`);
  const img = fs.readFileSync(logoPath);
  const ext = fileName.endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${img.toString("base64")}`;
}

// ✅ HTML generator (fixed variable names)
function generateInvoiceHTML(order, firstLogo, secondLogo) {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td>
          ${item.name}
          ${
            item.selectedColor
              ? `<span style="
                  display:inline-block;width:12px;height:12px;
                  border-radius:50%;background-color:${
                    item.selectedColorHex || "#ffffff"
                  };border:1px solid #ccc;margin-left:5px;vertical-align:middle;">
                </span>
                <span style="margin-left:4px;font-size:0.9em;">
                  ${item.selectedColor}
                </span>`
              : ""
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

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin:0; padding:0; color:#2c3e50; }
  .header-row { display:flex; justify-content:space-between; align-items:center; padding:0 20px; }
  .logo-right { max-width:70px; height:auto; }
  .invoice-heading { font-size:38px; font-weight:bold; text-transform:uppercase; margin-right:73px; }
  .logo-center-wrapper { display:flex; justify-content:center; margin-bottom:10px; }
  .logo-center { max-width:140px; height:auto; }
  .info-section { display:flex; justify-content:space-between; padding:20px 50px 10px; font-size:14px; gap:60px; }
  .info-left, .info-right { flex:1; }
  .info-right { text-align:right; }
  .info-block { margin-bottom:18px; }
  .info-block .label { font-size:11px; color:#7f8c8d; text-transform:uppercase; margin-bottom:5px; letter-spacing:0.5px; display:block; }
  table { width:90%; margin:10px auto 30px; border-collapse:collapse; font-size:14px; }
  thead { background:#ecf0f1; }
  th, td { padding:12px 10px; border-bottom:1px solid #dcdcdc; text-align:center; }
  th { color:#3498db; font-weight:600; }
  td:first-child { text-align:left; }
  .totals { width:90%; margin:20px auto 40px; border-top:2px solid #3498db; font-size:16px; }
  .totals tr td { padding:8px 0; }
  .totals td:nth-child(2) { text-align:right; }
  .grand td { font-size:18px; font-weight:bold; color:#e74c3c; padding-top:10px; }
  .gst { font-size:10px; color:#7f8c8d; }
  .footer { text-align:center; padding:20px; color:#7f8c8d; font-size:13px; border-top:1px solid #ecf0f1; }
</style>
</head>
<body>

  <!-- Top Row with First Logo -->
  <div class="header-row">
    <img src="${firstLogo}" alt="First Logo" class="logo-right" />
    <h1 class="invoice-heading">INVOICE</h1>
    <div></div>
  </div>

  <!-- Second Logo Centered Below Heading -->
  <div class="logo-center-wrapper">
    <img src="${secondLogo}" alt="Second Logo" class="logo-center" />
  </div>
  <hr/>
  
  <div class="info-section">
    <div class="info-left">
      <div class="info-block">
        <span class="label">Order From</span>
        <strong>LGM Sports</strong><br/>
        Omkar Nandan Soc -A2-303,<br/>
        Near Navale Bridge,<br/>
        Vadgaon Budruk, Pune-411041<br/>
        sportslgm@gmail.com <br/>
        +91-7744042929 | +91-7744892424<br/>
        https://lgmsports.in/
      </div>
    </div>

    <div class="info-right">
      <div class="info-block">
        <span class="label">Billed To</span>
        <b>Name</b>: ${order.firstName} ${order.lastName}<br/>
        <b>Email</b>: ${order.email}<br/>
        <b>Address</b>: ${order.address}<br/>
        <b>City</b>: ${order.city}<br/>
        <b>Pincode</b>: ${order.pincode}<br/>
        <b>State</b>: ${order.state}<br/>
        <b>Phone</b>: ${order.phone}
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
    <tr class="grand"><td>Total Amount Payable</td><td>₹${subtotal}<span class="gst">(including GST)</span></td></tr>
  </table>

  <div class="footer">
    Thank you for shopping with LGM Sports!
  </div>

</body>
</html>`;
}
