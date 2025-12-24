// // // controllers/paymentController.js

// // import Razorpay from "razorpay";
// // import crypto from "crypto";

// // const razorpay = new Razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_KEY_SECRET,
// // });

// // export const createOrder = async (req, res) => {
// //   const { amount } = req.body;

// //   try {
// //     const options = {
// //       amount: amount * 100, // amount in paise
// //       currency: "INR",
// //       receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
// //     };

// //     const order = await razorpay.orders.create(options);
// //     res.json(order);
// //   } catch (error) {
// //     console.error("Error creating Razorpay order:", error);
// //     res.status(500).json({ error: "Failed to create order" });
// //   }
// // };

// // export const verifyPayment = async (req, res) => {
// //   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

// //   const sign = razorpay_order_id + "|" + razorpay_payment_id;
// //   const expectedSign = crypto
// //     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //     .update(sign.toString())
// //     .digest("hex");

// //   if (expectedSign === razorpay_signature) {
// //     res.status(200).json({ success: true, message: "Payment verified successfully" });
// //   } else {
// //     res.status(400).json({ success: false, message: "Invalid signature" });
// //   }
// // };





// import Razorpay from "razorpay";
// import crypto from "crypto";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export const createOrder = async (req, res) => {
//   const { amount, orderId } = req.body; // orderId from your DB order

//   try {
//     const options = {
//       amount: amount * 100, // paise
//       currency: "INR",
//       receipt: `order_rcptid_${orderId}`,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ error: "Failed to create order" });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

//   try {
//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign.toString())
//       .digest("hex");

//     if (expectedSign === razorpay_signature) {
//       // ✅ Save payment details in DB
//       await prisma.order.update({
//         where: { id: dbOrderId },
//         data: {
//           razorpayOrderId: razorpay_order_id,
//           razorpayPaymentId: razorpay_payment_id,
//           razorpaySignature: razorpay_signature,
//           paymentStatus: "success",
//         },
//       });

//       res.status(200).json({ success: true, message: "Payment verified & stored" });
//     } else {
//       // ❌ Save failed attempt
//       await prisma.order.update({
//         where: { id: dbOrderId },
//         data: { paymentStatus: "failed" },
//       });

//       res.status(400).json({ success: false, message: "Invalid signature" });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };



// import Razorpay from "razorpay";
// import crypto from "crypto";
// import prisma from "../lib/prismaClient.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export const createOrder = async (req, res) => {
//   const { amount, orderId } = req.body;
//   try {
//     const order = await razorpay.orders.create({
//       amount: amount * 100,
//       currency: "INR",
//       receipt: `order_${orderId}`,
//     });
//     res.json(order);
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ error: "Failed to create order" });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

//   try {
//     const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign)
//       .digest("hex");

//     if (expectedSign === razorpay_signature) {
//       await prisma.order.update({
//         where: { id: dbOrderId },
//         data: {
//           razorpayOrderId: razorpay_order_id,
//           razorpayPaymentId: razorpay_payment_id,
//           razorpaySignature: razorpay_signature,
//           paymentStatus: "success",
//         },
//       });
//       res.status(200).json({ success: true, message: "Payment verified & stored" });
//     } else {
//       await prisma.order.update({
//         where: { id: dbOrderId },
//         data: { paymentStatus: "failed" },
//       });
//       res.status(400).json({ success: false, message: "Invalid signature" });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };






































import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../lib/prismaClient.js";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * =========================
 * CREATE RAZORPAY ORDER
 * =========================
 * Expects: { amount }
 * amount = total amount in rupees
 */
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error("❌ Razorpay order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

/**
 * =========================
 * VERIFY PAYMENT & SAVE ORDER
 * =========================
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
      cart,
      totalAmount,
      discountApplied,
      discountAmount,
      couponData,
    } = req.body;

    // Basic validation
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details",
      });
    }

    // Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    if (!formData?.email) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    // Transaction: create order + items + update stock
    await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,

          paymentMethod: "razorpay",
          paymentStatus: "success",

          totalAmount: totalAmount * 100, // paise
          discountApplied: discountApplied || false,
          discountAmount: discountAmount ? discountAmount * 100 : 0,
          couponCode: couponData?.code || null,

          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,

          items: {
            create: cart.map((item) => ({
              productId: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price * 100, // paise
            })),
          },
        },
      });

      // Update stock
      for (const item of cart) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified & order placed successfully",
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying payment",
    });
  }
};











































// // backend/src/controllers/paymentController.js
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import prisma from "../lib/prismaClient.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// /**
//  * Create a Razorpay order.
//  * Expects: { amountPaise: number, dbOrderId: number }
//  * Returns Razorpay order object.
//  */
// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amountPaise, dbOrderId } = req.body;
//     if (!amountPaise || !dbOrderId) {
//       return res.status(400).json({ success: false, message: "Missing amountPaise or dbOrderId" });
//     }

//     const options = {
//       amount: amountPaise, // in paise
//       currency: "INR",
//       receipt: `receipt_${dbOrderId}_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     // Save razorpayOrderId on DB order (optional but helpful)
//     await prisma.order.update({
//       where: { id: Number(dbOrderId) },
//       data: { razorpayOrderId: order.id },
//     });

//     return res.json({ success: true, order });
//   } catch (err) {
//     console.error("createRazorpayOrder error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /**
//  * Verify Razorpay payment & update DB.
//  * Expects: { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId }
//  */
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
//       return res.status(400).json({ success: false, message: "Missing verification fields" });
//     }

//     const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign)
//       .digest("hex");

//     if (expectedSign === razorpay_signature) {
//       await prisma.order.update({
//         where: { id: Number(dbOrderId) },
//         data: {
//           razorpayPaymentId: razorpay_payment_id,
//           razorpaySignature: razorpay_signature,
//           paymentStatus: "success",
//         },
//       });

//       return res.status(200).json({ success: true, message: "Payment verified & stored" });
//     } else {
//       await prisma.order.update({
//         where: { id: Number(dbOrderId) },
//         data: { paymentStatus: "failed" },
//       });
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }
//   } catch (err) {
//     console.error("verifyPayment error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
