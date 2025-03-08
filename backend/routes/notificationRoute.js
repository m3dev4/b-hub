import express from "express";
import {
  getAllNotifications,
  getUnreadNotificationsController,
  markNotificationAsRead,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js";
import { isAuthenticate } from "../middlewares/auth.middleware.js";


const router = express.Router();

// Protect all routes
router.use(isAuthenticate);

// Get all notifications
router.get("/", getAllNotifications);

// Get unread notifications
router.get("/unread", getUnreadNotificationsController);

// Mark notification as read
router.put("/:notificationId/read", markNotificationAsRead);

// Get unread count
router.get("/unread/count", getUnreadNotificationCount);

export default router