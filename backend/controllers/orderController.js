
import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ===============================
   1️⃣ Create New Order
   POST /api/orders
   Private
================================= */
export const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {

    /* 🔹 Reduce Stock */

    for (const item of orderItems) {

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      product.countInStock -= item.qty;

      await product.save();
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || "COD",
      isPaid: paymentMethod === "Stripe" ? false : false,
      status: "Pending",
    });

    const createdOrder = await order.save();


    /* 🔔 LIVE ORDER NOTIFICATION */

    if (global.io) {
      global.io.emit("newOrder", {
        orderId: createdOrder._id,
        total: createdOrder.totalPrice
      });
    }


    /* 📊 REAL TIME SALES ANALYTICS */

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    const totalRevenue = revenue[0]?.total || 0;

    if (global.io) {
      global.io.emit("salesUpdate", totalRevenue);
    }


    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   2️⃣ Get Logged-in User Orders
================================= */
export const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


/* ===============================
   3️⃣ Get Order By ID
================================= */
export const getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)
      .populate("user", "_id name email");

    if (
      order &&
      (
        order.user._id.toString() === req.user._id.toString()
        || req.user.isAdmin
      )
    ) {

      res.json(order);

    } else {

      res.status(404).json({ message: "Order not found" });

    }

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ===============================
   4️⃣ Update Order To Paid
================================= */
export const updateOrderToPaid = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (
      order &&
      (
        order.user.toString() === req.user._id.toString()
        || req.user.isAdmin
      )
    ) {

      order.isPaid = true;
      order.paidAt = Date.now();

      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);

    } else {

      res.status(404).json({ message: "Order not found" });

    }

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ===============================
   5️⃣ Update Order Status (Admin)
================================= */
export const updateOrderStatus = async (req, res) => {

  const { status } = req.body;

  const validStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (status === "Delivered") {

      order.isDelivered = true;
      order.deliveredAt = Date.now();

      order.isPaid = true;
      order.paidAt = Date.now();

    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ===============================
   6️⃣ Get All Orders (Admin)
================================= */
export const getOrders = async (req, res) => {

  try {

    const orders = await Order.find({})
      .populate("user", "_id name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

