import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
console.log(process.env.RAZORPAY_KEY_ID);

const app = express();
const prisma = new PrismaClient();

// Apply middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);

// Create HTTP server and initialize Socket.io
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend domain
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected via WebSocket");

  socket.on("joinRoom", (email) => {
    socket.join(email); // Each user joins their own room by email
    console.log(`Client joined room: ${email}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server and connect Prisma
const PORT = process.env.PORT || 5000;
prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully");

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
