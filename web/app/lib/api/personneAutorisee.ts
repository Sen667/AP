import { axios } from "@/app/lib/axios.instance";
import type { PersonneAutoriseeModel } from "@/app/types/models/personne-autorisee";

/**
 * Récupère toutes les personnes autorisées
 */
export async function getPersonnesAutorisees(): Promise<PersonneAutoriseeModel[]> {
    try {
        const response = await axios.get("/personne-autorisee");
        return response.data;
    } catch (error) {
        throw new Error(
            "Erreur lors de la récupération des personnes autorisées",
        );
    }
}

/**
 * Crée une personne autorisée
 */
export async function createPersonneAutorisee(
    payload: any,
): Promise<PersonneAutoriseeModel> {
    try {
        const response = await axios.post("/personne-autorisee", payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la création de la personne autorisée");
    }
}

/**
 * Récupère une personne autorisée par son ID
 */
export async function getPersonneAutoriseeById(
    id: number,
): Promise<PersonneAutoriseeModel> {
    try {
        const response = await axios.get(`/personne-autorisee/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(
            "Erreur lors de la récupération de la personne autorisée",
        );
    }
}

/**
 * Met à jour une personne autorisée
 */
export async function updatePersonneAutorisee(
    id: number,
    payload: any,
): Promise<PersonneAutoriseeModel> {
    try {
        const response = await axios.patch(`/personne-autorisee/${id}`, payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la mise à jour de la personne autorisée");
    }
}

/**
 * Supprime une personne autorisée
 */
export async function deletePersonneAutorisee(id: number): Promise<void> {
    try {
        await axios.delete(`/personne-autorisee/${id}`);
    } catch (error) {
        throw new Error("Erreur lors de la suppression de la personne autorisée");
    }
}
