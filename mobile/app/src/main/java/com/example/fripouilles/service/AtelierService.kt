package com.example.fripouilles.service

import android.util.Log
import com.example.fripouilles.model.Atelier
import com.example.fripouilles.model.CreateInscriptionAtelierDto
import com.example.fripouilles.model.InscriptionAtelier
import com.example.fripouilles.network.ApiClient
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.ContentType
import io.ktor.http.contentType

object AtelierService {
    private val client = ApiClient.client
    private const val API_URL = ApiClient.API_URL
    private fun getAuthHeader(): String = "Bearer ${AuthPreferences.getToken()}"
    private fun isAssistant(): Boolean = AuthPreferences.getUserRole() == com.example.fripouilles.model.Role.ASSISTANT
    suspend fun getUpcomingAteliers(): List<Atelier> {
        return try {
            val response = client.get("$API_URL/ateliers/upcoming") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("AtelierService", "Response status: ${response.status}")
            val ateliers: List<Atelier> = response.body()
            Log.d("AtelierService", "Ateliers parsés: ${ateliers.size}")
            ateliers
        } catch (e: Exception) {
            Log.e("AtelierService", "Erreur getUpcomingAteliers", e)
            throw e
        }
    }

    suspend fun getAllAteliers(): List<Atelier> {
        Log.d("AtelierService", "=== getAllAteliers() ===")
        return try {
            val response = client.get("$API_URL/ateliers") {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("AtelierService", "Response status: ${response.status}")
            val ateliers: List<Atelier> = response.body()
            Log.d("AtelierService", "Ateliers parsés: ${ateliers.size}")
            ateliers
        } catch (e: Exception) {
            Log.e("AtelierService", "Erreur getAllAteliers", e)
            throw e
        }
    }

    suspend fun getMesInscriptions(): List<InscriptionAtelier> {
        Log.d("AtelierService", "=== getMesInscriptions() ===")
        val url = if (isAssistant())
            "$API_URL/ateliers/inscriptions/assistant/mes-inscriptions"
        else
            "$API_URL/ateliers/inscriptions/mes-inscriptions"
        Log.d("AtelierService", "URL: $url")
        Log.d("AtelierService", "Est assistant: ${isAssistant()}")
        
        return try {
            val response = client.get(url) {
                headers { append("Authorization", getAuthHeader()) }
            }
            Log.d("AtelierService", "Response status: ${response.status}")
            val inscriptions: List<InscriptionAtelier> = response.body()
            Log.d("AtelierService", "Inscriptions parsées: ${inscriptions.size}")
            inscriptions
        } catch (e: Exception) {
            Log.e("AtelierService", "Erreur getMesInscriptions", e)
            throw e
        }
    }

    suspend fun inscrire(dto: CreateInscriptionAtelierDto): InscriptionAtelier {
        val url = if (isAssistant())
            "$API_URL/ateliers/inscriptions/assistant"
        else
            "$API_URL/ateliers/inscriptions"
        return client.post(url) {
            headers { append("Authorization", getAuthHeader()) }
            contentType(ContentType.Application.Json)
            setBody(dto)
        }.body()
    }

    suspend fun desinscrire(atelierId: Int) {
        val url = if (isAssistant())
            "$API_URL/ateliers/inscriptions/assistant/$atelierId"
        else
            "$API_URL/ateliers/inscriptions/$atelierId"
        client.delete(url) {
            headers { append("Authorization", getAuthHeader()) }
        }
    }
}
