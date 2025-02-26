// emailService.js
import { clientMail, sender } from "./configMailer.js";
import { validateMail } from "./templateMail.js";

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