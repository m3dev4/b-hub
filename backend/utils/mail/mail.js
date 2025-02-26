// emailService.js
import { clientMail, sender } from "./configMailer.js";
import { templateSendWelcomeEmail, validateMail, templateForgotPassword, templateSendResetPasswordSucces } from "./templateMail.js";

export const sendEmailVerication = async (email, verificationToken) => {
  try {
    // Utilisation du client mail configuré avec le bon format de destinataire
    const response = await clientMail.sendMail({
      from: sender,
      to: email, // On peut utiliser directement l'email comme chaîne de caractères
      subject: "Email verification",
      html: validateMail.replace("{verificationCode}", verificationToken),
      category: "Email verification",
    });
    
    console.log("Email envoyé avec succès", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendWelcomeEmail = async (email, userName) => {
  try {
    // Utilisation du client mail configuré avec le bon format de destinataire
    const response = await clientMail.sendMail({
      from: sender,
      to: email, // On peut utiliser directement l'email comme chaîne de caractères
      subject: "Welcome to B-Hub",
      html: templateSendWelcomeEmail.replace("{userName}", userName),
      category: "Welcome email",
    });
    
    console.log("Email envoyé avec succès", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendForgotPasswordEmail = async (email, userName, resetToken) => {
  try {
    // Utilisation du client mail configuré avec le bon format de destinataire
    const response = await clientMail.sendMail({
      from: sender,
      to: email, // On peut utiliser directement l'email comme chaîne de caractères
      subject: "Forgot Password",
      html: templateForgotPassword.replace("{nomUtilisateur}", userName).replace("{lienResetPassword}", resetToken),
      category: "Forgot password email",
    });
    
    console.log("Email envoyé avec succès", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendResetPasswordSucces = async (email, userName, resetToken) => {
  try {
    // Utilisation du client mail configuré avec le bon format de destinataire
    const response = await clientMail.sendMail({
      from: sender,
      to: email, // On peut utiliser directement l'email comme chaîne de caractères
      subject: "Reset Password",
      html: templateSendResetPasswordSucces.replace("{nomUtilisateur}", userName).replace("{lienConnexion}", resetToken),
      category: "Reset password email",
    });
    
    console.log("Email envoyé avec succès", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};