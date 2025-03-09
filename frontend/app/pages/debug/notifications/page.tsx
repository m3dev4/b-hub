"use client";
import { useNotification } from "@/api/stores/useNotification";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";

const page = () => {
  const [user, setUser] = useState<User | null>(null);
  const { currentUser } = useAuth();
  const notificationStore = useNotification();
  const [status, setStatus] = useState("Initialisation...");
  const [socketStatus, setSocketStatus] = useState("Non connecté");

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser?._id);
      console.log(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }
    setStatus("Connexion au socket...");
    notificationStore.initializeSocket(currentUser._id);

    if (notificationStore.socket) {
      notificationStore.socket.on("connect", () => {
        setSocketStatus("Connecté");
        setStatus("Socket connecté");
      });
      notificationStore.socket.on("disconnect", () => {
        setSocketStatus("Non connecté");
        setStatus("Socket non connecté");
      });

      notificationStore.socket.on("notification", (data) => {
        console.log("Received notification:", data);
        setStatus(`Notif reçue à ${new Date().toLocaleTimeString()}`);
      });
    }

    notificationStore.loadNotifications();
  }, [currentUser?._id]);

  const testEmit = () => {
    if (!notificationStore.socket) {
      alert("Socket non connecté");
      return;
    }
    notificationStore.socket.emit("test", { message: "test" });
    setStatus("Test émis");
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Débogage des notification</h1>
      <div className="mb-4">
        <p>ID utilisaateur: {currentUser?._id || "Non connecté"}</p>
        <p>Etat socket: {socketStatus} </p>
        <p>Etat: {status}</p>
        <p>Nombre de notifications: {notificationStore.notifications.length}</p>
        <p>
          Notifications:{" "}
          {JSON.stringify(notificationStore.notifications, null, 2)}
        </p>
        <p>Notification non lues: {notificationStore.unreadCount}</p>
      </div>
      <div className="space-y-2">
        <button
          onClick={testEmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Tester l'émission
        </button>
        <button 
          onClick={() => notificationStore.loadNotifications()} 
          className="px-4 py-2 bg-green-500 text-white rounded ml-2"
        >
          Recharger les notifications
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Notifications:</h2>
        <div className="border p-4 rounded max-h-96 overflow-y-auto">
          {notificationStore.notifications.length > 0 ? (
            notificationStore.notifications.map(n => (
              <div key={n._id} className="border-b py-2">
                <p><strong>De:</strong> {n.sender?.userName || n.sender?._id || "Inconnu"}</p>
                <p><strong>Message:</strong> {n.content}</p>
                <p><strong>Lu:</strong> {n.read ? "Oui" : "Non"}</p>
                <p><strong>Date:</strong> {new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>Aucune notification</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
