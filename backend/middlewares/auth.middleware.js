import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.middleware.js";

const isAuthenticate = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401).send("Vous n'êtes pas authentifié");
    }
  }
});


const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(401).send("Vous n'êtes pas administrateur");
    }
  });

export { isAuthenticate, isAdmin };
