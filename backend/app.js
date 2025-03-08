"use strict";

import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import ConnectDB from "./configs/database/index.js";
import { PORT } from "./configs/env/env.js";
import initializeSocket from "./configs/websocket/socket.js";

import errorHandler from "./middlewares/errorHandler.middleware.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import followRoutes from "./routes/followRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import recommendationRoutes from "./routes/recommendationRoute.js";

import helmetMiddleware from "./security/helmet/helmet.js";
import corsMiddleware from "./security/cors/cors.js";
import limiter from "./security/ratelimit/rateLimit.js";
import potentialIntrusionMiddleware from "./security/ids/potentialIntrusion.js";
import loggingMiddleware from "./security/loggingMiddleware.js";

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

// Set up middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use security middleware
app.use(helmetMiddleware());
app.use(limiter);
app.use(corsMiddleware);
app.use(loggingMiddleware);

// Connect to MongoDB
ConnectDB();

// Make io accessible to routes
app.set("io", io);

// Set up routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/follows", followRoutes);

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Test route
app.get("/", (req, res) => {
  res.send("Hello and Welcome to B-Hub. The server is running ");
});

app.use(errorHandler);

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server B-Hub is now starting on port ${PORT} `);
});

export { app, server };