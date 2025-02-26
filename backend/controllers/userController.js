import bcryptjs from "bcryptjs";
import createToken from "../utils/jwt/createToken.js";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { sendEmailVerication } from "../utils/mail/mail.js";

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
const login = asyncHandler(async (req, res, next) => {});

// @desc logout
const logout = asyncHandler(async (req, res, next) => {});

// @desc getUser
const getUserProfile = asyncHandler(async (req, res, next) => {});

// @desc update
const updateUserProfile = asyncHandler(async (req, res, next) => {});

// @desc delete
const deleteUser = asyncHandler(async (req, res, next) => {});

// @desc email verification
const verifyEmail = asyncHandler(async (req, res, next) => {});

// @desc password reset
const resetPassword = asyncHandler(async (req, res, next) => {});

// @desc change password
const changePassword = asyncHandler(async (req, res, next) => {});

// // ---------------------Admin---------------------

// @desc get all users
const getAllUsers = asyncHandler(async (req, res, next) => {});

// @desc get user by id
const getUserById = asyncHandler(async (req, res, next) => {});

// @desc update user by id
const updateUserById = asyncHandler(async (req, res, next) => {});

// @desc delete user by id
const deleteUserById = asyncHandler(async (req, res, next) => {});

export {
  createUser,
  //
};
