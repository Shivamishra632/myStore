import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

// POST /api/orders
router.post("/", protect, addOrderItems);

// GET all orders (admin)
router.get("/", protect, admin, getOrders);

// GET logged in user orders
router.get("/myorders", protect, getMyOrders);

// GET order by id
router.get("/:id", protect, getOrderById);

// Update payment
router.put("/:id/pay", protect, updateOrderToPaid);

// Update status
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;