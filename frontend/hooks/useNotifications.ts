"use client";
import { useNotification } from "@/api/stores/useNotification";
import { notificationApi } from "@/lib/notification/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useNotifications = (userId: string) => {
  const queryClient = useQueryClient();
  const store = useNotification();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => notificationApi.getAllNotifications(),
    enabled: !!userId,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
      });
    },
  });

  useEffect(() => {
    if (userId) {
      store.initializeSocket(userId);
    }
    return () => {
      if (store.socket) {
        store.socket.disconnect();
      }
    };
  }, [userId]);

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    socket: store.socket,
    initializeSocket: store.initializeSocket,
  };
};
