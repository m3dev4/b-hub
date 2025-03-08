import { create } from "zustand";
import { io } from "socket.io-client";
import { notificationApi } from "@/lib/notification/api";

interface NotificationState {
  socket: any;
  notifications: any[];
  unreadCount: number;
  initializeSocket: (userId: string) => void;
  addNotification: (notification: any) => void;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}

export const useNotification = create<NotificationState>((set, get) => ({
  socket: null,
  notifications: [],
  unreadCount: 0,

  initializeSocket: (userId: string) => {
    if (!userId) {
      console.error("No user ID provided for socket initialization");
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_BASE_URL_SERVER || "http://localhost:8080", {
      withCredentials: true,
      auth: { userId },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("notification", (notification) => {
      console.log("Received notification:", notification);
      get().addNotification(notification);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    set({ socket });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  loadNotifications: async () => {
    try {
      const response = await notificationApi.getAllNotifications();
      console.log("Loaded notifications:", response.data);
      set({ 
        notifications: response.data,
        unreadCount: response.data.filter((n: any) => !n.read).length 
      });
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },
}));
