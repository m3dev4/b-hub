import bcryptjs from "bcryptjs";
import crypto from "crypto";
import createToken from "../utils/jwt/createToken.js";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import {
  sendEmailVerication,
  sendForgotPasswordEmail,
  sendResetPasswordSucces,
  sendWelcomeEmail,
} from "../utils/mail/mail.js";

// @desc createUser
const createUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Aucune donnée reçue" });
  }
  const { firstName, lastName, userName, email, password } = req.body;

  if (!firstName || !lastName || !userName || !email || !password) {
    return res.status(400).json({
      message: "Veuillez fournir tous les champs obligatoires",
    });
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Error("Utilisateur existe déjà");
  }

  const hashPassword = await bcryptjs.hash(password, 10);
  const verificationToken = Math.floor(100000 + Math.random() * 900000);
  try {
    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    });
    await newUser.save();
    createToken(res, newUser._id);
    await sendEmailVerication(newUser.email, verificationToken);
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      success: true,
      ...newUser._doc,
      password: undefined,
    });
    console.log(newUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    throw new Error("Erreur lors de la creation de l'utilisateur");
  }
});

// @desc login
const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body; // Renommez 'email' en 'identifier'

  if (!identifier || !password) {
    return res.status(400).json({
      message:
        "Veuillez fournir un nom d'utilisateur ou un email et un mot de passe",
    });
  }

  // Rechercher l'utilisateur par email ou username
  const user = await User.findOne({
    $or: [{ email: identifier }, { userName: identifier }],
  });

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  const isPasswordCorrect = await bcryptjs.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Le mot de passe est incorrect" });
  }

  // Mettre à jour le dernier login
  user.lastLogin = Date.now();
  user.isOnline = true;

  await user.save();

  createToken(res, user._id);
  res.status(200).json({
    message: "Connexion réussie",
    success: true,
    ...user._doc,
    password: undefined,
  });
});

// @desc logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Deconnexion reussie" });
});

// @desc getUser
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json({
      message: "Utilisateur trouvé",
      success: true,
      ...user._doc,
      password: undefined,
    });
  } else {
    res.status(404).json({ message: "Utilisateur non trouvé" });
  }
});

// @desc update
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    // Log pour déboguer
    console.log("Requête reçue:", req.body);
    console.log("User ID:", req.user._id);

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("Utilisateur non trouvé");
    }

    // Modification
    if (req.body.userName) user.userName = req.body.userName;
    if (req.body.email) user.email = req.body.email;

    if (req.body.password) {
      const hashedPassword = await bcryptjs.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    // Log avant sauvegarde
    console.log("Données à sauvegarder:", user);

    const updateProfileUser = await user.save();

    // Log après sauvegarde
    console.log("Données sauvegardées:", updateProfileUser);

    res.json({
      message: "Profil mis à jour",
      success: true,
      ...updateProfileUser._doc,
      password: undefined,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc delete
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    await user.deleteOne();
    res.json({ message: "Utilisateur supprimé", success: true });
  } else {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }
});

// @desc email verification
const verifyEmail = asyncHandler(async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({
        message: "Token non valide",
        success: false,
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;

    console.log("email delivré", code);

    await user.save();
    await sendWelcomeEmail(user.email, user.userName);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error during email verification", error);
    return res.status(500).json({
      message: "Erreur lors de la verification de l'email",
      success: false,
    });
  }
});

// @desc password reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendForgotPasswordEmail(
      user.email,
      `${process.env.BASE_URL_CLIENT}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc change password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendResetPasswordSucces(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// // ---------------------Admin---------------------

// @desc get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc get user by id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc update user by id

// @desc delete user by id
const deleteUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export {
  createUser,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  getUserById,
  deleteUserById,
};
