package com.example.fripouilles.service

import com.example.fripouilles.model.*
import com.example.fripouilles.network.ApiClient
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.ContentType
import io.ktor.http.contentType
import android.util.Log // Assuming Android usage

open class SuiviJournalierService {
    private val client = ApiClient.client
    private val API_URL = ApiClient.API_URL
    
    open suspend fun getEnfantsAssistant(): List<EnfantInfo> {
        return try {
            val token = AuthPreferences.getToken() ?: throw Exception("Non authentifié")
            client.get("$API_URL/suivi-journalier/mes-enfants") {
                header("Authorization", "Bearer $token")
            }.body()
        } catch (e: Exception) {
            println("Erreur getEnfantsAssistant: ${e.message}")
            emptyList()
        }
    }
    
    open suspend fun getEnfantsParent(): List<EnfantInfo> {
        return try {
            val token = AuthPreferences.getToken() ?: throw Exception("Non authentifié")
            client.get("$API_URL/enfant/mes-enfants") {
                header("Authorization", "Bearer $token")
            }.body()
        } catch (e: Exception) {
            println("Erreur getEnfantsParent: ${e.message}")
            emptyList()
        }
    }

    open suspend fun getSuiviByDate(enfantId: Int, date: String): SuiviJournalierEnfant? {
        return try {
            val token = AuthPreferences.getToken() ?: throw Exception("Non authentifié")
            val suivis: List<SuiviJournalierEnfant> = client.get("$API_URL/suivi-journalier/enfant/$enfantId") {
                header("Authorization", "Bearer $token")
            }.body()
            
            suivis.find { it.date.startsWith(date) }
        } catch (e: Exception) {
            println("Erreur getSuiviByDate: ${e.message}")
            null
        }
    }

    open suspend fun createOrUpdateSuivi(dto: CreateSuiviJournalierDto): SuiviJournalierEnfant? {
        return try {
            val token = AuthPreferences.getToken() ?: throw Exception("Non authentifié")
            val response = client.post("$API_URL/suivi-journalier") {
                header("Authorization", "Bearer $token")
                header("Content-Type", "application/json")
                contentType(io.ktor.http.ContentType.Application.Json)
                setBody(dto)
            }
            if (response.status.value in 200..299) {
                response.body()
            } else {
                null
            }
        } catch (e: Exception) {
            println("Erreur createOrUpdateSuivi: ${e.message}")
            null
        }
    }
}
