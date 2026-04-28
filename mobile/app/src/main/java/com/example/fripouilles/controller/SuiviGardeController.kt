package com.example.fripouilles.controller

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.example.fripouilles.model.*
import com.example.fripouilles.service.SuiviGardeService
import java.time.LocalDate

class SuiviGardeController {
    var isLoading by mutableStateOf(false)
        private set
    var errorMessage: String? by mutableStateOf(null)
        private set

    var contrats = mutableStateListOf<ContratGarde>()
        private set
    var suivis = mutableStateListOf<SuiviGarde>()
        private set
    var currentSuivi by mutableStateOf<SuiviGarde?>(null)
        private set

    // Paramètres de filtre pour la recherche assistante
    private var lastMois: Int? = null
    private var lastAnnee: Int? = null
    private var lastStatut: StatutValidation? = null
    private var lastContratId: Int? = null

    suspend fun loadContratsAssistant() {
        isLoading = true
        errorMessage = null
        try {
            val result = SuiviGardeService.getContratsAssistant()
            contrats.clear()
            contrats.addAll(result.filter { it.statut == StatutContrat.ACTIF })
        } catch (e: Exception) {
            Log.e("SuiviGardeController", "Erreur chargement contrats", e)
            errorMessage = "Erreur lors du chargement des contrats: ${e.message}"
        } finally {
            isLoading = false
        }
    }

    suspend fun loadSuivisAssistant(mois: Int? = null, annee: Int? = null, statut: StatutValidation? = null, contratId: Int? = null): Boolean {
        isLoading = true
        errorMessage = null
        return try {
            // Sauvegarder les paramètres de filtre
            lastMois = mois
            lastAnnee = annee
            lastStatut = statut
            lastContratId = contratId

            val result = SuiviGardeService.getSuivisAssistant(mois, annee)
            suivis.clear()
            var filtered = if (statut != null) result.filter { it.statut == statut } else result
            filtered = if (contratId != null) filtered.filter { it.contratId == contratId } else filtered
            suivis.addAll(filtered)
            true
        } catch (e: Exception) {
            Log.e("SuiviGardeController", "Erreur chargement suivis", e)
            errorMessage = "Erreur lors du chargement des suivis: ${e.message}"
            false
        } finally {
            isLoading = false
        }
    }

    suspend fun createSuivi(
        contratId: Int,
        date: String,
        arriveeMinutes: Int?,
        departMinutes: Int?,
        repasFournis: Int,
        fraisDivers: Double?,
        km: Double?
    ): Boolean {
        isLoading = true
        errorMessage = null
        return try {
            val dto = CreateSuiviGardeDto(
                contratId = contratId,
                date = date,
                arriveeMinutes = arriveeMinutes,
                departMinutes = departMinutes,
                repasFournis = repasFournis,
                fraisDivers = fraisDivers,
                km = km
            )
            val result = SuiviGardeService.createSuivi(dto)
            suivis.add(0, result)
            true
        } catch (e: Exception) {
            Log.e("SuiviGardeController", "Erreur création suivi", e)
            errorMessage = "Erreur lors de la création du suivi: ${e.message}"
            false
        } finally {
            isLoading = false
        }
    }

    suspend fun updateSuivi(
        id: Int,
        arriveeMinutes: Int?,
        departMinutes: Int?,
        repasFournis: Int?,
        fraisDivers: Double?,
        km: Double?
    ): Boolean {
        isLoading = true
        errorMessage = null
        return try {
            val dto = UpdateSuiviGardeDto(
                arriveeMinutes = arriveeMinutes,
                departMinutes = departMinutes,
                repasFournis = repasFournis,
                fraisDivers = fraisDivers,
                km = km
            )
            SuiviGardeService.updateSuivi(id, dto)
            // Recharger les suivis avec les filtres appliqués
            loadSuivisAssistant(lastMois, lastAnnee, lastStatut, lastContratId)
            true
        } catch (e: Exception) {
            Log.e("SuiviGardeController", "Erreur mise à jour suivi", e)
            errorMessage = "Erreur lors de la mise à jour du suivi: ${e.message}"
            false
        } finally {
            isLoading = false
        }
    }

    suspend fun deleteSuivi(id: Int): Boolean {
        isLoading = true
        errorMessage = null
        return try {
            SuiviGardeService.deleteSuivi(id)
            // Recharger les suivis avec les filtres appliqués
            loadSuivisAssistant(lastMois, lastAnnee, lastStatut, lastContratId)
            true
        } catch (e: Exception) {
            Log.e("SuiviGardeController", "Erreur suppression suivi", e)
            errorMessage = "Erreur lors de la suppression du suivi: ${e.message}"
            false
        } finally {
            isLoading = false
        }
    }

    suspend fun loadSuivisParent(mois: Int? = null, annee: Int? = null, statut: StatutValidation? = null): Boolean {
        isLoading = true
        errorMessage = null
        return try {
            val result = SuiviGardeService.getSuivisParent(mois, annee)
            suivis.clear()
            // Apply status filter if specified
            val filteredResult = if (statut != null) {
                result.filter { it.statut == statut }
            } else {
                result
            }
            suivis.addAll(filteredResult)
            true
        } catch (e: Exception) {
            Log.e("SuiviGardeController", "Erreur chargement suivis parent", e)
            errorMessage = "Erreur lors du chargement des suivis: ${e.message}"
            false
        } finally {
            isLoading = false
        }
    }

    suspend fun validerSuivi(
        id: Int,
        statut: StatutValidation,
        arriveeMinutes: Int?,
        departMinutes: Int?,
        repasFournis: Int?,
        fraisDivers: Double?,
        km: Double?,
        commentairesParent: String?
    ): Boolean {
        isLoading = true
        errorMessage = null
        return try {
            val dto = ValiderSuiviGardeDto(
                statut = statut,
                arriveeMinutes = arriveeMinutes,
                departMinutes = departMinutes,
                repasFournis = repasFournis,
                fraisDivers = fraisDivers,
                km = km,
                commentairesParent = commentairesParent
            )
            SuiviGardeService.validerSuivi(id, dto)
            // Recharger les suivis pour synchroniser avec le serveur
            loadSuivisParent()
            true
        } catch (e: Exception) {
            Log.e("SuiviGardeController", "Erreur validation suivi", e)
            errorMessage = "Erreur lors de la validation du suivi: ${e.message}"
            false
        } finally {
            isLoading = false
        }
    }

    fun loadSuivi(id: Int) {
        currentSuivi = suivis.find { it.id?.equals(id) == true }
    }

    fun clearError() {
        errorMessage = null
    }
}
