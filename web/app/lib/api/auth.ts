import { axios } from "@/app/lib/axios.instance";
import { Role, Sexe } from "@/app/types/enums";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    nom: string;
    prenom: string;
    telephone: string;
    dateNaissance: string;
    email: string;
    password: string;
    role: Role;
    sexe: Sexe;
}

export interface AuthResponse {
    message: string;
    token: string;
}

/**
 * Authentifier un utilisateur
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
    try {
        const response = await axios.post("/auth/login", payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de l'authentification");
    }
}

/**
 * Enregistrer un nouvel utilisateur
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
        const response = await axios.post("/auth/register", payload);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de l'enregistrement");
    }
}
