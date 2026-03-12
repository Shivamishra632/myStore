import express from "express";
import {
  createPaymentIntent,
  updatePaymentStatus,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/intent", protect, createPaymentIntent);

router.put("/:orderId", protect, updatePaymentStatus);

export default router;