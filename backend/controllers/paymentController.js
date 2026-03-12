import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

let stripe;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Stripe key not found");
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export const createPaymentIntent = asyncHandler(async (req, res) => {
  if (!stripe) {
    res.status(500);
    throw new Error("Stripe not initialized");
  }

  const { totalPrice } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalPrice * 100),
    currency: "inr",
    payment_method_types: ["card"],
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
});

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
    id: req.body.id,
    status: req.body.status,
    email_address: req.body.email_address,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});