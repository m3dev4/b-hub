import express from "express";
import {
  createUser,
  forgotPassword,
  login,
  logout,
  verifyEmail,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateOnboardingProfile,
} from "../controllers/userController.js";
import upload from "../middlewares/upload.middleware.js";
import { isAdmin, isAuthenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Auth routes
router.post("/register", createUser);
router.post("/login", login);
router.post("/logout", logout);

// Email & Password routes
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Profile routes
router.get("/profile", isAuthenticate, getUserProfile);
router.put("/profile/update-profile", isAuthenticate, updateUserProfile);
router.put("/onboarding-profile", isAuthenticate, upload.single('avatar'), updateOnboardingProfile);
router.delete("/profile/delete-profile", isAuthenticate, deleteUser);
router.get("/profile/:id", isAuthenticate, getUserById);

// Admin routes
router.get("/admin/all-user", isAuthenticate, isAdmin, getAllUsers);
router.delete("/admin/user/:id", isAuthenticate, isAdmin, deleteUserById);

export default router;
