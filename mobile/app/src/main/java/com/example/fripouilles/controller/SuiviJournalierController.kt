package com.example.fripouilles.controller

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.mutableStateListOf
import com.example.fripouilles.model.*
import com.example.fripouilles.service.SuiviJournalierService
import java.time.LocalDate
import java.time.DayOfWeek
import java.time.temporal.TemporalAdjusters

class SuiviJournalierController(
    private val service: SuiviJournalierService = SuiviJournalierService()
) {
    var isLoading by mutableStateOf(false)
        private set
    var errorMessage by mutableStateOf<String?>(null)
        private set
        
    var enfants = mutableStateListOf<EnfantInfo>()
        private set
    var selectedEnfantId by mutableStateOf<Int?>(null)

    var suivisSemaine = mutableStateMapOf<String, SuiviJournalierEnfant>()
        private set
        
    var currentWeekStart by mutableStateOf(LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)))
        private set

    suspend fun loadEnfants(isAssistant: Boolean) {
        isLoading = true
        errorMessage = null
        try {
            val result = if (isAssistant) {
                service.getEnfantsAssistant()
            } else {
                service.getEnfantsParent()
            }
            enfants.clear()
            enfants.addAll(result)
            
            if (enfants.isNotEmpty() && selectedEnfantId == null) {
                selectedEnfantId = enfants.first().id
            }
        } catch (e: Exception) {
            errorMessage = "Erreur chargement enfants: ${e.message}"
        } finally {
            isLoading = false
        }
    }
    
    suspend fun loadSemaine(enfantId: Int, weekStartDate: LocalDate) {
        isLoading = true
        errorMessage = null
        currentWeekStart = weekStartDate
        suivisSemaine.clear()
        
        try {
            (0..6).forEach { i ->
                val date = weekStartDate.plusDays(i.toLong())
                val dateStr = date.toString()
                val suivi = service.getSuiviByDate(enfantId, dateStr)
                if (suivi != null) {
                    suivisSemaine[dateStr] = suivi
                }
            }
        } catch (e: Exception) {
            errorMessage = "Erreur chargement semaine: ${e.message}"
        } finally {
            isLoading = false
        }
    }
    
    suspend fun saveDay(dto: CreateSuiviJournalierDto) {
        isLoading = true
        errorMessage = null
        try {
            val saved = service.createOrUpdateSuivi(dto)
            if (saved != null) {
                suivisSemaine[dto.date] = saved
            } else {
                errorMessage = "Échec de la sauvegarde"
            }
        } catch (e: Exception) {
            println("Erreur sauvegarde: ${e.message}")
            errorMessage = "Erreur sauvegarde: ${e.message}"
        } finally {
            isLoading = false
        }
    }
    
    fun previousWeek() {
        currentWeekStart = currentWeekStart.minusWeeks(1)
    }

    fun nextWeek() {
        currentWeekStart = currentWeekStart.plusWeeks(1)
    }
    
    fun clearError() {
        errorMessage = null
    }
}
