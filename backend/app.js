import express from "express";
import cookieParser from "cookie-parser";

import ConnectDB from "./configs/database/index.js";
import { PORT } from "./configs/env/env.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import userRoutes from "./routes/userRoute.js";

const app = express();

// Set up middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Keep this after body parsers

ConnectDB();

// Set up routes
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello and Welcome to B-Hub. The server is running 🚀");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server B-Hub is now starting on port ${PORT} ⚡`);
});
