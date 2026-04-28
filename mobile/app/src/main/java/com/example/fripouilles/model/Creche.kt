package com.example.fripouilles.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

/**
 * Modèles pour la gestion de la crèche (inscriptions et réservations)
 */

// ══════════════════════════════════════════════════════════
// ENUMS
// ══════════════════════════════════════════════════════════

@Serializable
enum class TypeAccueilCreche {
    @SerialName("REGULIER")
    REGULIER,
    @SerialName("OCCASIONNEL")
    OCCASIONNEL
}

@Serializable
enum class StatutInscription {
    @SerialName("ACTIVE")
    ACTIVE,
    @SerialName("INACTIVE")
    INACTIVE,
    @SerialName("EN_ATTENTE")
    EN_ATTENTE
}

@Serializable
enum class JourSemaine {
    @SerialName("LUNDI")
    LUNDI,
    @SerialName("MARDI")
    MARDI,
    @SerialName("MERCREDI")
    MERCREDI,
    @SerialName("JEUDI")
    JEUDI,
    @SerialName("VENDREDI")
    VENDREDI
}

// ══════════════════════════════════════════════════════════
// ENFANT (simplifié pour les réponses API)
// ══════════════════════════════════════════════════════════

@Serializable
data class EnfantSimple(
    val id: Int,
    val nom: String,
    val prenom: String,
    val dateNaissance: String
)

// ══════════════════════════════════════════════════════════
// JOUR RÉSERVATION CRÈCHE
// ══════════════════════════════════════════════════════════

@Serializable
data class JourReservationCreche(
    val id: Int,
    val inscriptionId: Int,
    val jourSemaine: JourSemaine
)

// ══════════════════════════════════════════════════════════
// INSCRIPTION CRÈCHE
// ══════════════════════════════════════════════════════════

@Serializable
data class InscriptionCreche(
    val id: Int,
    val enfantId: Int,
    val parentId: Int,
    val typeAccueil: TypeAccueilCreche,
    val dateDebut: String,
    val dateFin: String?,
    val statut: StatutInscription,
    val enfant: EnfantSimple? = null,
    val jours: List<JourReservationCreche>? = null
)

@Serializable
data class CreateInscriptionRequest(
    val enfantId: Int,
    val parentId: Int,
    val typeAccueil: TypeAccueilCreche,
    val dateDebut: String,
    val dateFin: String? = null,
    val jours: List<JourSemaine>? = null
)

// ══════════════════════════════════════════════════════════
// RÉSERVATION CRÈCHE
// ══════════════════════════════════════════════════════════

@Serializable
data class ReservationCreche(
    val id: Int,
    val enfantId: Int,
    val parentId: Int,
    val date: String,
    val arriveeMinutes: Int,
    val departMinutes: Int,
    val statut: StatutValidation,
    val montant: Double,
    val enfant: EnfantSimple? = null
) {
    fun getHeureArrivee(): String {
        val heures = arriveeMinutes / 60
        val minutes = arriveeMinutes % 60
        return String.format("%02d:%02d", heures, minutes)
    }

    fun getHeureDepart(): String {
        val heures = departMinutes / 60
        val minutes = departMinutes % 60
        return String.format("%02d:%02d", heures, minutes)
    }

    fun getHorairesFormatted(): String {
        return "${getHeureArrivee()} - ${getHeureDepart()}"
    }
}

@Serializable
data class CreateReservationRequest(
    val enfantId: Int,
    val parentId: Int,
    val date: String,
    val arriveeMinutes: Int,
    val departMinutes: Int,
    val montant: Double = 0.0
)

// ══════════════════════════════════════════════════════════
// DISPONIBILITÉ
// ══════════════════════════════════════════════════════════

@Serializable
data class DisponibiliteResponse(
    val places: Int
)
