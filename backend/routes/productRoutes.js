
import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getRecommendedProducts,
  getTrendingProducts,
  getTopProducts
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   PUBLIC ROUTES
================================= */

router.get("/", getProducts);

/* 🔥 TRENDING PRODUCTS */
router.get("/trending", getTrendingProducts);

/* ⭐ TOP PRODUCTS */
router.get("/top", getTopProducts);

/* 🧠 AI RECOMMENDATIONS */
router.get("/recommended/:id", getRecommendedProducts);

/* PRODUCT BY ID (always last dynamic route) */
router.get("/:id", getProductById);


/* ===============================
   ADMIN ROUTES
================================= */

router.post("/", protect, admin, createProduct);

router.put("/:id", protect, admin, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);


/* ===============================
   REVIEWS
================================= */

router.post("/:id/reviews", protect, createProductReview);

export default router;

