import { useAuthStore } from "@/api/stores/useAuthStore";
import { authApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
    },
  });

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
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.regster,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["currentUser"], data.user);
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      router.push("/auth/login");
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
  };
};
