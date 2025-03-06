"use client";
import { useAuth } from "@/hooks/useAuth";
import PostPage from "../post/page";

const Accueil = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Fil d&apos;actualité</h1>
      <PostPage />
    </div>
  );
};

export default Accueil;
