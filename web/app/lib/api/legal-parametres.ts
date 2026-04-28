import { axios } from "@/app/lib/axios.instance";
import type { ParametreLegalModel } from "@/app/types/models/parametre-legal";

/**
 * Récupère tous les paramètres légaux actuels
 */
export async function getLegalParametres(): Promise<
    ParametreLegalModel[]
> {
    try {
        const response = await axios.get("/legal-parametres");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des paramètres légaux:", error);
        throw error;
    }
}

/**
 * Récupère un paramètre légal spécifique par son nom
 * @param nomParametre - Nom du paramètre (ex: "SALAIRE_HORAIRE_MINIMUM")
 */
export async function getLegalParametreByName(
    nomParametre: string
): Promise<ParametreLegalModel | null> {
    try {
        const response = await axios.get(
            `/legal-parametres/name/${nomParametre}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Erreur lors de la récupération du paramètre ${nomParametre}:`,
            error
        );
        return null;
    }
}

/**
 * Liste des paramètres légaux attendus pour les contrats de garde
 */
export const LEGAL_PARAMETRES_NAMES = {
    SALAIRE_HORAIRE_MINIMUM: "SALAIRE_HORAIRE_MINIMUM",
    SALAIRE_HORAIRE_MAXIMUM: "SALAIRE_HORAIRE_MAXIMUM",
    INDEMNITE_ENTRETIEN_MINIMUM: "INDEMNITE_ENTRETIEN_MINIMUM",
    INDEMNITE_ENTRETIEN_MAXIMUM: "INDEMNITE_ENTRETIEN_MAXIMUM",
    INDEMNITE_REPAS_MINIMUM: "INDEMNITE_REPAS_MINIMUM",
    INDEMNITE_REPAS_MAXIMUM: "INDEMNITE_REPAS_MAXIMUM",
    INDEMNITE_KM_MINIMUM: "INDEMNITE_KM_MINIMUM",
    INDEMNITE_KM_MAXIMUM: "INDEMNITE_KM_MAXIMUM",
    HEURES_SEMAINE_MINIMUM: "HEURES_SEMAINE_MINIMUM",
    HEURES_SEMAINE_MAXIMUM: "HEURES_SEMAINE_MAXIMUM",
} as const;
