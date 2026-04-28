import { z } from "zod";
import { Sexe } from "../../types/enums";

export const CreateEnfantSchema = z.object({
    nom: z.string().min(2, "Le nom est requis"),
    prenom: z.string().min(2, "Le prénom est requis"),
    dateNaissance: z.string().min(1, "La date de naissance est requise"),
    sexe: z.enum([Sexe.FEMININ, Sexe.MASCULIN], "Le sexe est requis"),
    allergies: z.string().optional().nullable(),
    remarquesMedicales: z.string().optional().nullable(),
    medecinTraitant: z.string().min(2, "Le médecin traitant est requis"),
    medecinTraitantTel: z
        .string()
        .min(6, "Le téléphone du médecin est requis"),
});

export type CreateEnfantData = z.infer<typeof CreateEnfantSchema>;
