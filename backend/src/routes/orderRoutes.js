import express from "express";
import { createOrder, getOrdersByEmail, getAllOrders, getAllAcademicDetails, createAcademicDetails, updateDeliveryStatus  } from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getOrdersByEmail); 

// Update delivery status
router.put("/orders/:id/status", updateDeliveryStatus);

// Academic details routes
router.post("/academic-details", createAcademicDetails);

// Admin routes
router.get("/admin/orders", getAllOrders);
router.get("/admin/academic-details", getAllAcademicDetails);

export default router;
