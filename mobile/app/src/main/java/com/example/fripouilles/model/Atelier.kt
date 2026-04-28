package com.example.fripouilles.model

import kotlinx.serialization.Serializable

@Serializable
data class Atelier(
    val id: Int,
    val nom: String,
    val description: String? = null,
    val date: String,
    val debutMinutes: Int,
    val finMinutes: Int,
    val dateLimiteInscription: String,
    val nombrePlaces: Int,
    val lieu: String,
    val typePublic: TypePublicAtelier,
    val ageMinMois: Int? = null,
    val ageMaxMois: Int? = null,
    val animateurId: Int? = null,
    val animateur: AnimateurInfo? = null,
    val inscriptions: List<InscriptionAtelier> = emptyList(),
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class AnimateurInfo(
    val id: Int,
    val utilisateur: UserInfo? = null
)

@Serializable
data class UserInfo(
    val id: Int,
    val prenom: String,
    val nom: String
)

@Serializable
data class InscriptionAtelier(
    val id: Int? = null,
    val atelierId: Int? = null,
    val parentId: Int? = null,
    val enfantId: Int? = null,
    val assistantId: Int? = null,
    val present: Boolean = false,
    val enfant: EnfantInfo? = null,
    val atelier: Atelier? = null
)

@Serializable
data class CreateInscriptionAtelierDto(
    val atelierId: Int,
    val enfantId: Int? = null
)

@Serializable
enum class TypePublicAtelier {
    ENFANT,
    PARENT_UNIQUEMENT,
    ASSISTANT_UNIQUEMENT,
    MIXTE
}
