"use client"; // Assurez-vous que ce "use client" est présent en haut du fichier

import { useFollowStore } from '@/api/stores/useFollowStore';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';
import { User } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ProfileId = () => {
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { followUser, unfollowUser, isFollowing } = useFollowStore();

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleFollow = () => {
    if (isFollowing(user?._id)) {
      unfollowUser(user?._id);
    } else {
      followUser(user?._id);
    }
  };

  return (
    <div>
      <h1>{user?.firstName} {user?.lastName}</h1>
      <p>@{user?.userName}</p>
      <p>{user?.bio}</p>
      <button onClick={handleFollow} className="bg-primary text-background">
        {isFollowing(user?._id) ? "Ne plus suivre" : "Suivre"}
      </button>
      {/* Ajoutez d'autres informations du profil ici */}
    </div>
  );
};

export default ProfileId;