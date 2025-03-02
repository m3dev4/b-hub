// configMailer.js
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

// Créer le transporteur SMTP avec Gmail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD,
  },
});

// Configuration de l'expéditeur
export const sender = {
  address: EMAIL_USER,
  name: "B-Hub",
};