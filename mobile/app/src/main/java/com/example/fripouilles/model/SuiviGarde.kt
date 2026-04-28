package com.example.fripouilles.model

import kotlinx.serialization.Serializable

@Serializable
data class SuiviGarde(
    val id: Int? = null,
    val contratId: Int? = null,
    val date: String? = null,
    val arriveeMinutes: Int? = null,
    val departMinutes: Int? = null,
    val repasFournis: Int = 0,
    val fraisDivers: String? = null,
    val km: String? = null,
    val statut: StatutValidation? = null,
    val dateValidation: String? = null,
    val commentairesParent: String? = null,
    val contrat: ContratGarde? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class CreateSuiviGardeDto(
    val contratId: Int,
    val date: String,
    val arriveeMinutes: Int? = null,
    val departMinutes: Int? = null,
    val repasFournis: Int = 0,
    val fraisDivers: Double? = null,
    val km: Double? = null
)

@Serializable
data class UpdateSuiviGardeDto(
    val arriveeMinutes: Int? = null,
    val departMinutes: Int? = null,
    val repasFournis: Int? = null,
    val fraisDivers: Double? = null,
    val km: Double? = null
)

@Serializable
data class ValiderSuiviGardeDto(
    val statut: StatutValidation,
    val arriveeMinutes: Int? = null,
    val departMinutes: Int? = null,
    val repasFournis: Int? = null,
    val fraisDivers: Double? = null,
    val km: Double? = null,
    val commentairesParent: String? = null
)
