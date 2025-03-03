import { useAuthStore } from "@/api/stores/useAuthStore";
import { authApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, logout: logoutStore } = useAuthStore();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getProfile,
    retry: false,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      setUser(null);
      // Ne pas rediriger automatiquement ici
      // router.push("/");
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
    mutationFn: ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => authApi.login(identifier, password),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["currentUser"], data.user);
      router.push("/pages/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.regster,
    onSuccess: (data) => {
      // Ne pas définir l'utilisateur comme connecté après l'inscription
      // car l'email n'est pas encore vérifié
      queryClient.setQueryData(["currentUser"], null);
      // Ne pas rediriger ici, laisser le composant gérer la redirection
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

  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      router.push("/pages/dashboard");
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
  };
};
