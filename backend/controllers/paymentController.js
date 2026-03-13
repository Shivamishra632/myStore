import Razorpay from "razorpay";
import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

// Initialize Razorpay
let razorpay = null;



if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  console.log("✅ Razorpay enabled");
} else {
  console.log("⚠️ Razorpay disabled (keys not set)");
}

// Create Razorpay Order
export const createRazorpayOrder = asyncHandler(async (req, res) => {

  if (!razorpay) {
    return res.status(503).json({
      success: false,
      message: "Payment service temporarily disabled",
    });
  }

  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid payment amount");
  }

  const options = {
    amount: Math.round(amount * 100), // convert to paisa
    currency: "INR",
    receipt: "order_" + Date.now(),
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json(order);
});

// Update Payment Status
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (
    order.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  order.paymentResult = {
    id: req.body.razorpay_payment_id || "N/A",
    status: "Success",
    email_address: req.body.email || "N/A",
  };

  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
});