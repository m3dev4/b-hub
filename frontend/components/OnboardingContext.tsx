
import React, { createContext, useContext, useState } from "react";

interface Profile {
  avatar: File | string;
  titleProfile: string;
  bio: string;
  skills: string[];
  currentPosition: string;
  location: string;
  website: string;
  github: string;
  linkedinProfile: string;
  projects: string[];
  education: string[];
  workExperience: string[];
}

interface OnboardingContextType {
  formData: Profile;
  setFormData: (data: Partial<Profile>) => void;
  updateFormData: <K extends keyof Profile>(field: K, value: Profile[K]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  totalSteps: number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<Profile>({
    avatar: "",
    titleProfile: "",
    bio: "",
    skills: [],
    currentPosition: "",
    location: "",
    website: "",
    github: "",
    linkedinProfile: "",
    projects: [],
    education: [],
    workExperience: [],
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const updateFormDataState = (newData: Partial<Profile>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const updateFormData = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        formData,
        setFormData: updateFormDataState,
        updateFormData,
        currentStep,
        setCurrentStep,
        handleNext,
        handlePrevious,
        totalSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
