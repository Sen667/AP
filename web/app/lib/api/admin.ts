import { axios } from "@/app/lib/axios.instance";
import type { ContratGardeModel } from "@/app/types/models/contrat-garde";
import type { EnfantModel } from "@/app/types/models/enfant";
import type { UtilisateurModel } from "@/app/types/models/utilisateur";

/**
 * Récupère tous les utilisateurs
 */
export async function getAdminUsers(): Promise<UtilisateurModel[]> {
  try {
    const response = await axios.get("/user/admin/users");
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de la liste des utilisateurs");
  }
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getAdminUserById(
  id: number,
): Promise<UtilisateurModel> {
  try {
    const response = await axios.get(`/user/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de l'utilisateur ID ${id}`);
  }
}

/**
 * Récupère tous les parents
 */
export async function getAdminParents(): Promise<UtilisateurModel[]> {
  try {
    const response = await axios.get("/user/admin/parents");
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de la liste des parents");
  }
}

/**
 * Récupère un parent par son ID
 */
export async function getAdminParentById(
  id: number,
): Promise<UtilisateurModel> {
  try {
    const response = await axios.get(`/user/admin/parents/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération du parent ID ${id}`);
  }
}

/**
 * Récupère tous les assistants
 */
export async function getAdminAssistants(): Promise<UtilisateurModel[]> {
  try {
    const response = await axios.get("/user/admin/assistants");
    return response.data;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération de la liste des assistants",
    );
  }
}

/**
 * Récupère un assistant par son ID
 */
export async function getAdminAssistantById(
  id: number,
): Promise<UtilisateurModel> {
  try {
    const response = await axios.get(`/user/admin/assistants/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de l'assistant ID ${id}`);
  }
}

/**
 * Récupère tous les enfants
 */
export async function getAdminEnfants(): Promise<EnfantModel[]> {
  try {
    const response = await axios.get("/enfant/admin/enfants");
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de la liste des enfants");
  }
}

/**
 * Récupère un enfant par son ID
 */
export async function getAdminEnfantById(id: number): Promise<EnfantModel> {
  try {
    const response = await axios.get(`/enfant/admin/enfants/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de l'enfant ID ${id}`);
  }
}

/**
 * Récupère tous les contrats du RAM
 */
export async function getAdminContrats(): Promise<ContratGardeModel[]> {
  try {
    const response = await axios.get("/contrat-garde/admin/tous");
    return response.data;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération de la liste des contrats",
    );
  }
}
