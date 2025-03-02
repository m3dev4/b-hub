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
} from "../controllers/userController.js";
import { isAdmin, isAuthenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/profile", isAuthenticate, getUserProfile);
router.put("/profile/update-profile", isAuthenticate, updateUserProfile);
router.delete("/profile/delete-profile", isAuthenticate, deleteUser);

// -------------------Admin -------------------
router.get("/admin/all-user", isAuthenticate, isAdmin, getAllUsers);
router.get("/admin/user/:id", isAuthenticate, isAdmin, getUserById);
router.delete("/admin/user/:id", isAuthenticate, isAdmin, deleteUserById);

export default router;
