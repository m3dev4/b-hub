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
    skill: { type: [String], default: [] },
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
