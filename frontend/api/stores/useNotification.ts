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
      console.error("Aucun ID utilisateur fourni pour l'initialisation du socket");
      return;
    }

    // Déconnexion du socket existant si présent
    if (get().socket) {
      get().socket.disconnect();
    }

    const socket = io(process.env.NEXT_PUBLIC_BASE_URL_SERVER || "http://localhost:8080", {
      withCredentials: true,
      auth: { userId },
    });

    socket.on("connect", () => {
      console.log("Socket connecté avec succès");
    });

    socket.on("notification", (notification) => {
      console.log("Notification reçue:", notification);
      get().addNotification(notification);
    });

    socket.on("connect_error", (error) => {
      console.error("Erreur de connexion socket:", error);
    });

    set({ socket });
    
    // Forcer un rechargement des notifications après connexion au socket
    setTimeout(() => {
      get().loadNotifications();
    }, 500);
  },

  addNotification: (notification) => {
    console.log("Ajout de la notification:", notification);
    // Vérification pour éviter les doublons
    set((state) => {
      const exists = state.notifications.some(n => n._id === notification._id);
      if (exists) return state;
      
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  loadNotifications: async () => {
    try {
      const response = await notificationApi.getAllNotifications();
      console.log("Réponse de l'API:", response);
      console.log("Notifications chargées:", response.data);
      set({ 
        notifications: response.data,
        unreadCount: response.data.filter((n: any) => !n.read).length 
      });
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  },
}));