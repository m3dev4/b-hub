// emailService.js
import { transporter, sender } from "./configMailer.js";
import { templateSendWelcomeEmail, validateMail, templateForgotPassword, templateSendResetPasswordSucces } from "./templateMail.js";

export const sendEmailVerication = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.address}>`,
      to: email,
      subject: "Email verification",
      html: validateMail.replace("{verificationCode}", verificationToken),
      category: "Email verification",
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.address}>`,
      to: email,
      subject: "Welcome to B-Hub",
      html: templateSendWelcomeEmail.replace("{userName}", userName),
      category: "Welcome email",
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendForgotPasswordEmail = async (email, userName, resetToken) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.address}>`,
      to: email,
      subject: "Forgot Password",
      html: templateForgotPassword
        .replace("{nomUtilisateur}", userName)
        .replace("{lienResetPassword}", resetToken),
      category: "Forgot password email",
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendResetPasswordSucces = async (email, userName, resetToken) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.address}>`,
      to: email,
      subject: "Reset Password",
      html: templateSendResetPasswordSucces
        .replace("{nomUtilisateur}", userName)
        .replace("{lienConnexion}", resetToken),
      category: "Reset password email",
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};