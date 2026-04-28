import { axios } from "@/app/lib/axios.instance";
import type { ContratGardeModel } from "@/app/types/models/contrat-garde";

/**
 * Créer un nouveau contrat de garde
 */
export async function createContratGarde(payload: any): Promise<ContratGardeModel> {
    try {
        const response = await axios.post("/contrat-garde", payload);
        return response.data.data;
    } catch (error) {
        console.error("Erreur lors de la création du contrat de garde:", error);
        throw error;
    }
}

/**
 * Récupérer tous les contrats du parent
 */
export async function getAllContratsGarde(): Promise<ContratGardeModel[]> {
    try {
        const response = await axios.get("/contrat-garde");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats:", error);
        throw error;
    }
}

/**
 * Récupérer tous les contrats d'un enfant
 */
export async function getContratsGardeByEnfant(
    enfantId: number,
): Promise<ContratGardeModel[]> {
    try {
        const response = await axios.get(`/contrat-garde/enfant/${enfantId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats de l'enfant:", error);
        throw error;
    }
}

/**
 * Récupérer un contrat par son ID
 */
export async function getContratGardeById(id: number): Promise<ContratGardeModel> {
    try {
        const response = await axios.get(`/contrat-garde/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du contrat:", error);
        throw error;
    }
}

/**
 * Mettre à jour un contrat
 */
export async function updateContratGarde(
    id: number,
    payload: any,
): Promise<ContratGardeModel> {
    try {
        const response = await axios.patch(`/contrat-garde/${id}`, payload);
        return response.data.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du contrat:", error);
        throw error;
    }
}

/**
 * Supprimer un contrat
 */
export async function deleteContratGarde(id: number): Promise<void> {
    try {
        await axios.delete(`/contrat-garde/${id}`);
    } catch (error) {
        console.error("Erreur lors de la suppression du contrat:", error);
        throw error;
    }
}

// ===== MÉTHODES POUR LES ASSISTANTES =====

/**
 * Récupérer tous les contrats de l'assistante
 */
export async function getContratsAssistant(): Promise<ContratGardeModel[]> {
    try {
        const response = await axios.get("/contrat-garde/assistant/mes-contrats");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des contrats de l'assistante:", error);
        throw error;
    }
}

/**
 * Récupérer un contrat spécifique de l'assistante
 */
export async function getContratAssistantById(id: number): Promise<ContratGardeModel> {
    try {
        const response = await axios.get(`/contrat-garde/assistant/contrat/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du contrat:", error);
        throw error;
    }
}

/**
 * Accepter un contrat de garde
 */
export async function accepterContrat(id: number): Promise<ContratGardeModel> {
    try {
        const response = await axios.patch(`/contrat-garde/assistant/${id}/accepter`);
        return response.data.data;
    } catch (error) {
        console.error("Erreur lors de l'acceptation du contrat:", error);
        throw error;
    }
}

/**
 * Refuser un contrat de garde
 */
export async function refuserContrat(id: number): Promise<ContratGardeModel> {
    try {
        const response = await axios.patch(`/contrat-garde/assistant/${id}/refuser`);
        return response.data.data;
    } catch (error) {
        console.error("Erreur lors du refus du contrat:", error);
        throw error;
    }
}

/**
 * Demander la révocation d'un contrat (côté assistante)
 */
export async function demanderRevocation(id: number, motif: string): Promise<ContratGardeModel> {
    try {
        const response = await axios.post(`/contrat-garde/assistant/${id}/demander-revocation`, { motif });
        return response.data.data;
    } catch (error) {
        console.error("Erreur lors de la demande de révocation:", error);
        throw error;
    }
}

/**
 * Traiter une demande de révocation (côté parent)
 */
export async function traiterRevocation(
    id: number,
    accepter: boolean,
    commentaire?: string
): Promise<ContratGardeModel> {
    try {
        const response = await axios.patch(`/contrat-garde/${id}/traiter-revocation`, {
            accepter,
            commentaire,
        });
        return response.data.data;
    } catch (error) {
        console.error("Erreur lors du traitement de la révocation:", error);
        throw error;
    }
}

// ===== MÉTHODES POUR LES ADMINS =====

/**
 * Récupérer tous les contrats du RAM (admin)
 */
export async function getAllContratsAdmin(): Promise<ContratGardeModel[]> {
    try {
        const response = await axios.get("/contrat-garde/admin/tous");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les contrats:", error);
        throw error;
    }
}

// ===== MÉTHODES UTILITAIRES =====

/**
 * Récupérer les enfants gardés par une assistante
 */
export async function getEnfantsGardesParAssistant(assistantId: number): Promise<any[]> {
    try {
        const response = await axios.get(`/contrat-garde/assistant/${assistantId}/enfants`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des enfants gardés:", error);
        throw error;
    }
}
