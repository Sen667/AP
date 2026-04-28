package com.example.fripouilles.model

import kotlinx.serialization.Serializable

@Serializable
enum class Role {
    ADMIN,
    PARENT,
    ASSISTANT
}

@Serializable
enum class StatutValidation {
    EN_ATTENTE,
    VALIDE,
    REFUSE
}

@Serializable
enum class StatutContrat {
    EN_ATTENTE_VALIDATION,
    ACTIF,
    SUSPENDU,
    TERMINE
}
