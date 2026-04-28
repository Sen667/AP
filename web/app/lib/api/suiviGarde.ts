import { axios } from "@/app/lib/axios.instance";
import type { HistoriqueModel } from "@/app/types/models/historique";
import type { SuiviGardeAssistantModel } from "@/app/types/models/suivi-garde-assistant";

export interface ValiderSuiviGardeDto {
    arriveeMinutes?: number;
    departMinutes?: number;
    repasFournis?: number;
    fraisDivers?: number;
    km?: number;
    statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
    commentaireParent?: string;
}

/**
 * Récupérer tous les suivis de garde du parent (avec filtres optionnels)
 */
export async function getSuivisParent(
    mois?: number,
    annee?: number
): Promise<SuiviGardeAssistantModel[]> {
    try {
        const params = new URLSearchParams();
        if (mois) params.append('mois', mois.toString());
        if (annee) params.append('annee', annee.toString());

        const url = params.toString()
            ? `/suivi-garde/parent?${params.toString()}`
            : '/suivi-garde/parent';

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des suivis de garde:", error);
        throw error;
    }
}

/**
 * Récupérer un suivi de garde par ID (parent)
 */
export async function getSuiviParentById(id: number): Promise<SuiviGardeAssistantModel> {
    try {
        const response = await axios.get(`/suivi-garde/parent/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du suivi de garde:", error);
        throw error;
    }
}

/**
 * Valider ou modifier un suivi de garde (parent)
 */
export async function validerSuiviGarde(
    id: number,
    data: ValiderSuiviGardeDto
): Promise<SuiviGardeAssistantModel> {
    try {
        const response = await axios.patch(`/suivi-garde/parent/${id}/valider`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la validation du suivi de garde:", error);
        throw error;
    }
}

/**
 * Récupérer l'historique des modifications d'un suivi de garde
 */
export async function getHistoriqueSuiviGarde(id: number): Promise<HistoriqueModel[]> {
    try {
        const response = await axios.get(`/suivi-garde/${id}/historique`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
        throw error;
    }
}
