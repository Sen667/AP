import { z } from "zod";

export const CreatePersonneAutoriseeSchema = z.object({
    enfantId: z.number().min(1, "L'ID de l'enfant est requis"),
    prenom: z.string().min(2, "Le prénom est requis"),
    nom: z.string().min(2, "Le nom est requis"),
    telephone: z
        .string()
        .regex(/^[0-9\s\-\+.()]{10,}$/, "Le téléphone est invalide"),
    email: z
        .string()
        .email("L'email est invalide"),
    lien: z.string().optional(),
});

export type CreatePersonneAutoriseeData = z.infer<
    typeof CreatePersonneAutoriseeSchema
>;
