import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // 🔥 Prevent duplicate review
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: product._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  // Create review
  const review = new Review({
    user: req.user._id,
    product: product._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  await review.save();

  // Update product rating
  const reviews = await Review.find({ product: product._id });

  product.numReviews = reviews.length;
  product.rating =
    reviews.reduce((acc, item) => acc + item.rating, 0) /
    reviews.length;

  await product.save();

  res.status(201).json({ message: "Review Added Successfully" });
});