/**
 * Convertit une chaîne en slug en supprimant les accents et en normalisant
 * @param text - Le texte à convertir en slug
 * @returns Le slug normalisé
 */
export function slugify(text: string | undefined | null): string {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return "";
    }
    return text
        .normalize("NFD") // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Supprime les caractères spéciaux
        .replace(/\s+/g, "-") // Remplace les espaces par des tirets
        .replace(/-+/g, "-"); // Supprime les tirets multiples
}

/**
 * Crée un slug pour un enfant à partir de son prénom et nom
 * @param prenom - Le prénom de l'enfant
 * @param nom - Le nom de l'enfant
 * @returns Le slug de l'enfant
 */
export function createEnfantSlug(prenom: string, nom: string): string {
    const prenomSlug = slugify(prenom);
    const nomSlug = slugify(nom);
    const result = `${prenomSlug}-${nomSlug}`;
    return result.replace(/-+/g, "-").replace(/^-|-$/g, "");
}
