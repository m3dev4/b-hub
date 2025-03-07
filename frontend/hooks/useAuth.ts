"use client"
import { useAuthStore } from "@/api/stores/useAuthStore";
import { authApi } from "@/lib/api";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, logout: logoutStore } = useAuthStore();

  const { data: currentUser, isLoading } = useQuery<User | null, Error>({
    queryKey: ["currentUser"],
    queryFn: authApi.getProfile,
    retry: false,
    onSuccess: (data: User | null) => {
      console.log("Données utilisateur récupérées :", data);
      setUser(data);
    },
    onError: () => {
      setUser(null);
    },
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const pathname = window.location.pathname;
    const isVerifyEmailPage = pathname === "/auth/verify-email";
    
    // Ne pas rediriger si on est sur la page de vérification d'email
    if (!isLoading && !currentUser && !isVerifyEmailPage) {
      router.push("/");
    }
  }, [currentUser, isLoading, router]);
  const loginMutation = useMutation({
    mutationFn: (credentials: { identifier: string, password: string }) => authApi.login(credentials.identifier, credentials.password),
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(["currentUser"], data);
      router.push('/pages/dashboard'); // Direct au dashboard pour les utilisateurs existants
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.regster,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data) => {
      // Après l'inscription, rediriger vers la vérification d'email
      router.push("/auth/verify-email");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      router.push("/");
    },
  });

  const getUserByIdMutation = useMutation({
    mutationFn: authApi.getUserById,
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(["currentUser"], data);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      // Après vérification d'email, rediriger vers l'onboarding
      document.cookie = "email_verified=true; path=/";
      queryClient.setQueryData(["currentUser"], data.user);
      router.push("/onboarding"); // Uniquement pour les nouveaux inscrits
    },
  });

  return {
    currentUser,
    isLoading,
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    verifyEmail: verifyEmailMutation,
    isVerifyEmailLoading: verifyEmailMutation.isPending,
    getUserById: getUserByIdMutation,
    isGetUserByIdLoading: getUserByIdMutation.isPending,
  };
};
