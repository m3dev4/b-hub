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
          console.log("Aucun utilisateur trouvé, en attente d'authentification...");
          return;
        }

        console.log("Initialisation des notifications pour l'utilisateur:", user._id);
        
        // Réinitialisation complète du socket à chaque initialisation
        notificationStore.initializeSocket(user._id);
        
        // Chargement initial des notifications
        await notificationStore.loadNotifications();
      } catch (error) {
        console.error("Erreur lors de l'initialisation des notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();
    
    // Nettoyage lors du démontage du composant
    return () => {
      if (notificationStore.socket) {
        console.log("Déconnexion du socket lors du démontage");
        notificationStore.socket.disconnect();
      }
    };
  }, [user?._id]); // Dépendance sur user._id plutôt que sur tout l'objet user

  // Rafraîchissement périodique des notifications
  useEffect(() => {
    if (!user?._id) return;
    
    const interval = setInterval(() => {
      notificationStore.loadNotifications();
    }, 30000); // Rafraîchir toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, [user?._id]);

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

  // Affichage du nombre de notifications
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
                    {formatDate(notification.createdAt)}
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
  );
};

export default NotificationsPage;