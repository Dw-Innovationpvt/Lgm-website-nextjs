import express from "express";
import { generateInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

// POST /api/generate-invoice
router.post("/generate-invoice", generateInvoice);

export default router;
