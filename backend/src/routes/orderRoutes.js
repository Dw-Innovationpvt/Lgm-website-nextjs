import express from "express";
import { createOrder, getOrdersByEmail, getAllOrders, getAllAcademicDetails, createAcademicDetails } from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getOrdersByEmail); 

// Academic details routes
router.post("/academic-details", createAcademicDetails);

// Admin routes
router.get("/admin/orders", getAllOrders);
router.get("/admin/academic-details", getAllAcademicDetails);

export default router;
