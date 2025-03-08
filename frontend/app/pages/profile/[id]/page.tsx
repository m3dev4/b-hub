"use client";

import { useFollowStore } from '@/api/stores/useFollowStore';
import { useAuthStore } from '@/api/stores/useAuthStore';
import { authApi } from '@/lib/api';
import { User } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useNotification } from '@/api/stores/useNotification';

const ProfileId = () => {
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { followUser, unfollowUser, isFollowing } = useFollowStore();
  const { user: currentUser } = useAuthStore();
  const notificationStore = useNotification();

  // Debug logs
  useEffect(() => {
    console.log("Component mounted, current user:", currentUser?._id);
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      console.log("Initializing socket for user:", currentUser._id);
      notificationStore.initializeSocket(currentUser._id);
    }
  }, [currentUser?._id, notificationStore]);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await authApi.getUserById(id as string);
          setUser(response.data);
        } catch (err: any) {
          setError(err.response?.data?.message || "Erreur lors de la récupération de l'utilisateur");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleFollow = async () => {
    if (!user?._id) return;
    
    try {
      console.log("Attempting to follow/unfollow user:", user._id);
      if (isFollowing(user._id)) {
        await unfollowUser(user._id);
        console.log("Unfollowed user");
      } else {
        await followUser(user._id);
        console.log("Followed user");
      }
    } catch (error) {
      console.error('Erreur lors du suivi/désabonnement:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-6">
          <div className="relative w-32 h-32">
            <Image
              src={user?.profilePicture || "/default-avatar.png"}
              alt={user?.userName || "Profile picture"}
              fill
              className="rounded-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600">@{user?.userName}</p>
              </div>
              
              {currentUser?._id !== user?._id && (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isFollowing(user?._id)
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isFollowing(user?._id) ? "Ne plus suivre" : "Suivre"}
                </button>
              )}
            </div>

            <div className="mt-4">
              <p className="text-gray-700">{user?.bio}</p>
            </div>

            <div className="mt-6 flex gap-6">
              <div className="text-center">
                <span className="block font-bold text-xl">{user?.followersCount || 0}</span>
                <span className="text-gray-600">Abonnés</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-xl">{user?.followingCount || 0}</span>
                <span className="text-gray-600">Abonnements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileId;