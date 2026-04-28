package com.example.fripouilles.service

import com.example.fripouilles.model.*
import com.example.fripouilles.network.ApiClient
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.ContentType
import io.ktor.http.contentType

object SuiviGardeService {
    private val client = ApiClient.client
    private const val API_URL = ApiClient.API_URL
    
    private fun getAuthHeader(): String {
        return "Bearer ${AuthPreferences.getToken()}"
    }

    suspend fun getContratsAssistant(): List<ContratGarde> {
        return client.get("$API_URL/contrat-garde/assistant/mes-contrats") {
            headers {
                append("Authorization", getAuthHeader())
            }
        }.body()
    }
    
    suspend fun getSuivisAssistant(mois: Int? = null, annee: Int? = null): List<SuiviGarde> {
        return client.get("$API_URL/suivi-garde/assistant") {
            headers {
                append("Authorization", getAuthHeader())
            }
            mois?.let { url.parameters.append("mois", it.toString()) }
            annee?.let { url.parameters.append("annee", it.toString()) }
        }.body()
    }
    
    suspend fun getSuiviAssistant(id: Int): SuiviGarde {
        return client.get("$API_URL/suivi-garde/assistant/$id") {
            headers {
                append("Authorization", getAuthHeader())
            }
        }.body()
    }
    
    suspend fun createSuivi(dto: CreateSuiviGardeDto): SuiviGarde {
        return client.post("$API_URL/suivi-garde/assistant") {
            headers {
                append("Authorization", getAuthHeader())
            }
            contentType(ContentType.Application.Json)
            setBody(dto)
        }.body()
    }
    
    suspend fun updateSuivi(id: Int, dto: UpdateSuiviGardeDto): SuiviGarde {
        return client.patch("$API_URL/suivi-garde/assistant/$id") {
            headers {
                append("Authorization", getAuthHeader())
            }
            contentType(ContentType.Application.Json)
            setBody(dto)
        }.body()
    }
    
    suspend fun deleteSuivi(id: Int) {
        client.delete("$API_URL/suivi-garde/assistant/$id") {
            headers {
                append("Authorization", getAuthHeader())
            }
        }
    }
    
    suspend fun getSuivisParent(mois: Int? = null, annee: Int? = null): List<SuiviGarde> {
        return client.get("$API_URL/suivi-garde/parent") {
            headers {
                append("Authorization", getAuthHeader())
            }
            mois?.let { url.parameters.append("mois", it.toString()) }
            annee?.let { url.parameters.append("annee", it.toString()) }
        }.body()
    }
    
    suspend fun getSuiviParent(id: Int): SuiviGarde {
        return client.get("$API_URL/suivi-garde/parent/$id") {
            headers {
                append("Authorization", getAuthHeader())
            }
        }.body()
    }
    
    suspend fun validerSuivi(id: Int, dto: ValiderSuiviGardeDto): SuiviGarde {
        return client.patch("$API_URL/suivi-garde/parent/$id/valider") {
            headers {
                append("Authorization", getAuthHeader())
            }
            contentType(ContentType.Application.Json)
            setBody(dto)
        }.body()
    }
}
