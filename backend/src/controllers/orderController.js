import prisma from "../lib/prismaClient.js";


export const createOrder = async (req, res) => {
  try {
    const { formData, cart, totalAmount, totalAmountPaise, academicDetails } = req.body;

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
        discountAmount: academicDetails ? (academicDetails.discountAmount || 0) : 0,
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
        console.error(`Error updating stock for product ${item.id}:`, stockError);
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
            orderId: newOrder.id
          }
        });
      } catch (academicError) {
        console.error("Error creating academic details:", academicError);
        // Continue even if academic details creation fails
      }
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
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ success: true, academicDetails });
  } catch (err) {
    console.error("Error fetching academic details:", err);
    res.status(500).json({ success: false, message: "Error fetching academic details" });
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
    const { orderId, studentName, academyName, studentAddress, discountAmount } = req.body;

    if (!orderId || !studentName || !academyName || !studentAddress) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: orderId, studentName, academyName, and studentAddress are required" 
      });
    }

    // Check if order exists
    const orderExists = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    });

    if (!orderExists) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if academic details already exist for this order
    const existingDetails = await prisma.academicDetails.findUnique({
      where: { orderId: parseInt(orderId) }
    });

    if (existingDetails) {
      return res.status(400).json({ success: false, message: "Academic details already exist for this order" });
    }

    // Create academic details
    const academicDetails = await prisma.academicDetails.create({
      data: {
        studentName,
        academyName,
        studentAddress,
        orderId: parseInt(orderId)
      }
    });

    // Update order with discount information if provided
    if (discountAmount) {
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          discountApplied: true,
          discountAmount: parseInt(discountAmount)
        }
      });
    }

    res.status(201).json({ success: true, academicDetails });
  } catch (err) {
    console.error("Error creating academic details:", err);
    res.status(500).json({ success: false, message: "Error creating academic details" });
  }
};
