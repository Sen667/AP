package com.example.fripouilles.service

import android.util.Log
import com.example.fripouilles.model.*
import com.example.fripouilles.network.ApiClient
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.ContentType
import io.ktor.http.contentType

object CrecheService {
    private val client = ApiClient.client
    private const val API_URL = ApiClient.API_URL
    private fun getAuthHeader(): String = "Bearer ${AuthPreferences.getToken()}"

    /**
     * Récupérer les enfants du parent connecté
     */
    suspend fun getEnfantsParent(): List<EnfantInfo> {
        return try {
            val response = client.get("$API_URL/enfant/mes-enfants") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("CrecheService", "Enfants récupérés: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur getEnfantsParent", e)
            throw e
        }
    }

    /**
     * Vérifier les places disponibles pour une date donnée
     * @param date Format: YYYY-MM-DD
     */
    suspend fun checkDisponibilite(date: String): DisponibiliteResponse {
        return try {
            val response = client.get("$API_URL/creche/disponibilite?date=$date") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("CrecheService", "Disponibilité pour $date: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur checkDisponibilite", e)
            throw e
        }
    }

    /**
     * Récupérer les inscriptions d'un parent
     */
    suspend fun getInscriptionsByParent(parentId: Int): List<InscriptionCreche> {
        return try {
            val response = client.get("$API_URL/creche/parent/$parentId/inscriptions") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("CrecheService", "Inscriptions récupérées: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur getInscriptionsByParent", e)
            throw e
        }
    }

    /**
     * Récupérer les réservations d'un parent
     */
    suspend fun getReservationsByParent(parentId: Int): List<ReservationCreche> {
        return try {
            val response = client.get("$API_URL/creche/parent/$parentId/reservations") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("CrecheService", "Réservations récupérées: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur getReservationsByParent", e)
            throw e
        }
    }

    /**
     * Créer une inscription (Régulière ou Occasionnelle)
     */
    suspend fun createInscription(request: CreateInscriptionRequest): InscriptionCreche {
        return try {
            val response = client.post("$API_URL/creche/inscription") {
                headers {
                    append("Authorization", getAuthHeader())
                }
                contentType(ContentType.Application.Json)
                setBody(request)
            }
            Log.d("CrecheService", "Inscription créée: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur createInscription", e)
            throw e
        }
    }

    /**
     * Créer une réservation (au moins 24h à l'avance)
     */
    suspend fun createReservation(request: CreateReservationRequest): ReservationCreche {
        return try {
            val response = client.post("$API_URL/creche/reservation") {
                headers {
                    append("Authorization", getAuthHeader())
                }
                contentType(ContentType.Application.Json)
                setBody(request)
            }
            Log.d("CrecheService", "Réservation créée: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur createReservation", e)
            throw e
        }
    }

    /**
     * Modifier une inscription
     */
    suspend fun updateInscription(id: Int, request: CreateInscriptionRequest): InscriptionCreche {
        return try {
            val response = client.put("$API_URL/creche/inscription/$id") {
                headers {
                    append("Authorization", getAuthHeader())
                }
                contentType(ContentType.Application.Json)
                setBody(request)
            }
            Log.d("CrecheService", "Inscription modifiée: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur updateInscription", e)
            throw e
        }
    }

    /**
     * Modifier une réservation
     */
    suspend fun updateReservation(id: Int, request: CreateReservationRequest): ReservationCreche {
        return try {
            val response = client.put("$API_URL/creche/reservation/$id") {
                headers {
                    append("Authorization", getAuthHeader())
                }
                contentType(ContentType.Application.Json)
                setBody(request)
            }
            Log.d("CrecheService", "Réservation modifiée: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur updateReservation", e)
            throw e
        }
    }

    /**
     * Supprimer une inscription
     */
    suspend fun deleteInscription(id: Int) {
        try {
            val response = client.delete("$API_URL/creche/inscription/$id") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("CrecheService", "Inscription supprimée: ${response.status}")
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur deleteInscription", e)
            throw e
        }
    }

    /**
     * Supprimer une réservation
     */
    suspend fun deleteReservation(id: Int) {
        try {
            val response = client.delete("$API_URL/creche/reservation/$id") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("CrecheService", "Réservation supprimée: ${response.status}")
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur deleteReservation", e)
            throw e
        }
    }

    /**
     * Signaler une absence sur une inscription régulière
     */
    suspend fun createAbsence(request: CreateAbsenceRequest): AbsenceCreche {
        return try {
            val response = client.post("$API_URL/creche/absence") {
                headers { append("Authorization", getAuthHeader()) }
                contentType(ContentType.Application.Json)
                setBody(request)
            }
            Log.d("CrecheService", "Absence créée: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur createAbsence", e)
            throw e
        }
    }

    /**
     * Récupérer les absences d'une inscription
     */
    suspend fun getAbsencesByInscription(inscriptionId: Int): List<AbsenceCreche> {
        return try {
            val response = client.get("$API_URL/creche/inscription/$inscriptionId/absences") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("CrecheService", "Absences récupérées: ${response.status}")
            response.body()
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur getAbsencesByInscription", e)
            throw e
        }
    }

    /**
     * Supprimer une absence
     */
    suspend fun deleteAbsence(id: Int) {
        try {
            val response = client.delete("$API_URL/creche/absence/$id") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("CrecheService", "Absence supprimée: ${response.status}")
        } catch (e: Exception) {
            Log.e("CrecheService", "Erreur deleteAbsence", e)
            throw e
        }
    }
}
