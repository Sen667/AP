import { z } from "zod";

export const ParentUpdateSchema = z.object({
    nom: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères"),

    prenom: z
        .string()
        .min(2, "Le prénom doit contenir au moins 2 caractères")
        .max(50, "Le prénom ne peut pas dépasser 50 caractères"),

    telephone: z
        .string()
        .min(10, "Le téléphone doit contenir au moins 10 caractères")
        .max(15, "Le téléphone ne peut pas dépasser 15 caractères"),

    dateNaissance: z.string(),

    adresse: z
        .string()
        .min(5, "L'adresse est requise")
        .max(200, "L'adresse ne peut pas dépasser 200 caractères"),

    codePostal: z
        .string()
        .length(5, "Le code postal doit contenir 5 chiffres")
        .regex(/^\d{5}$/, "Le code postal doit contenir uniquement des chiffres"),

    ville: z
        .string()
        .min(2, "La ville est requise")
        .max(100, "La ville ne peut pas dépasser 100 caractères"),

    situationFamiliale: z
        .string()
        .min(2, "La situation familiale est requise")
        .max(50, "La situation familiale ne peut pas dépasser 50 caractères"),

    profession: z.string().nullable().optional(),

    employeur: z.string().nullable().optional(),

    numeroAllocataire: z.string().nullable().optional(),

    beneficiaireCAF: z.boolean(),

    numeroCAF: z.string().nullable().optional(),

    contactUrgenceNom: z
        .string()
        .min(2, "Le nom du contact d'urgence est requis")
        .max(100, "Le nom du contact d'urgence ne peut pas dépasser 100 caractères"),

    contactUrgenceTel: z
        .string()
        .min(10, "Le téléphone d'urgence doit contenir au moins 10 caractères")
        .max(15, "Le téléphone d'urgence ne peut pas dépasser 15 caractères"),
});

export type ParentUpdateData = z.infer<typeof ParentUpdateSchema>;