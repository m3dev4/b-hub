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
  isVerified: boolean;
  verificationToken: string;
  verificationTokenExpire: Date;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
