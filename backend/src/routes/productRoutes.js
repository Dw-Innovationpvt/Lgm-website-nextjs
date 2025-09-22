// // // import express from 'express';
// // // import {
// // //   getAllProducts,
// // //   createProduct,
// // //   updateProductStockByAdmin,
// // //   deleteProduct,
// // //   getProductById,
// // // } from '../controllers/productController.js';

// // // const router = express.Router();

// // // router.get('/', getAllProducts);
// // // router.get('/:id', getProductById);
// // // router.post('/', createProduct);
// // // router.put('/:id/admin-stock', updateProductStockByAdmin); 
// // // router.delete('/:id', deleteProduct);

// // // export default router;





// // import express from "express";
// // import { getOutOfStockProducts, updateStock } from "../controllers/productController.js";

// // const router = express.Router();

// // // Existing routes...
// // router.get("/out-of-stock", getOutOfStockProducts);
// // router.put("/update-stock/:id", updateStock);

// // export default router;




// import express from "express";
// import { 
//   getOutOfStockProducts, 
//   updateStock, 
//   getAllProducts 
// } from "../controllers/productController.js";

// const router = express.Router();

// // Get ALL products
// router.get("/", getAllProducts);

// // Get only out-of-stock products
// router.get("/out-of-stock", getOutOfStockProducts);

// // Update stock of a product
// router.put("/update-stock/:id", updateStock);

// export default router;







// routes/productRoutes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { updateStock } from "../controllers/productController.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }, // latest first
      include: { 
        colors: true, // ✅ include all related ProductColor entries
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ADD a new product (for admin)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stockQuantity, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stockQuantity,
        imageUrl,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// UPDATE stock quantity for a product (for admin)
router.put("/:id/stock", async (req, res) => {
  try {
    const { id } = req.params; // Product ID is a string in the schema
    const { stockQuantity } = req.body;
    
    if (stockQuantity === undefined || isNaN(parseInt(stockQuantity))) {
      return res.status(400).json({ success: false, message: "Valid stock quantity is required" });
    }
    
    // Update the product stock
    const updatedProduct = await prisma.product.update({
      where: { id: id }, // Use the ID as a string
      data: { stockQuantity: parseInt(stockQuantity) },
    });
    
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({ success: false, message: "Failed to update product stock" });
  }
});

// routes/productRoutes.js

// Correct route for price update using Prisma
router.put("/:id/price", async (req, res) => {
  try {
    const { id } = req.params;
    const { newPrice } = req.body;

    if (newPrice === undefined || isNaN(parseFloat(newPrice))) {
      return res.status(400).json({ success: false, message: "Valid price is required" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { price: parseFloat(newPrice) },
    });

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product price:", error);
    res.status(500).json({ success: false, message: "Failed to update product price" });
  }
});


export default router;
