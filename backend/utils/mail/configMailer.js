// configMailer.js
import { createTransport } from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// Création du transport Mailtrap
export const clientMail = createTransport(
  MailtrapTransport({
    token: TOKEN,
    endpoint: ENDPOINT,
  })
);

// Configuration de l'expéditeur
export const sender = {
  address: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};