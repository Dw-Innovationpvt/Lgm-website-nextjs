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







































// controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../lib/prismaClient.js";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData, cart, totalAmount, discountApplied, discountAmount, couponData } = req.body;

  try {
    // Verify the payment signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Extract user email from the form data
    const userEmail = formData.email;
    if (!userEmail) {
      return res.status(400).json({ success: false, message: "User email is required" });
    }

    // Create the order in the database
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: userEmail, // Explicitly set the email field
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          paymentMethod: "razorpay",
          totalAmount: totalAmount * 100, // Convert to paise
          paymentStatus: "success",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          items: {
            create: cart.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price * 100, // Convert to paise
            })),
          },
        },
      });

      // Update stock for each product (if product exists)
      for (const item of cart) {
        const productExists = await tx.product.findUnique({
          where: { id: item.id },
        });
        
        if (productExists) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return newOrder;
    });

    res.status(200).json({ success: true, message: "Payment verified & order created successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
