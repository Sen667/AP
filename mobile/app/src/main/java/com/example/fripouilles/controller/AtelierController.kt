package com.example.fripouilles.controller

import android.util.Log
import androidx.compose.runtime.*
import com.example.fripouilles.model.*
import com.example.fripouilles.service.AtelierService
import com.example.fripouilles.service.AuthPreferences
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope

class AtelierController {
    var isLoading by mutableStateOf(false)
        private set
    var isInscriptionLoading by mutableStateOf(false)
        private set
    var errorMessage: String? by mutableStateOf(null)
        private set

    var ateliers = mutableStateListOf<Atelier>()
        private set
    var inscriptions = mutableStateListOf<InscriptionAtelier>()
        private set
    suspend fun loadAll() {
        isLoading = true
        errorMessage = null
        try {
            coroutineScope {
                val ateliersDeferred = async {
                    Log.d("AtelierController", "Appel AtelierService.getAllAteliers()")
                    val result = AtelierService.getAllAteliers()
                    Log.d("AtelierController", "Ateliers reçus du serveur: ${result.size}")
                    result.forEach { atelier ->
                        Log.d("AtelierController", "- ${atelier.nom} | Type: ${atelier.typePublic} | Inscriptions: ${atelier.inscriptions?.size ?: 0}")
                    }

                    val isAssistant = AuthPreferences.getUserRole() == Role.ASSISTANT
                    Log.d("AtelierController", "Est assistant? $isAssistant")

                    val filtered = if (isAssistant) {
                        val assistantAteliers = result.filter {
                            it.typePublic == TypePublicAtelier.ASSISTANT_UNIQUEMENT ||
                            it.typePublic == TypePublicAtelier.MIXTE
                        }
                        Log.d("AtelierController", "Ateliers filtrés pour assistant: ${assistantAteliers.size}")
                        assistantAteliers.forEach { atelier ->
                            Log.d("AtelierController", "- GARDE: ${atelier.nom} | Type: ${atelier.typePublic}")
                        }
                        assistantAteliers
                    } else {
                        result.filter { it.typePublic != TypePublicAtelier.ASSISTANT_UNIQUEMENT }
                    }
                    filtered
                }
                val inscriptionsDeferred = async {
                    Log.d("AtelierController", "Appel AtelierService.getMesInscriptions()")
                    val inscriptions = AtelierService.getMesInscriptions()
                    Log.d("AtelierController", "Inscriptions reçues: ${inscriptions.size}")
                    inscriptions
                }
                ateliers.clear()
                ateliers.addAll(ateliersDeferred.await())
                inscriptions.clear()
                inscriptions.addAll(inscriptionsDeferred.await())
            }
        } catch (e: Exception) {
            Log.e("AtelierController", "Erreur chargement ateliers", e)
            errorMessage = "Erreur lors du chargement des données: ${e.message}"
        } finally {
            isLoading = false
            Log.d("AtelierController", "=== FIN loadAll() ===")
        }
    }

    suspend fun loadUpcomingAteliers() {
        isLoading = true
        errorMessage = null
        try {
            val result = AtelierService.getAllAteliers()
            val isAssistant = AuthPreferences.getUserRole() == Role.ASSISTANT
            val filtered = if (isAssistant) {
                result.filter { it.typePublic == TypePublicAtelier.ASSISTANT_UNIQUEMENT || it.typePublic == TypePublicAtelier.MIXTE }
            } else {
                result.filter { it.typePublic != TypePublicAtelier.ASSISTANT_UNIQUEMENT }
            }
            ateliers.clear()
            ateliers.addAll(filtered)

            Log.d("AtelierController", "Ateliers chargés: ${filtered.size}")
            filtered.forEach { atelier ->
                Log.d("AtelierController", "- ${atelier.nom}: ${atelier.nombrePlaces} places, ${atelier.inscriptions?.size ?: 0} inscriptions")
            }
        } catch (e: Exception) {
            Log.e("AtelierController", "Erreur chargement ateliers", e)
            errorMessage = "Erreur lors du chargement des ateliers"
        } finally {
            isLoading = false
        }
    }

    suspend fun loadMesInscriptions() {
        errorMessage = null
        try {
            val result = AtelierService.getMesInscriptions()
            inscriptions.clear()
            inscriptions.addAll(result)
        } catch (e: Exception) {
            Log.e("AtelierController", "Erreur chargement inscriptions", e)
            errorMessage = "Erreur lors du chargement des inscriptions"
        }
    }

    suspend fun inscrire(atelierId: Int, enfantId: Int? = null): Boolean {
        isInscriptionLoading = true
        errorMessage = null
        return try {
            AtelierService.inscrire(CreateInscriptionAtelierDto(atelierId, enfantId))
            // Reconstruit la liste complète après l'inscription
            coroutineScope {
                val ateliersDeferred = async {
                    val result = AtelierService.getAllAteliers()
                    val isAssistant = AuthPreferences.getUserRole() == Role.ASSISTANT
                    if (isAssistant) {
                        result.filter {
                            it.typePublic == TypePublicAtelier.ASSISTANT_UNIQUEMENT ||
                            it.typePublic == TypePublicAtelier.MIXTE
                        }
                    } else {
                        result.filter { it.typePublic != TypePublicAtelier.ASSISTANT_UNIQUEMENT }
                    }
                }
                val inscriptionsDeferred = async {
                    AtelierService.getMesInscriptions()
                }
                ateliers.clear()
                ateliers.addAll(ateliersDeferred.await())
                inscriptions.clear()
                inscriptions.addAll(inscriptionsDeferred.await())
            }
            true
        } catch (e: Exception) {
            Log.e("AtelierController", "Erreur inscription", e)
            errorMessage = e.message ?: "Erreur lors de l'inscription"
            false
        } finally {
            isInscriptionLoading = false
        }
    }

    suspend fun desinscrire(atelierId: Int): Boolean {
        isInscriptionLoading = true
        errorMessage = null
        return try {
            AtelierService.desinscrire(atelierId)
            // Reconstruit la liste complète après la désinscription
            coroutineScope {
                val ateliersDeferred = async {
                    val result = AtelierService.getAllAteliers()
                    val isAssistant = AuthPreferences.getUserRole() == Role.ASSISTANT
                    if (isAssistant) {
                        result.filter {
                            it.typePublic == TypePublicAtelier.ASSISTANT_UNIQUEMENT ||
                            it.typePublic == TypePublicAtelier.MIXTE
                        }
                    } else {
                        result.filter { it.typePublic != TypePublicAtelier.ASSISTANT_UNIQUEMENT }
                    }
                }
                val inscriptionsDeferred = async {
                    AtelierService.getMesInscriptions()
                }
                ateliers.clear()
                ateliers.addAll(ateliersDeferred.await())
                inscriptions.clear()
                inscriptions.addAll(inscriptionsDeferred.await())
            }
            true
        } catch (e: Exception) {
            Log.e("AtelierController", "Erreur désinscription", e)
            errorMessage = e.message ?: "Erreur lors de la désinscription"
            false
        } finally {
            isInscriptionLoading = false
        }
    }

    fun isInscrit(atelierId: Int): Boolean =
        inscriptions.any { it.atelierId == atelierId }

    fun clearError() {
        errorMessage = null
    }
}
