import { axios } from "@/app/lib/axios.instance";
import type { UtilisateurModel } from "@/app/types/models/utilisateur";

/**
 * Créer un profil parent
 */
export async function createParentProfile(
    payload: any,
): Promise<UtilisateurModel> {
    try {
        const response = await axios.post("/user/parent", payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la création du profil parent");
    }
}

/**
 * Mettre à jour le profil parent
 */
export async function updateParentProfile(
    payload: any,
): Promise<UtilisateurModel> {
    try {
        const response = await axios.patch("/user/parent", payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la mise à jour du profil parent");
    }
}

/**
 * Créer un profil assistant
 */
export async function createAssistantProfile(
    payload: any,
): Promise<UtilisateurModel> {
    try {
        const response = await axios.post("/user/assistant", payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la création du profil assistant");
    }
}

/**
 * Mettre à jour le profil assistant
 */
export async function updateAssistantProfile(
    payload: any,
): Promise<UtilisateurModel> {
    try {
        const response = await axios.patch("/user/assistant", payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la mise à jour du profil assistant");
    }
}
