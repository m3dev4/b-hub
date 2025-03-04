import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String },
    bio: { type: String, maxLength: 30 },
    skills: {
      type: [String], // Définir explicitement comme un tableau de strings
      default: []
    },
    titleProfile: { type: String, default: "" },
    currentPosition: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    github: { type: String },
    linkedinProfile: { type: String },
    projects: [
      {
        name: { type: String },
        description: { type: String },
        repoUrl: { type: String },
        demoUrl: { type: String },
        technologies: { type: [String] },
        thubnail: { type: String },
      },
    ],
    workExperience: [
      {
        company: { type: String },
        psotion: { type: String },
        starDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
        isCurrentPosition: { type: Boolean, default: false },
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpire: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
