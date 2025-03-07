import axios from "axios";

// Créer une instance axios avec la configuration de base
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important pour les cookies d'authentification
});

// Intercepteur pour ajouter le token d'authentification si nécessaire
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Exportation des méthodes d'API spécifiques aux fonctionnalités
export const instanceApi = {
  followUser: (userId: string) => api.post(`/api/follows/${userId}`),
  unfollowUser: (userId: string) => api.delete(`/api/follows/${userId}`),
  getFollowers: (userId: string, page = 1, limit = 10) =>
    api.get(`/api/followers/${userId}/followers?page=${page}&limit=${limit}`),
  getFollowing: (userId: string, page = 1, limit = 10) =>
    api.get(`/api/following/${userId}/following?page=${page}&limit=${limit}`),
};
