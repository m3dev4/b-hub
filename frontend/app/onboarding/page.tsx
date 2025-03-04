"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import OnboardingSteps from "@/components/OnboardingSteps";
import { OnboardingProvider } from "@/components/OnboardingContext";
import "@/styles/onboarding.css";

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas connecté
    if (!isLoading && !currentUser) {
      router.push("/");
      return;
    }

    // Rediriger si l'utilisateur a déjà complété l'onboarding
    if (currentUser?.hasCompletedOnboarding) {
      router.push("/pages/dashboard");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r  from-stone-900 to-zinc-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Bienvenue sur B-Hub
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Prenons quelques minutes pour configurer votre profil professionnel
        </p>
        <OnboardingProvider>
          <OnboardingSteps />
        </OnboardingProvider>
      </div>
    </div>
  );
}
