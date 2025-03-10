"use client";
import { useNotification } from "@/api/stores/useNotification";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Image from "next/image";

const NotificationsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { currentUser } = useAuth();
  const notificationStore = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser?._id);
      console.log(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const initializeNotitifications = async () => {
      try {
        if (!currentUser?._id) {
          console.log("No user found, waiting for authentication...");
          return;
        }

        console.log("Initializing notifications for user:", currentUser._id);
        notificationStore.initializeSocket(currentUser._id);
        await notificationStore.loadNotifications();
      } catch (error) {
        console.error("Error initializing notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeNotitifications();

    return () => {
      if (notificationStore.socket) {
        console.log("Déconnexion du socket lors du démontage");
        notificationStore.socket.disconnect();
      }
    };
  }, [currentUser?._id]);

  useEffect(() => {
    if (!currentUser?._id) return;

    const interval = setInterval(() => {
      notificationStore.loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser?._id]);

  if (!currentUser) {
    return <div>Not authenticated</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr})
  }

  console.log(`Affichage de ${notificationStore.notifications.length} notifications, dont ${notificationStore.unreadCount} non lues`);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notificationStore.notifications.length > 0 ? 
          notificationStore.notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg shadow-sm border ${
                notification.read ? "bg-gray-50" : "bg-white border-blue-100"
              }`}
              onClick={() => !notification.read && notificationStore.markAsRead(notification._id)}
            >
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={notification.sender?.profilePicture || "/default-avatar.png"}
                    alt="Avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{notification.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formDate(notification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune notification pour le moment</p>
            </div>
          )
        }
      </div>
      
      {/* Bouton de rafraîchissement manuel */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => notificationStore.loadNotifications()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Rafraîchir les notifications
        </button>
      </div>
    </div>
  )
};

export default NotificationsPage;
