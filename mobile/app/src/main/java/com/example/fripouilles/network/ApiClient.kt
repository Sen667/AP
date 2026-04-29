package com.example.fripouilles.network

import com.example.fripouilles.BuildConfig
import io.ktor.client.*
import io.ktor.client.engine.android.*
import io.ktor.client.plugins.HttpResponseValidator
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.statement.bodyAsText
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject

object ApiClient {
    const val API_URL = BuildConfig.API_URL

    val client = HttpClient(Android) {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            })
        }
        install(Logging) {
            logger = Logger.ANDROID
            level = LogLevel.BODY
        }
        HttpResponseValidator {
            validateResponse { response ->
                if (!response.status.value.toString().startsWith("2")) {
                    val body = response.bodyAsText()
                    // Extract "message" from NestJS error JSON if possible
                    val message = try {
                        val json = Json { ignoreUnknownKeys = true }
                        val obj = json.parseToJsonElement(body)
                        obj.jsonObject["message"]?.toString()?.trim('"') ?: body
                    } catch (_: Exception) {
                        body
                    }
                    throw Exception("Erreur ${response.status.value} : $message")
                }
            }
        }
    }
}
