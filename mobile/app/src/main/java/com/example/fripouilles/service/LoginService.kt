package com.example.fripouilles.service

import com.example.fripouilles.model.LoginRequest
import com.example.fripouilles.model.LoginResponse
import com.example.fripouilles.network.ApiClient
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType

object LoginService {
    private val client = ApiClient.client
    private const val API_URL = ApiClient.API_URL

    suspend fun login(email: String, password: String): LoginResponse {
        val response = client.post("$API_URL/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(LoginRequest(email, password))
        }.body<LoginResponse>()
        
        // Sauvegarder le token et les infos utilisateur
        AuthPreferences.saveToken(response.token)
        AuthPreferences.saveUserInfo(
            userId = response.utilisateur.id,
            role = response.utilisateur.role.name,
            email = response.utilisateur.email,
            name = "${response.utilisateur.prenom} ${response.utilisateur.nom}"
        )
        
        return response
    }
    
    fun logout() {
        AuthPreferences.clear()
    }
}