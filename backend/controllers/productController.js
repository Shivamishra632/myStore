
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import redisClient from "../config/redis.js";

/* ============================================
   1️⃣ Get All Products (Pagination + Search)
============================================ */
export const getProducts = asyncHandler(async (req, res) => {

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const sortOption = req.query.sort || "newest";

  const cacheKey = `products:${page}:${req.query.keyword || "all"}:${sortOption}`;

  let cached = null;

  try {
    if (redisClient) {
      cached = await redisClient.get(cacheKey);
    }
  } catch (err) {
    console.log("Redis error:", err.message);
  }

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const count = await Product.countDocuments({ ...keyword });

  let sortBy = {};

  if (sortOption === "low") sortBy = { price: 1 };
  else if (sortOption === "high") sortBy = { price: -1 };
  else sortBy = { createdAt: -1 };

  const products = await Product.find({ ...keyword })
    .sort(sortBy)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const result = {
    products,
    page,
    pages: Math.ceil(count / pageSize),
  };

  try {
    if (redisClient) {
      await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
    }
  } catch (err) {
    console.log("Redis set error:", err.message);
  }

  res.json(result);
});


/* ============================================
   2️⃣ Get Product By ID
============================================ */
export const getProductById = asyncHandler(async (req, res) => {

  const cacheKey = `product:${req.params.id}`;

  let cached = null;

  try {
    if (redisClient) {
      cached = await redisClient.get(cacheKey);
    }
  } catch (err) {
    console.log("Redis error:", err.message);
  }

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  try {
    if (redisClient) {
      await redisClient.setEx(cacheKey, 120, JSON.stringify(product));
    }
  } catch (err) {
    console.log("Redis set error:", err.message);
  }

  res.json(product);
});


/* ============================================
   3️⃣ Create Product
============================================ */
export const createProduct = asyncHandler(async (req, res) => {

  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = new Product({
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    user: req.user._id,
  });

  const createdProduct = await product.save();

  try {
    if (redisClient) {
      await redisClient.flushAll();
    }
  } catch (err) {
    console.log("Redis flush error:", err.message);
  }

  res.status(201).json(createdProduct);
});


/* ============================================
   4️⃣ Update Product
============================================ */
export const updateProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = req.body.name ?? product.name;
  product.price = req.body.price ?? product.price;
  product.description = req.body.description ?? product.description;
  product.image = req.body.image ?? product.image;
  product.brand = req.body.brand ?? product.brand;
  product.category = req.body.category ?? product.category;
  product.countInStock = req.body.countInStock ?? product.countInStock;

  const updatedProduct = await product.save();

  try {
    if (redisClient) {
      await redisClient.flushAll();
    }
  } catch (err) {
    console.log("Redis flush error:", err.message);
  }

  res.json(updatedProduct);
});


/* ============================================
   5️⃣ Delete Product
============================================ */
export const deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  try {
    if (redisClient) {
      await redisClient.flushAll();
    }
  } catch (err) {
    console.log("Redis flush error:", err.message);
  }

  res.json({ message: "Product removed" });
});


/* ============================================
   6️⃣ Create Review
============================================ */
export const createProductReview = asyncHandler(async (req, res) => {

  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: req.params.id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = new Review({
    user: req.user._id,
    product: req.params.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  await review.save();

  const reviews = await Review.find({ product: req.params.id });

  product.numReviews = reviews.length;

  product.rating =
    reviews.length > 0
      ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
      : 0;

  await product.save();

  try {
    if (redisClient) {
      await redisClient.del(`product:${req.params.id}`);
    }
  } catch (err) {
    console.log("Redis delete error:", err.message);
  }

  res.status(201).json({ message: "Review added successfully" });
});


/* ============================================
   🧠 AI PRODUCT RECOMMENDATIONS
============================================ */
export const getRecommendedProducts = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const recommendations = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(6);

  res.json(recommendations);
});


/* ============================================
   🔥 TRENDING PRODUCTS
============================================ */
export const getTrendingProducts = asyncHandler(async (req, res) => {

  const products = await Product.find({})
    .sort({ numReviews: -1 })
    .limit(8);

  res.json(products);
});


/* ============================================
   ⭐ TOP PRODUCTS
============================================ */
export const getTopProducts = asyncHandler(async (req, res) => {

  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(6);

  res.json(products);
});

