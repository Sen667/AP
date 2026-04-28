import { axios } from "@/app/lib/axios.instance";

export interface SuiviJournalierData {
    enfantId: number;
    date: string;
    temperature?: number;
    pleurs?: string;
    besoins?: string;
    repasHoraires?: string;
    repasAliments?: string;
    dodoDeb?: string;
    dodoFin?: string;
    humeur?: string;
    activites?: string;
    promenadeHoraires?: string;
    remarques?: string;
}

export interface Enfant {
    id: number;
    nom: string;
    prenom: string;
    dateNaissance: string;
}

export interface SuiviJournalier {
    id: number;
    date: string;
    temperature?: number;
    pleurs?: string;
    besoins?: string;
    repasHoraires?: string;
    repasAliments?: string;
    dodoDeb?: string;
    dodoFin?: string;
    humeur?: string;
    activites?: string;
    promenadeHoraires?: string;
    remarques?: string;
    assistant?: {
        utilisateur: {
            prenom: string;
            nom: string;
        };
    };
}

/**
 * Récupère les enfants de l'assistant connecté (via contrats actifs)
 */
export async function getMesEnfants(): Promise<Enfant[]> {
    try {
        const response = await axios.get("/suivi-journalier/mes-enfants");
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des enfants");
    }
}

/**
 * Récupère un suivi journalier spécifique pour un enfant et une date donnée
 */
export async function getSuiviByEnfantAndDate(
    enfantId: number,
    date: string,
): Promise<SuiviJournalier | null> {
    try {
        const response = await axios.get(`/suivi-journalier/${enfantId}/${date}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }
        throw new Error("Erreur lors de la récupération du suivi");
    }
}

/**
 * Récupère tous les suivis d'un enfant
 */
export async function getSuivisByEnfant(enfantId: number): Promise<SuiviJournalier[]> {
    try {
        const response = await axios.get(`/suivi-journalier/enfant/${enfantId}`);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des suivis");
    }
}

/**
 * Crée ou met à jour un suivi journalier
 */
export async function createOrUpdateSuivi(
    data: SuiviJournalierData,
): Promise<SuiviJournalier> {
    try {
        const response = await axios.post("/suivi-journalier", data);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de l'enregistrement du suivi");
    }
}
