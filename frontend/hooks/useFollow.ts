import { instanceApi } from "@/lib/following/api";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFollowerUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => instanceApi.followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ["following"],
      });
      queryClient.setQueryData<boolean>(["isFollowing", userId], true);
    },
  });
};

export const useUnFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => instanceApi.unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["following"] });

      queryClient.setQueryData<boolean>(["isFollowing", userId], false);
    },
  });
};

export const useFollowers = (
  userId: string,
  page = 1,
  limit = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: ["followers", userId, page, limit],
    queryFn: () => instanceApi.getFollowers(userId, page, limit),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFollowing = (
  userId: string,
  page = 1,
  limit = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: ["following", userId, page, limit],
    queryFn: () => instanceApi.getFollowing(userId, page, limit),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useIsFollowing = (currentUserId: string, targetUserId: string) => {
  const { data: followingData } = useFollowing(currentUserId, 1, 100);

  const isFollowing =
    followingData?.data.some((follow: { following: User; }) => {
      const followingId =
        typeof follow.following === "string"
          ? follow.following
          : (follow.following as User)._id;

      return followingId === targetUserId;
    }) || false;

  return { isFollowing };
};
