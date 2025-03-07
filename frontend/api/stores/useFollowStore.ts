import { instanceApi } from "@/lib/following/api";
import { Follow, FollowResponse, FollowState } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      followers: [] as Follow[],
      following: [] as Follow[],
      loadingFollow: false,
      error: null,
      totalFollowers: 0,
      totalFollowing: 0,

      followUser: async (userId: string): Promise<FollowResponse | null> => {
        try {
          set({ loadingFollow: true, error: null });
          const response = await instanceApi.followUser(userId);
          set((state) => ({
            following: [...state.following, response.data],
            totalFollowing: state.totalFollowing + 1,
            loadingFollow: false,
          }));
          return response.data;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Erreur lors de l'ajout au suivi",
            loadingFollow: false,
          });
          return null;
        }
      },

      unfollowUser: async (userId: string): Promise<FollowResponse | null> => {
        try {
          set({ loadingFollow: true, error: null });
          const response = await instanceApi.unfollowUser(userId);
          set((state) => ({
            following: state.following.filter(
              (follow) => follow.following !== userId
            ),
            totalFollowing: state.totalFollowing - 1,
            loadingFollow: false,
          }));
          return response.data;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Erreur lors du retrait du suivi",
            loadingFollow: false,
          });
          return null;
        }
      },

      getFollowers: async (userId: string, page = 1, limit = 10) => {
        try {
          set({ loadingFollow: true, error: null });
          const response = await instanceApi.getFollowers(userId, page, limit);
          set({
            followers: response.data.data,
            totalFollowers: response.data.total,
            loadingFollow: false,
          });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Erreur lors de la récupération des followers",
            loadingFollow: false,
          });
        }
      },

      getFollowing: async (userId: string, page = 1, limit = 10) => {
        try {
          set({ loadingFollow: true, error: null });
          const response = await instanceApi.getFollowing(userId, page, limit);
          set({
            following: response.data.data,
            totalFollowing: response.data.total,
            loadingFollow: false,
          });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Erreur lors de la récupération des suivis",
            loadingFollow: false,
          });
        }
      },

      clearFollowState: () => {
        set({
          followers: [] as Follow[],
          following: [] as Follow[],
          loadingFollow: false,
          error: null,
          totalFollowers: 0,
          totalFollowing: 0,
        });
      },

      isFollowing: (userId: string): boolean => {
        return get().following.some((follow) => follow.following === userId);
      },
    }),
    {
      name: "follow-storage",
      skipHydration: true,
    }
  )
);
