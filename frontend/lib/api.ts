import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_SERVER,
  withCredentials: true,
});

export const authApi = {
  login: async (identifier: string, password: string) => {
    const response = await apiInstance.post("/api/v1/users/login", {
      identifier,
      password,
    });
    return response.data;
  },

  regster: async (userData: {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
  }) => {
    const response = await apiInstance.post("/api/v1/users/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiInstance.post("/api/v1/users/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await apiInstance.get("/api/v1/users/profile");
    return response.data;
  },

  updateProfile: async (userData: {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    avatar: string;
    bio: string;
    skills: string[];
  }) => {
    const response = await apiInstance.put(
      "/api/v1/auth/profile/update-profile",
      userData
    );
    return response.data;
  },

  deleteProfile: async () => {
    const response = await apiInstance.delete(
      "/api/v1/auth/profile/delete-profile"
    );
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await apiInstance.get(`/api/v1/users/profile/${userId}`);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiInstance.post("/api/v1/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiInstance.post(
      `/api/v1/auth/reset-password/${token}`,
      { password }
    );
    return response.data;
  },
  
  verifyEmail: async (code: string) => {
    const response = await apiInstance.post("/api/v1/users/verify-email", {
      code,
    });
    return response.data;
  },

  updateOnboardingProfile: async (formData: FormData) => {
    try {
      const response = await apiInstance.put("/api/v1/users/onboarding-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Réponse brute:", response.data);

      if (response.data.success) {
        return {
          success: true,
          data: response.data.user
        };
      } else {
        throw new Error(response.data.message || "Erreur lors de la mise à jour");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erreur API:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur lors de la mise à jour du profil"
      };
    }
  },
};
