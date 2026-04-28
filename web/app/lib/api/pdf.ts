import { axios } from "@/app/lib/axios.instance";

export interface GenerateAutorisationDto {
    parentsNom: string;
    parent1Nom?: string;
    parent2Nom?: string;
    personne1Nom: string;
    personne1Adresse?: string;
    personne2Nom?: string;
    personne2Adresse?: string;
    personne2Ville?: string;
    faitA: string;
    date: string;
}

/**
 * Génère un PDF d'autorisation de personne autorisée
 * @param data - Les données pour générer l'autorisation
 * @returns Le blob du PDF généré
 */
export async function generateAutorisationPdf(
    data: GenerateAutorisationDto
): Promise<Blob> {
    try {
        const response = await axios.post("/pdf/autorisation", data, {
            responseType: "blob",
        });

        return response.data;
    } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        throw new Error("Erreur lors de la génération du PDF");
    }
}

/**
 * Télécharge le PDF d'autorisation
 * @param data - Les données pour générer l'autorisation
 * @param filename - Le nom du fichier à télécharger
 */
export async function downloadAutorisationPdf(
    data: GenerateAutorisationDto,
    filename: string = "autorisation-personne-autorisee.pdf"
): Promise<void> {
    const blob = await generateAutorisationPdf(data);

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
