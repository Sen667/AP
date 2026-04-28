import { z } from "zod";

export const AssistantModalSchema = z.object({
    numeroAgrement: z
        .string()
        .min(1, "Le numéro d'agrément est requis")
        .max(50, "Le numéro d'agrément ne peut pas dépasser 50 caractères"),

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

    dateObtentionAgrement: z.string(),

    agrementValide: z.boolean(),

    dateFinAgrement: z.string().nullable().optional(),

    capaciteAccueil: z.coerce
        .number()
        .int("La capacité doit être un nombre entier")
        .min(1, "La capacité minimum est 1")
        .max(10, "La capacité maximum est 10"),

    experience: z.coerce
        .number()
        .int("L'expérience doit être un nombre entier")
        .min(0, "L'expérience ne peut pas être négative")
        .max(60, "L'expérience ne peut pas dépasser 60 ans"),

    disponibilites: z
        .string()
        .max(500, "Les disponibilités ne peuvent pas dépasser 500 caractères")
        .optional(),
});

export type AssistantModalData = z.infer<typeof AssistantModalSchema>;
