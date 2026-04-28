/**
 * Calcule l'âge d'une personne basé sur sa date de naissance
 * @param dateNaissance - La date de naissance (string ou Date)
 * @returns L'âge en années
 */
export function calculateAge(dateNaissance: string | Date): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

/**
 * Calcule l'âge détaillé d'un enfant (avec mois)
 * @param dateNaissance - La date de naissance (string)
 * @returns L'âge formaté en années et mois (ex: "2 ans et 3 mois")
 */
export function calculateAgeDetailed(dateNaissance: string): string {
    const birth = new Date(dateNaissance);
    const today = new Date();
    const months =
        (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth());

    if (months < 12) {
        return `${months} mois`;
    } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return remainingMonths > 0
            ? `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois`
            : `${years} an${years > 1 ? 's' : ''}`;
    }
}
