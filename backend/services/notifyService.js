import Notification from "../models/notificationModel.js";

export const createNotification = async ({
  recipient,
  type,
  content,
  relatedPost = null,
  sender = null,
}) => {
  try {
    const notification = new Notification({
      recipient,
      type,
      content,
      relatedPost,
      sender,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId) => {
  try {
    return await Notification.find({ recipient: userId, read: false })
      .populate("sender", "username profilePicture")
      .populate("relatedPost", "content")
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des notifications non lues:",
      error
    );
    throw error;
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false,
      });
    }
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "No autorisé a modifié cette notification",
        success: false,
      });
    }
    notification.read = true;
    await notification.save();
    return res.status(200).json({
      message: "Notification marquée comme lue",
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNotifications = async (userId) => {
  return Notification.find({ recipient: userId })
    .populate("sender")
    .populate("releatedPost")
    .sort({ createdAt });
};

export const markAsRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
};

export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ recipient: userId, read: false });
};
