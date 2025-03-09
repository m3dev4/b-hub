import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_SERVER || "http://localhost:8080",
  withCredentials: true,
});

export const notificationApi = {
  getAllNotifications: () => apiInstance.get("/api/v1/notifications"),
  markAsRead: (notificationId: string) => apiInstance.put(`/api/v1/notifications/${notificationId}/read`),
  getUnreadCount: () => apiInstance.get("/api/v1/notifications/unread/count"),
};