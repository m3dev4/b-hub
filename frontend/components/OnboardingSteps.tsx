"use client";

import React, { useState } from "react";
import { useOnboarding } from "./OnboardingContext";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Send,
  MapPin,
  Globe,
  Github,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import FileUpload from "./fileUpload";

const OnboardingSteps: React.FC = () => {
  const {
    formData,
    updateFormData,
    currentStep,
    handleNext,
    handlePrevious,
    totalSteps,
  } = useOnboarding();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateFormData(name as any, value);
  };

  const handleAvatarChange = (file: File) => {
    updateFormData("avatar", file);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() !== "" && !formData.skills.includes(newSkill.trim())) {
      updateFormData("skills", [...formData.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    updateFormData(
      "skills",
      formData.skills.filter((s) => s !== skill)
    );
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formDataToSend = new FormData();

      console.log("Données à envoyer:", {
        ...formData,
        avatar: formData.avatar instanceof File ? "File object" : formData.avatar
      });

      if (formData.avatar instanceof File) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const fieldsToUpdate = {
        titleProfile: formData.titleProfile,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        currentPosition: formData.currentPosition,
        github: formData.github,
        linkedinProfile: formData.linkedinProfile,
        skills: formData.skills,
        hasCompletedOnboarding: true
      };

      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        if (key === 'skills') {
          formDataToSend.append('skills', JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      console.log("FormData entries:");
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await authApi.updateOnboardingProfile(formDataToSend);
      console.log("Réponse API:", response);
      
      if (response.success) {
        document.cookie = "onboarding_completed=true; path=/; max-age=31536000";
        toast.success("Profil mis à jour avec succès");
        router.push("/pages/dashboard");
      } else {
        throw new Error(response.message || "Erreur lors de la mise à jour");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erreur complète:", error);
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-3">
                Votre photo de profil
              </h2>
              <p className="text-gray-500 mb-6">
                Choisissez une photo professionnelle qui vous représente
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FileUpload
                onChange={handleAvatarChange}
                value={formData.avatar}
                className="w-40 h-40"
              />
              <p className="text-sm text-gray-500 mt-4">
                Formats acceptés : JPG, PNG. Taille max : 10MB
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-3">
                Informations de base
              </h2>
              <p className="text-gray-500 mb-6">
                Parlez-nous un peu de vous
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Titre professionnel
                </label>
                <input
                  type="text"
                  name="titleProfile"
                  value={formData.titleProfile}
                  onChange={handleInputChange}
                  className="onboarding-input"
                  placeholder="Ex: Développeur Full Stack"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Poste actuel
                </label>
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  className="onboarding-input"
                  placeholder="Ex: Senior Developer chez Company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="onboarding-textarea"
                  placeholder="Décrivez votre parcours et vos centres d'intérêt..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-3">
                Localisation & Liens
              </h2>
              <p className="text-gray-500 mb-6">
                Où êtes-vous basé et comment peut-on vous trouver en ligne?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  Localisation
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="onboarding-input"
                  placeholder="Ex: Paris, France"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Globe className="inline-block w-4 h-4 mr-1" />
                  Site web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="onboarding-input"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Github className="inline-block w-4 h-4 mr-1" />
                  GitHub
                </label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="onboarding-input"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Linkedin className="inline-block w-4 h-4 mr-1" />
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  className="onboarding-input"
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-3">Compétences</h2>
              <p className="text-gray-500 mb-6">
                Ajoutez vos principales compétences techniques
              </p>
            </div>

            <div className="space-y-4">
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="onboarding-input flex-1"
                  placeholder="Ex: React, Node.js, Python..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-800 text-white rounded-md hover:bg-stone-700"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep
                    ? "bg-primary"
                    : "bg-green-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            Étape {currentStep + 1} sur {totalSteps}
          </span>
        </div>
      </div>

      {renderStepContent()}

      <div className="flex justify-between mt-8">
        {currentStep > 0 && (
          <button
            onClick={handlePrevious}
            className="px-6 py-2 border border-gray-300 outline-none rounded-md hover:bg-gray-900"
            disabled={isLoading}
          >
            Précédent
          </button>
        )}

        <button
          onClick={currentStep === totalSteps - 1 ? handleSubmit : handleNext}
          className="ml-auto px-6 py-2 bg-stone-800 text-white rounded-md hover:bg-stone-700 flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            "Chargement..."
          ) : currentStep === totalSteps - 1 ? (
            <>
              Terminer
              <Send className="w-4 h-4" />
            </>
          ) : (
            "Suivant"
          )}
        </button>
      </div>
    </div>
  );
};

export default OnboardingSteps;
