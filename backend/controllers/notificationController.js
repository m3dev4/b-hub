import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  getUnreadCount,
} from "../services/notifyService.js";

// Get all notifications for a user
export const getAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log("Getting notifications for user:", userId);
  
  const notifications = await getNotifications(userId);
  console.log("Found notifications:", notifications.length);
  
  res.status(200).json(notifications);
});

// Get unread notifications
export const getUnreadNotificationsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log("Getting unread notifications for user:", userId);
  
  const notifications = await getUnreadNotifications(userId);
  console.log("Found unread notifications:", notifications.length);
  
  res.status(200).json(notifications);
});

// Mark notification as read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  console.log("Marking notification as read:", notificationId);
  
  const notification = await markAsRead(notificationId);
  console.log("Notification marked as read:", notification._id);
  
  res.status(200).json(notification);
});

// Get unread notification count
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log("Getting unread count for user:", userId);
  
  const count = await getUnreadCount(userId);
  console.log("Unread count:", count);
  
  res.status(200).json({ count });
});
