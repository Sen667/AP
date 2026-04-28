import { axios } from "@/app/lib/axios.instance";
import type { EnfantModel } from "@/app/types/models/enfant";

/**
 * Récupère tous les enfants du parent connecté
 */
export async function getParentEnfants(): Promise<EnfantModel[]> {
    try {
        const response = await axios.get("/enfant/mes-enfants");
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des enfants");
    }
}

/**
 * Crée un enfant
 */
export async function createEnfant(payload: any): Promise<EnfantModel> {
    try {
        const response = await axios.post("/enfant", payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la création de l'enfant");
    }
}

/**
 * Met à jour un enfant
 */
export async function updateEnfant(
    id: number,
    payload: any,
): Promise<EnfantModel> {
    try {
        const response = await axios.patch(`/enfant/${id}`, payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la mise à jour de l'enfant");
    }
}

/**
 * Supprime un enfant
 */
export async function deleteEnfant(id: number): Promise<void> {
    try {
        await axios.delete(`/enfant/${id}`);
    } catch (error: any) {
        const message = error?.response?.data?.message || "Erreur lors de la suppression de l'enfant";
        throw new Error(message);
    }
}
