import { z } from "zod";
import { Role, Sexe } from "../../types/enums";

export const RegisterSchema = z.object({
    nom: z.string().trim().min(1, "Le nom est obligatoire"),
    prenom: z.string().trim().min(1, "Le prénom est obligatoire"),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "L'email est obligatoire")
        .email("Email invalide"),
    telephone: z
        .string()
        .trim()
        .regex(/^0[1-9]\d{8}$/, "10 chiffres requis (ex: 06...)"),
    dateNaissance: z
        .string()
        .min(1, "La date est obligatoire")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format AAAA-MM-JJ requis"),
    role: z.enum(Role, "Veuillez sélectionner un rôle"),
    sexe: z.enum(Sexe, "Veuillez sélectionner un sexe"),
    password: z
        .string()
        .min(10, "Minimum 10 caractères")
        .regex(/[A-Z]/, "Au moins une majuscule")
        .regex(/[0-9]/, "Au moins un chiffre")
        .regex(/[!@#$%&?]/, "Au moins un caractère spécial")
        .regex(/^\S*$/, "Les espaces ne sont pas autorisés"),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
    rgpd: z.literal(true, "Veuillez accepter la politique de confidentialité"),
});

export type Register = z.infer<typeof RegisterSchema>;
export type RegisterPayload = Omit<Register, "confirmPassword" | "rgpd">;
