package com.example.fripouilles.controller

import com.example.fripouilles.model.*
import com.example.fripouilles.service.SuiviJournalierService
import kotlinx.coroutines.runBlocking
import org.junit.Assert.*
import org.junit.Test
import java.time.LocalDate

class MockSuiviJournalierService : SuiviJournalierService() {
    var enfantsToReturn = emptyList<EnfantInfo>()
    var getEnfantsAssistantCalled = false
    var getEnfantsParentCalled = false
    
    var suiviToReturn: SuiviJournalierEnfant? = null
    var savedSuivi: SuiviJournalierEnfant? = null
    var shouldSaveFail = false
    
    override suspend fun getEnfantsAssistant(): List<EnfantInfo> {
        getEnfantsAssistantCalled = true
        return enfantsToReturn
    }
    
    override suspend fun getEnfantsParent(): List<EnfantInfo> {
        getEnfantsParentCalled = true
        return enfantsToReturn
    }
    
    override suspend fun getSuiviByDate(enfantId: Int, date: String): SuiviJournalierEnfant? {
        return if (suiviToReturn?.date == date) suiviToReturn else null
    }
    
    override suspend fun createOrUpdateSuivi(dto: CreateSuiviJournalierDto): SuiviJournalierEnfant? {
        if (shouldSaveFail) return null
        
        val s = SuiviJournalierEnfant(
            id = 1,
            enfantId = dto.enfantId,
            date = dto.date,
            temperature = dto.temperature,
            pleurs = dto.pleurs,
            besoins = dto.besoins,
            repasHoraires = dto.repasHoraires,
            repasAliments = dto.repasAliments,
            dodoDeb = dto.dodoDeb,
            dodoFin = dto.dodoFin,
            humeur = dto.humeur,
            activites = dto.activites,
            promenadeHoraires = dto.promenadeHoraires,
            remarques = dto.remarques,
            enfant = null
        )
        savedSuivi = s
        return s
    }
}

class SuiviJournalierControllerTest {
    
    @Test
    fun `loadEnfants calls correct service method for assistant`() = runBlocking {
        val mockService = MockSuiviJournalierService()
        val enfant = EnfantInfo(1, "Leo", "D", null)
        mockService.enfantsToReturn = listOf(enfant)
        
        val controller = SuiviJournalierController(mockService)
        controller.loadEnfants(isAssistant = true)
        
        assertTrue(mockService.getEnfantsAssistantCalled)
        assertFalse(mockService.getEnfantsParentCalled)
        assertEquals(1, controller.enfants.size)
        assertEquals(enfant, controller.enfants[0])
        assertEquals(1, controller.selectedEnfantId)
        assertNull(controller.errorMessage)
    }
    
    @Test
    fun `loadEnfants handles empty list`() = runBlocking {
        val mockService = MockSuiviJournalierService()
        mockService.enfantsToReturn = emptyList()
        
        val controller = SuiviJournalierController(mockService)
        controller.loadEnfants(isAssistant = true)
        
        assertTrue(controller.enfants.isEmpty())
        assertNull(controller.selectedEnfantId)
    }

    @Test
    fun `loadSemaine loads data correctly`() = runBlocking {
        val mockService = MockSuiviJournalierService()
        val date = LocalDate.of(2023, 10, 10)
        val dateStr = date.toString()
        val suivi = SuiviJournalierEnfant(id = 1, enfantId = 1, date = dateStr, temperature = 37.5f)
        mockService.suiviToReturn = suivi
        
        val controller = SuiviJournalierController(mockService)
        controller.loadSemaine(1, date) 
        
        val loaded = controller.suivisSemaine[dateStr]
        assertNotNull(loaded)
        assertEquals(37.5f, loaded?.temperature)
    }

    @Test
    fun `saveDay updates state on success`() = runBlocking {
        val mockService = MockSuiviJournalierService()
        val controller = SuiviJournalierController(mockService)
        val dto = CreateSuiviJournalierDto(enfantId = 1, date = "2023-10-10", temperature = 38.0f)
        
        controller.saveDay(dto)
        
        val saved = controller.suivisSemaine["2023-10-10"]
        assertNotNull(saved)
        assertEquals(38.0f, saved?.temperature)
        assertNull(controller.errorMessage)
    }

    @Test
    fun `saveDay sets error on failure`() = runBlocking {
        val mockService = MockSuiviJournalierService()
        mockService.shouldSaveFail = true
        val controller = SuiviJournalierController(mockService)
        val dto = CreateSuiviJournalierDto(enfantId = 1, date = "2023-10-10")
        
        controller.saveDay(dto)
        
        assertNull(controller.suivisSemaine["2023-10-10"])
        assertNotNull(controller.errorMessage)
        assertEquals("Échec de la sauvegarde", controller.errorMessage)
    }
}
