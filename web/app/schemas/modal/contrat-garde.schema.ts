import { StatutContrat } from "@/app/types/enums";
import { z } from "zod";

// Constantes de validation (basées sur les paramètres légaux)
const SALAIRE_HORAIRE_MINIMUM = 3.64; // SMIC assistante maternelle
const HEURES_SEMAINE_MAXIMUM = 45; // Limite légale

export const CreateContratGardeSchema = z
    .object({
        enfantId: z.coerce
            .number()
            .int("Sélectionnez un enfant")
            .positive("Sélectionnez un enfant"),

        assistantId: z.coerce
            .number()
            .int("Sélectionnez une assistante")
            .positive("Sélectionnez une assistante"),

        dateDebut: z
            .string()
            .min(1, "La date de début est requise"),

        dateFin: z
            .string()
            .optional(),

        tarifHoraireBrut: z.coerce
            .number()
            .min(SALAIRE_HORAIRE_MINIMUM, `Le tarif minimum est ${SALAIRE_HORAIRE_MINIMUM}€`),

        nombreHeuresSemaine: z.coerce
            .number()
            .min(0.5, "Minimum 0.5 heure par semaine")
            .max(HEURES_SEMAINE_MAXIMUM, `Maximum ${HEURES_SEMAINE_MAXIMUM}h par semaine`),

        indemniteEntretien: z.coerce
            .number()
            .min(0, "L'indemnité ne peut pas être négative"),

        indemniteRepas: z.coerce
            .number()
            .min(0, "L'indemnité ne peut pas être négative"),

        indemniteKm: z.coerce
            .number()
            .min(0, "L'indemnité ne peut pas être négative")
            .optional()
    })
    .refine(
        (data) => {
            if (!data.dateFin) return true;
            return new Date(data.dateFin) > new Date(data.dateDebut);
        },
        {
            message: "La date de fin doit être après la date de début",
            path: ["dateFin"],
        }
    );

export type CreateContratGardeData = z.infer<typeof CreateContratGardeSchema>;

export const UpdateContratGardeSchema = z
    .object({
        dateDebut: z
            .string()
            .min(1, "La date de début est requise"),

        dateFin: z
            .string()
            .optional(),

        statut: z.enum(
            [
                StatutContrat.EN_ATTENTE_VALIDATION,
                StatutContrat.ACTIF,
                StatutContrat.SUSPENDU,
                StatutContrat.TERMINE,
            ],
            {
                message: "Sélectionnez un statut valide",
            }
        ),

        tarifHoraireBrut: z.coerce
            .number()
            .min(SALAIRE_HORAIRE_MINIMUM, `Le tarif minimum est ${SALAIRE_HORAIRE_MINIMUM}€`),

        nombreHeuresSemaine: z.coerce
            .number()
            .min(0.5, "Minimum 0.5 heure par semaine")
            .max(HEURES_SEMAINE_MAXIMUM, `Maximum ${HEURES_SEMAINE_MAXIMUM}h par semaine`),

        indemniteEntretien: z.coerce
            .number()
            .min(0, "L'indemnité ne peut pas être négative"),

        indemniteRepas: z.coerce
            .number()
            .min(0, "L'indemnité ne peut pas être négative"),

        indemniteKm: z.coerce
            .number()
            .min(0, "L'indemnité ne peut pas être négative")
            .optional(),
    })
    .refine(
        (data) => {
            if (!data.dateFin) return true;
            return new Date(data.dateFin) > new Date(data.dateDebut);
        },
        {
            message: "La date de fin doit être après la date de début",
            path: ["dateFin"],
        }
    );

export type UpdateContratGardeData = z.infer<typeof UpdateContratGardeSchema>;
