package com.example.fripouilles.model

import kotlinx.serialization.Serializable

@Serializable
data class ContratGarde(
    val id: Int,
    val enfantId: Int,
    val parentId: Int,
    val assistantId: Int,
    val dateDebut: String,
    val dateFin: String? = null,
    val statut: StatutContrat,
    val tarifHoraireBrut: String,
    val nombreHeuresSemaine: String,
    val indemniteEntretien: String,
    val indemniteRepas: String,
    val indemniteKm: String? = null,
    val enfant: EnfantInfo? = null
)

@Serializable
data class EnfantInfo(
    val id: Int,
    val nom: String,
    val prenom: String,
    val dateNaissance: String? = null  // Optionnel pour les ateliers
)
