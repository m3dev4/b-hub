import * as z from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(1, "Email ou nom d'utilisateur requis"),
  password: z.string().min(6, "Mot de passe requis"),
});

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    userName: z.string().min(1, "Nom d'utilisateur requis"),
    email: z.string().min(1, "Email requis").email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const verifyEmailSchema = z.object({
  code0: z.string().length(1, "Code requis").regex(/^\d$/, "Chiffre requis"),
  code1: z.string().length(1, "Code requis").regex(/^\d$/, "Chiffre requis"),
  code2: z.string().length(1, "Code requis").regex(/^\d$/, "Chiffre requis"),
  code3: z.string().length(1, "Code requis").regex(/^\d$/, "Chiffre requis"),
  code4: z.string().length(1, "Code requis").regex(/^\d$/, "Chiffre requis"),
  code5: z.string().length(1, "Code requis").regex(/^\d$/, "Chiffre requis"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;