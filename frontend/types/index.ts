export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  skills: string[];
  titleProfile: string;
  currentPosition: string;
  location: string;
  website: string;
  github: string;
  linkedinProfile: string;
  projects: string[];
  education: string[];
  workExperience: string[];
  isVerified: boolean;
  verificationToken: string;
  verificationTokenExpire: Date;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  lastLogin: Date;
  isOnline: boolean;
  hasCompletedOnboarding: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  skills: string[];
  titleProfile?: string;
  currentPosition?: string;
  location?: string;
  website?: string;
  hasCompletedOnboarding?: boolean;
}
