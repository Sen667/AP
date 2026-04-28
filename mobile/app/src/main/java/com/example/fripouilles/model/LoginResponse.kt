package com.example.fripouilles.model

import kotlinx.serialization.Serializable

@Serializable
data class LoginResponse(
    val token: String,
    val utilisateur: UtilisateurInfo
)

@Serializable
data class UtilisateurInfo(
    val id: Int,
    val nom: String,
    val prenom: String,
    val email: String,
    val role: Role
)