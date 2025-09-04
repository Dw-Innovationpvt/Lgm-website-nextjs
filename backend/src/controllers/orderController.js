
import prisma from "../lib/prismaClient.js";


export const createOrder = async (req, res) => {
  try {
    const { formData, cart, totalAmount, totalAmountPaise } = req.body;

    const finalAmount = typeof totalAmountPaise === "number" 
      ? totalAmountPaise 
      : totalAmount * 100;

    if (!formData || !cart || !finalAmount) {
      return res.status(400).json({ success: false, message: "Missing order data" });
    }
    
    // Extract user email from the form data
    const userEmail = formData.email;
    if (!userEmail) {
      return res.status(400).json({ success: false, message: "User email is required" });
    }

    // ✅ Start transaction: create order + update stock
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
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
          paymentMethod: formData.paymentMethod,
          totalAmount: finalAmount,
          paymentStatus: "pending",
          items: {
            create: cart.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price * 100,
            })),
          },
        },
      });

      // 2. Update stock for each product (only if product exists)
      for (const item of cart) {
        // Check if product exists before updating
        const productExists = await tx.product.findUnique({
          where: { id: item.id },
        });
        
        if (productExists) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              stockQuantity: {
                decrement: item.quantity, // ✅ Reduce stock
              },
            },
          });
        }
      }

      return newOrder;
    });

    res.status(201).json({ success: true, order });

  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getOrdersByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
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


