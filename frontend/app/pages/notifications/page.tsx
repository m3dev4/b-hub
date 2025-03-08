"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/api/stores/useAuthStore";
import { useNotification } from "@/api/stores/useNotification";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

const NotificationsPage = () => {
  const { user } = useAuthStore();
  const notificationStore = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        if (!user?._id) {
          console.log("No user found, waiting for authentication...");
          return;
        }

        console.log("Initializing notifications for user:", user._id);
        notificationStore.initializeSocket(user._id);
        await notificationStore.loadNotifications();
      } catch (error) {
        console.error("Error initializing notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Veuillez vous connecter pour voir vos notifications</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notificationStore.notifications.map((notification) => (
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
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {notificationStore.notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune notification pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;