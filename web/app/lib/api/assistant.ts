import { axios } from "@/app/lib/axios.instance";

/**
 * Récupérer toutes les assistantes maternelles
 */
export async function getAllAssistants() {
    try {
        const response = await axios.get("/user/assistants");
        return response.data.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des assistantes:", error);
        throw error;
    }
}
