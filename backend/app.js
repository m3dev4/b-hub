import express from "express";
import cookieParser from "cookie-parser";
import http from "http"

import fs from "fs";
import path from "path";

import ConnectDB from "./configs/database/index.js";
import { PORT } from "./configs/env/env.js";
import initializeSocket from "./configs/websocket/socket.js";

import errorHandler from "./middlewares/errorHandler.middleware.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import recommendationRoutes from "./routes/recommendationRoute.js";
import followRoutes from "./routes/followRoute.js";

import helmetMiddleware from "./security/helmet/helmet.js";
import limiter from "./security/ratelimit/rateLimit.js";
import corsMiddleware from "./security/cors/cors.js";
import potentialIntrusionMiddleware from "./security/ids/potentialIntrusion.js";
import loggingMiddleware from "./security/loggingMiddleware.js";

const app = express();
const server = http.createServer(app)
const io = initializeSocket(server)

// Set up middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Keep this after body parsers


// Use security middleware
app.use(helmetMiddleware());
app.use(limiter);
// app.use(corsMiddleware)
// app.use(potentialIntrusionMiddleware);
app.use(loggingMiddleware);

ConnectDB();

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

app.use("/uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.send("Hello and Welcome to B-Hub. The server is running 🚀");
});

app.set("io", io);

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server B-Hub is now starting on port ${PORT} ⚡`);
});


export {app, server}