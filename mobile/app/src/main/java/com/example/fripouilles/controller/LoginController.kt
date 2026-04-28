package com.example.fripouilles.controller

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.example.fripouilles.service.LoginService

class LoginController {
    var isLoading by mutableStateOf(false)
        private set
    var errorMessage: String? by mutableStateOf(null)
        private set

    suspend fun login(
        email: String,
        password: String,
        onSuccess: () -> Unit
    ) {
        isLoading = true
        errorMessage = null
        try {
            LoginService.login(email, password)
            onSuccess()
        } catch (e: Exception) {
            Log.e("LoginController", "Erreur login", e)
            errorMessage = "Échec de la connexion. Veuillez vérifier vos identifiants et réessayer."
        } finally {
            isLoading = false
        }
    }
}