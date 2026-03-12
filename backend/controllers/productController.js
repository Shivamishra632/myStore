import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

// ============================================
// 1️⃣ Get All Products (Pagination + Search)
// GET /api/products
// Public
// ============================================
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

  const count = await Product.countDocuments({ ...keyword });

  const sortOption = req.query.sort || "newest";

  let sortBy = {};

  if (sortOption === "low") {
    sortBy = { price: 1 };
  } else if (sortOption === "high") {
    sortBy = { price: -1 };
  } else {
    sortBy = { createdAt: -1 };
  }

  const products = await Product.find({ ...keyword })
    .sort(sortBy)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// ============================================
// 2️⃣ Get Product By ID
// GET /api/products/:id
// Public
// ============================================
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ============================================
// 3️⃣ Create Product
// POST /api/products
// Private/Admin
// ============================================
export const createProduct = asyncHandler(async (req, res) => {
  try {
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
    res.status(201).json(createdProduct);
  }catch(error){
     res.status(500).json({ message: error.message });
  }

    

});

// ============================================
// 4️⃣ Update Product
// PUT /api/products/:id
// Private/Admin
// ============================================
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = image ?? product.image;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.countInStock = countInStock ?? product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ============================================
// 5️⃣ Delete Product
// DELETE /api/products/:id
// Private/Admin
// ============================================
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ============================================
// 6️⃣ Create Review (Separate Collection)
// POST /api/products/:id/reviews
// Private
// ============================================
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if already reviewed
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: req.params.id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  // Create review
  const review = new Review({
    user: req.user._id,
    product: req.params.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  await review.save();

  // Update product rating
  const reviews = await Review.find({ product: req.params.id });

  product.numReviews = reviews.length;
  product.rating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

  await product.save();

  res.status(201).json({ message: "Review added successfully" });
});