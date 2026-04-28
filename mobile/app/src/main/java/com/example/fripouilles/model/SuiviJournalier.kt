package com.example.fripouilles.model

import kotlinx.serialization.Serializable

@Serializable
data class SuiviJournalierEnfant(
    val id: Int? = null,
    val enfantId: Int,
    val assistantId: Int? = null,
    val date: String,
    val temperature: Float? = null,
    val humeur: String? = null,
    val pleurs: String? = null,
    val besoins: String? = null,
    val repasHoraires: String? = null,
    val repasAliments: String? = null,
    val dodoDeb: String? = null,
    val dodoFin: String? = null,
    val activites: String? = null,
    val promenadeHoraires: String? = null,
    val remarques: String? = null,
    // Champs potentiellement dépréciés mais conservés pour éviter des erreurs de parsing si le backend les envoie toujours
    val repas: String? = null,
    val sieste: String? = null,
    val enfant: EnfantInfo? = null
)

@Serializable
data class CreateSuiviJournalierDto(
    val enfantId: Int,
    val date: String,
    val temperature: Float? = null,
    val humeur: String? = null,
    val pleurs: String? = null,
    val besoins: String? = null,
    val repasHoraires: String? = null,
    val repasAliments: String? = null,
    val dodoDeb: String? = null,
    val dodoFin: String? = null,
    val activites: String? = null,
    val promenadeHoraires: String? = null,
    val remarques: String? = null
)
