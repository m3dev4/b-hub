import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_SERVER,
  withCredentials: true,
});

export const authApi = {
  login: async (identifier: string, password: string) => {
    const response = await apiInstance.post("/api/v1/auth/login", {
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
    const response = await apiInstance.post("/api/v1/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiInstance.post("/api/v1/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await apiInstance.get("/api/v1/auth/profile");
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
  
};
