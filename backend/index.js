import express from "express";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


connectDB();

const app = express();
app.use(express.json());
app.use(cors());

/* Create HTTP server */
const server = http.createServer(app);

/* Socket.IO setup */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* Make socket global */
global.io = io;

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/* Routes */
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

/* Middleware */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

/* IMPORTANT: use server.listen */
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);