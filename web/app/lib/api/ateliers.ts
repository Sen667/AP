import { axios } from "@/app/lib/axios.instance";
import type { AtelierModel } from "@/app/types/models/atelier";
import type { InscriptionAtelierModel } from "@/app/types/models/inscription-atelier";

export async function getAteliers(typePublic?: string): Promise<AtelierModel[]> {
    try {
        const url = typePublic ? `/ateliers?typePublic=${typePublic}` : "/ateliers";
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des ateliers:", error);
        throw error;
    }
}

export async function getUpcomingAteliers(): Promise<AtelierModel[]> {
    try {
        const response = await axios.get("/ateliers/upcoming");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des ateliers à venir:", error);
        throw error;
    }
}

export async function getAtelierById(id: number): Promise<AtelierModel> {
    try {
        const response = await axios.get(`/ateliers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'atelier:", error);
        throw error;
    }
}

export async function getMesInscriptions(): Promise<InscriptionAtelierModel[]> {
    try {
        const response = await axios.get("/ateliers/inscriptions/mes-inscriptions");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions:", error);
        throw error;
    }
}

export async function inscrireAtelier(
    atelierId: number,
    enfantId?: number
): Promise<{ message: string; data: InscriptionAtelierModel }> {
    try {
        const response = await axios.post("/ateliers/inscriptions", {
            atelierId,
            ...(enfantId ? { enfantId } : {}),
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'inscription à l'atelier:", error);
        throw error;
    }
}

export async function desinscrireAtelier(atelierId: number): Promise<void> {
    try {
        await axios.delete(`/ateliers/inscriptions/${atelierId}`);
    } catch (error) {
        console.error("Erreur lors de la désinscription de l'atelier:", error);
        throw error;
    }
}

export async function getMesInscriptionsAssistant(): Promise<InscriptionAtelierModel[]> {
    try {
        const response = await axios.get("/ateliers/inscriptions/assistant/mes-inscriptions");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions assistant:", error);
        throw error;
    }
}

export async function inscrireAtelierAssistant(
    atelierId: number
): Promise<{ message: string; data: InscriptionAtelierModel }> {
    try {
        const response = await axios.post("/ateliers/inscriptions/assistant", { atelierId });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'inscription assistant à l'atelier:", error);
        throw error;
    }
}

export async function desinscrireAtelierAssistant(atelierId: number): Promise<void> {
    try {
        await axios.delete(`/ateliers/inscriptions/assistant/${atelierId}`);
    } catch (error) {
        console.error("Erreur lors de la désinscription assistant de l'atelier:", error);
        throw error;
    }
}
