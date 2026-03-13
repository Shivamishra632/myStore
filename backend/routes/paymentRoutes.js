
import express from "express";
import {
  createRazorpayOrder,
  updatePaymentStatus,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Razorpay Order
router.post("/create-order", protect, createRazorpayOrder);

// Update Order Payment Status
router.put("/:orderId", protect, updatePaymentStatus);

export default router;

