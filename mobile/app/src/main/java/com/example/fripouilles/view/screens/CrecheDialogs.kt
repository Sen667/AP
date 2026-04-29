package com.example.fripouilles.view.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.fripouilles.model.*
import com.example.fripouilles.service.CrecheService
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignalerAbsenceDialog(
    inscription: InscriptionCreche,
    onDismiss: () -> Unit,
    onSuccess: () -> Unit
) {
    var dateDebut by remember { mutableStateOf("") }
    var dateFin by remember { mutableStateOf("") }
    var motif by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    val enfantNom = inscription.enfant?.let { "${it.prenom} ${it.nom}" } ?: "Enfant #${inscription.enfantId}"

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Signaler une absence") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer
                    )
                ) {
                    Text(
                        "Inscription régulière — $enfantNom",
                        modifier = Modifier.padding(12.dp),
                        style = MaterialTheme.typography.bodySmall
                    )
                }

                OutlinedTextField(
                    value = dateDebut,
                    onValueChange = { dateDebut = it },
                    label = { Text("Date de début (YYYY-MM-DD)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = { Text("2026-05-05") }
                )

                OutlinedTextField(
                    value = dateFin,
                    onValueChange = { dateFin = it },
                    label = { Text("Date de fin (YYYY-MM-DD)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = { Text("2026-05-09") }
                )

                OutlinedTextField(
                    value = motif,
                    onValueChange = { motif = it },
                    label = { Text("Motif (optionnel)") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 3,
                    placeholder = { Text("Maladie, vacances…") }
                )

                if (errorMessage != null) {
                    Text(
                        text = errorMessage ?: "",
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    scope.launch {
                        if (dateDebut.isEmpty() || dateFin.isEmpty()) {
                            errorMessage = "Les dates de début et de fin sont obligatoires"
                            return@launch
                        }
                        isLoading = true
                        errorMessage = null
                        try {
                            CrecheService.createAbsence(
                                CreateAbsenceRequest(
                                    inscriptionId = inscription.id,
                                    dateDebut = dateDebut,
                                    dateFin = dateFin,
                                    motif = motif.ifBlank { null }
                                )
                            )
                            onSuccess()
                        } catch (e: Exception) {
                            errorMessage = "Erreur: ${e.message}"
                        } finally {
                            isLoading = false
                        }
                    }
                },
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                } else {
                    Text("Confirmer")
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss, enabled = !isLoading) { Text("Annuler") }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddInscriptionDialog(
    parentId: Int,
    onDismiss: () -> Unit,
    onSuccess: () -> Unit
) {
    var enfants by remember { mutableStateOf<List<EnfantInfo>>(emptyList()) }
    var selectedEnfant by remember { mutableStateOf<EnfantInfo?>(null) }
    var expandedEnfant by remember { mutableStateOf(false) }
    var typeAccueil by remember { mutableStateOf(TypeAccueilCreche.REGULIER) }
    var dateDebut by remember { mutableStateOf("") }
    var dateFin by remember { mutableStateOf("") }
    var selectedJours by remember { mutableStateOf(setOf<JourSemaine>()) }
    var isLoading by remember { mutableStateOf(false) }
    var isLoadingEnfants by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    // Charger la liste des enfants au démarrage
    LaunchedEffect(Unit) {
        try {
            enfants = CrecheService.getEnfantsParent()
            if (enfants.isNotEmpty()) {
                selectedEnfant = enfants.first()
            }
        } catch (e: Exception) {
            errorMessage = "Erreur chargement enfants: ${e.message}"
        } finally {
            isLoadingEnfants = false
        }
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Nouvelle Inscription") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Dropdown pour sélectionner l'enfant
                if (isLoadingEnfants) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
                } else {
                    ExposedDropdownMenuBox(
                        expanded = expandedEnfant,
                        onExpandedChange = { expandedEnfant = it }
                    ) {
                        OutlinedTextField(
                            value = selectedEnfant?.let { "${it.prenom} ${it.nom}" } ?: "",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("ID Enfant") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedEnfant) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor(),
                            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
                        )
                        ExposedDropdownMenu(
                            expanded = expandedEnfant,
                            onDismissRequest = { expandedEnfant = false }
                        ) {
                            enfants.forEach { enfant ->
                                DropdownMenuItem(
                                    text = { Text("${enfant.prenom} ${enfant.nom}") },
                                    onClick = {
                                        selectedEnfant = enfant
                                        expandedEnfant = false
                                    }
                                )
                            }
                        }
                    }
                }

                // Type d'accueil
                Text("Type d'accueil:", style = MaterialTheme.typography.bodyMedium)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TypeAccueilCreche.values().forEach { type ->
                        FilterChip(
                            selected = typeAccueil == type,
                            onClick = { typeAccueil = type },
                            label = { Text(type.name) }
                        )
                    }
                }

                // Date de début
                OutlinedTextField(
                    value = dateDebut,
                    onValueChange = { dateDebut = it },
                    label = { Text("Date Début (YYYY-MM-DD)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = { Text("2026-03-15") }
                )

                // Date de fin (optionnelle)
                OutlinedTextField(
                    value = dateFin,
                    onValueChange = { dateFin = it },
                    label = { Text("Date Fin (optionnelle)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = { Text("2026-06-30") }
                )

                // Jours de la semaine (pour inscription régulière)
                if (typeAccueil == TypeAccueilCreche.REGULIER) {
                    Text("Jours de présence:", style = MaterialTheme.typography.bodyMedium)
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        JourSemaine.values().forEach { jour ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .selectable(
                                        selected = selectedJours.contains(jour),
                                        onClick = {
                                            selectedJours = if (selectedJours.contains(jour)) {
                                                selectedJours - jour
                                            } else {
                                                selectedJours + jour
                                            }
                                        }
                                    )
                                    .padding(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Checkbox(
                                    checked = selectedJours.contains(jour),
                                    onCheckedChange = null
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(jour.name)
                            }
                        }
                    }
                }

                // Message d'erreur
                if (errorMessage != null) {
                    Text(
                        text = errorMessage ?: "",
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    scope.launch {
                        if (selectedEnfant == null || dateDebut.isEmpty()) {
                            errorMessage = "Veuillez remplir tous les champs obligatoires"
                            return@launch
                        }

                        if (typeAccueil == TypeAccueilCreche.REGULIER && selectedJours.isEmpty()) {
                            errorMessage = "Sélectionnez au moins un jour pour l'inscription régulière"
                            return@launch
                        }

                        isLoading = true
                        errorMessage = null

                        try {
                            val request = CreateInscriptionRequest(
                                enfantId = selectedEnfant!!.id,
                                parentId = parentId,
                                typeAccueil = typeAccueil,
                                dateDebut = dateDebut,
                                dateFin = if (dateFin.isNotEmpty()) dateFin else null,
                                jours = if (typeAccueil == TypeAccueilCreche.REGULIER) 
                                    selectedJours.toList() else null
                            )

                            CrecheService.createInscription(request)
                            onSuccess()
                        } catch (e: Exception) {
                            errorMessage = "Erreur: ${e.message}"
                        } finally {
                            isLoading = false
                        }
                    }
                },
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("Créer")
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss, enabled = !isLoading) {
                Text("Annuler")
            }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddReservationDialog(
    parentId: Int,
    onDismiss: () -> Unit,
    onSuccess: () -> Unit
) {
    var enfants by remember { mutableStateOf<List<EnfantInfo>>(emptyList()) }
    var selectedEnfant by remember { mutableStateOf<EnfantInfo?>(null) }
    var expandedEnfant by remember { mutableStateOf(false) }
    var date by remember { mutableStateOf("") }
    var heureArrivee by remember { mutableStateOf("08:00") }
    var heureDepart by remember { mutableStateOf("17:00") }
    var montant by remember { mutableStateOf("0.0") }
    var placesDisponibles by remember { mutableStateOf<Int?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var isLoadingEnfants by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    // Charger la liste des enfants au démarrage
    LaunchedEffect(Unit) {
        try {
            enfants = CrecheService.getEnfantsParent()
            if (enfants.isNotEmpty()) {
                selectedEnfant = enfants.first()
            }
        } catch (e: Exception) {
            errorMessage = "Erreur chargement enfants: ${e.message}"
        } finally {
            isLoadingEnfants = false
        }
    }

    fun checkDisponibilite() {
        if (date.isNotEmpty()) {
            scope.launch {
                try {
                    val response = CrecheService.checkDisponibilite(date)
                    placesDisponibles = response.places
                    if (response.places == 0) {
                        errorMessage = "Aucune place disponible pour cette date"
                    } else {
                        errorMessage = null
                    }
                } catch (e: Exception) {
                    errorMessage = "Impossible de vérifier la disponibilité"
                    placesDisponibles = null
                }
            }
        }
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Nouvelle Réservation") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Info importante
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer
                    )
                ) {
                    Text(
                        "⚠️ La réservation doit être effectuée au moins 24h à l'avance",
                        modifier = Modifier.padding(12.dp),
                        style = MaterialTheme.typography.bodySmall
                    )
                }

                // Dropdown pour sélectionner l'enfant
                if (isLoadingEnfants) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
                } else {
                    ExposedDropdownMenuBox(
                        expanded = expandedEnfant,
                        onExpandedChange = { expandedEnfant = it }
                    ) {
                        OutlinedTextField(
                            value = selectedEnfant?.let { "${it.prenom} ${it.nom}" } ?: "",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Sélectionner l'enfant") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedEnfant) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor(),
                            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
                        )
                        ExposedDropdownMenu(
                            expanded = expandedEnfant,
                            onDismissRequest = { expandedEnfant = false }
                        ) {
                            enfants.forEach { enfant ->
                                DropdownMenuItem(
                                    text = { Text("${enfant.prenom} ${enfant.nom}") },
                                    onClick = {
                                        selectedEnfant = enfant
                                        expandedEnfant = false
                                    }
                                )
                            }
                        }
                    }
                }

                // Date
                OutlinedTextField(
                    value = date,
                    onValueChange = {
                        date = it
                        placesDisponibles = null
                    },
                    label = { Text("Date (YYYY-MM-DD)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = { Text("2026-03-20") }
                )

                // Bouton vérifier disponibilité
                Button(
                    onClick = { checkDisponibilite() },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = date.isNotEmpty()
                ) {
                    Text("Vérifier la disponibilité")
                }

                // Afficher les places disponibles
                placesDisponibles?.let { places ->
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (places > 0) 
                                MaterialTheme.colorScheme.primaryContainer 
                            else 
                                MaterialTheme.colorScheme.errorContainer
                        )
                    ) {
                        Text(
                            if (places > 0) 
                                "✓ $places place(s) disponible(s)" 
                            else 
                                "✗ Aucune place disponible",
                            modifier = Modifier.padding(12.dp),
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }

                // Heure d'arrivée
                OutlinedTextField(
                    value = heureArrivee,
                    onValueChange = { heureArrivee = it },
                    label = { Text("Heure d'arrivée (HH:MM)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = { Text("08:00") }
                )

                // Heure de départ
                OutlinedTextField(
                    value = heureDepart,
                    onValueChange = { heureDepart = it },
                    label = { Text("Heure de départ (HH:MM)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    placeholder = { Text("17:00") }
                )

                // Montant
                OutlinedTextField(
                    value = montant,
                    onValueChange = { montant = it },
                    label = { Text("Montant (€)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                // Message d'erreur
                if (errorMessage != null) {
                    Text(
                        text = errorMessage ?: "",
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    scope.launch {
                        if (selectedEnfant == null || date.isEmpty() || heureArrivee.isEmpty() || heureDepart.isEmpty()) {
                            errorMessage = "Veuillez remplir tous les champs"
                            return@launch
                        }

                        if (placesDisponibles == null) {
                            errorMessage = "Veuillez vérifier la disponibilité d'abord"
                            return@launch
                        }

                        if (placesDisponibles == 0) {
                            errorMessage = "Aucune place disponible"
                            return@launch
                        }

                        isLoading = true
                        errorMessage = null

                        try {
                            // Convertir heures en minutes
                            val arriveeMinutes = heureArrivee.split(":").let { 
                                it[0].toInt() * 60 + it[1].toInt() 
                            }
                            val departMinutes = heureDepart.split(":").let { 
                                it[0].toInt() * 60 + it[1].toInt() 
                            }

                            val request = CreateReservationRequest(
                                enfantId = selectedEnfant!!.id,
                                parentId = parentId,
                                date = date,
                                arriveeMinutes = arriveeMinutes,
                                departMinutes = departMinutes,
                                montant = montant.toDouble()
                            )

                            CrecheService.createReservation(request)
                            onSuccess()
                        } catch (e: Exception) {
                            errorMessage = "Erreur: ${e.message}"
                        } finally {
                            isLoading = false
                        }
                    }
                },
                enabled = !isLoading && placesDisponibles != null && placesDisponibles!! > 0
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("Réserver")
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss, enabled = !isLoading) {
                Text("Annuler")
            }
        }
    )
}
