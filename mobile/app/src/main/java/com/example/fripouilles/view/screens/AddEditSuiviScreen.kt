package com.example.fripouilles.view.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fripouilles.controller.SuiviGardeController
import com.example.fripouilles.model.ContratGarde
import com.example.fripouilles.model.StatutValidation
import com.example.fripouilles.view.theme.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditSuiviScreen(
    controller: SuiviGardeController,
    suiviId: Int?,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scope = rememberCoroutineScope()
    val scrollState = rememberScrollState()

    val isEditMode = suiviId != null
    val currentSuivi = if (isEditMode) controller.suivis.find { it.id?.equals(suiviId) == true } else null

    // Rediriger si le suivi n'est pas en attente (validé ou refusé)
    if (isEditMode && currentSuivi != null && currentSuivi.statut != StatutValidation.EN_ATTENTE) {
        LaunchedEffect(Unit) {
            onNavigateBack()
        }
    }

    var selectedContrat by remember { mutableStateOf<ContratGarde?>(currentSuivi?.contrat) }
    var date by remember { mutableStateOf(currentSuivi?.date?.take(10) ?: LocalDate.now().toString()) }
    var heureArrivee by remember { mutableStateOf(currentSuivi?.arriveeMinutes?.let { formatMinutes(it) } ?: "") }
    var heureDepart by remember { mutableStateOf(currentSuivi?.departMinutes?.let { formatMinutes(it) } ?: "") }
    var repasFournis by remember { mutableStateOf(currentSuivi?.repasFournis?.toString() ?: "0") }
    var fraisDivers by remember { mutableStateOf(currentSuivi?.fraisDivers ?: "") }
    var km by remember { mutableStateOf(currentSuivi?.km ?: "") }

    var showContratPicker by remember { mutableStateOf(false) }
    var showDatePicker by remember { mutableStateOf(false) }
    var showTimePicker by remember { mutableStateOf(false) }
    var timePickerType by remember { mutableStateOf<TimePickerType>(TimePickerType.ARRIVEE) }

    LaunchedEffect(Unit) {
        if (!isEditMode) {
            controller.loadContratsAssistant()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (isEditMode) "Modifier le suivi" else "Nouveau suivi") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Retour", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Primary,
                    titleContentColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF5F5F5))
                .verticalScroll(scrollState)
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Contrat (uniquement en création)
                    if (!isEditMode) {
                        Text(
                            "Contrat *",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.Gray
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { showContratPicker = true }
                        ) {
                            OutlinedTextField(
                                value = selectedContrat?.enfant?.let { "${it.prenom} ${it.nom}" } ?: "Sélectionner un contrat",
                                onValueChange = {},
                                readOnly = true,
                                enabled = false,
                                trailingIcon = {
                                    Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                                },
                                modifier = Modifier.fillMaxWidth(),
                                colors = OutlinedTextFieldDefaults.colors(
                                    disabledBorderColor = Color.Gray,
                                    disabledTextColor = Color.Black,
                                    disabledTrailingIconColor = Color.Gray,
                                    disabledPlaceholderColor = Color.Gray
                                )
                            )
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                    } else {
                        selectedContrat?.enfant?.let { enfant ->
                            Text(
                                "Enfant",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color.Gray
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "${enfant.prenom} ${enfant.nom}",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                        }
                    }

                    // Date
                    Text(
                        "Date *",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable(
                                enabled = !isEditMode || currentSuivi?.statut?.name == "EN_ATTENTE"
                            ) { showDatePicker = true }
                    ) {
                        OutlinedTextField(
                            value = formatDateDisplay(date),
                            onValueChange = {},
                            readOnly = true,
                            enabled = false,
                            trailingIcon = {
                                Icon(Icons.Default.CalendarToday, contentDescription = null)
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                disabledBorderColor = Color.Gray,
                                disabledTextColor = Color.Black,
                                disabledTrailingIconColor = Color.Gray
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Heures
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                "Heure d'arrivée",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color.Gray
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        timePickerType = TimePickerType.ARRIVEE
                                        showTimePicker = true
                                    }
                            ) {
                                OutlinedTextField(
                                    value = heureArrivee,
                                    onValueChange = {},
                                    readOnly = true,
                                    enabled = false,
                                    placeholder = { Text("--:--") },
                                    trailingIcon = {
                                        Icon(Icons.Default.AccessTime, contentDescription = null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        disabledBorderColor = Color.Gray,
                                        disabledTextColor = Color.Black,
                                        disabledTrailingIconColor = Color.Gray,
                                        disabledPlaceholderColor = Color.Gray
                                    )
                                )
                            }
                        }

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                "Heure de départ",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color.Gray
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        timePickerType = TimePickerType.DEPART
                                        showTimePicker = true
                                    }
                            ) {
                                OutlinedTextField(
                                    value = heureDepart,
                                    onValueChange = {},
                                    readOnly = true,
                                    enabled = false,
                                    placeholder = { Text("--:--") },
                                    trailingIcon = {
                                        Icon(Icons.Default.AccessTime, contentDescription = null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        disabledBorderColor = Color.Gray,
                                        disabledTextColor = Color.Black,
                                        disabledTrailingIconColor = Color.Gray,
                                        disabledPlaceholderColor = Color.Gray
                                    )
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Repas
                    Text(
                        "Nombre de repas *",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = repasFournis,
                        onValueChange = { repasFournis = it.filter { char -> char.isDigit() } },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            unfocusedBorderColor = Color.Gray
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Frais divers
                    Text(
                        "Frais divers (€)",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = fraisDivers,
                        onValueChange = { fraisDivers = it },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            unfocusedBorderColor = Color.Gray
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Kilomètres
                    Text(
                        "Kilomètres parcourus",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = km,
                        onValueChange = { km = it },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            unfocusedBorderColor = Color.Gray
                        )
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    // Bouton
                    Button(
                        onClick = {
                            scope.launch {
                                val success = if (isEditMode) {
                                    controller.updateSuivi(
                                        id = suiviId!!,
                                        arriveeMinutes = parseTimeToMinutes(heureArrivee),
                                        departMinutes = parseTimeToMinutes(heureDepart),
                                        repasFournis = repasFournis.toIntOrNull(),
                                        fraisDivers = fraisDivers.toDoubleOrNull(),
                                        km = km.toDoubleOrNull()
                                    )
                                } else {
                                    controller.createSuivi(
                                        contratId = selectedContrat!!.id,
                                        date = date,
                                        arriveeMinutes = parseTimeToMinutes(heureArrivee),
                                        departMinutes = parseTimeToMinutes(heureDepart),
                                        repasFournis = repasFournis.toIntOrNull() ?: 0,
                                        fraisDivers = fraisDivers.toDoubleOrNull(),
                                        km = km.toDoubleOrNull()
                                    )
                                }
                                if (success) {
                                    onNavigateBack()
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Primary),
                        enabled = !controller.isLoading && (!isEditMode || selectedContrat != null)
                    ) {
                        if (controller.isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text(if (isEditMode) "Enregistrer" else "Créer le suivi")
                        }
                    }

                    controller.errorMessage?.let { error ->
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = error,
                            fontSize = 12.sp,
                            color = Color.Red
                        )
                    }
                }
            }
        }
    }

    // Dialog contrats
    if (showContratPicker) {
        AlertDialog(
            onDismissRequest = { showContratPicker = false },
            title = { Text("Sélectionner un contrat") },
            text = {
                Column {
                    controller.contrats.forEach { contrat ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clickable {
                                    selectedContrat = contrat
                                    showContratPicker = false
                                },
                            colors = CardDefaults.cardColors(
                                containerColor = if (selectedContrat?.id == contrat.id) Primary.copy(alpha = 0.1f) else Color.White
                            )
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                contrat.enfant?.let {
                                    Text(
                                        "${it.prenom} ${it.nom}",
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        "Né(e) le ${formatDateDisplay(it.dateNaissance)}",
                                        fontSize = 12.sp,
                                        color = Color.Gray
                                    )
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showContratPicker = false }) {
                    Text("Fermer")
                }
            }
        )
    }

    // Time picker
    if (showTimePicker) {
        TimePickerDialog(
            onDismiss = { showTimePicker = false },
            onConfirm = { time ->
                when (timePickerType) {
                    TimePickerType.ARRIVEE -> heureArrivee = time
                    TimePickerType.DEPART -> heureDepart = time
                }
                showTimePicker = false
            },
            initialTime = when (timePickerType) {
                TimePickerType.ARRIVEE -> heureArrivee
                TimePickerType.DEPART -> heureDepart
            }
        )
    }
}

enum class TimePickerType {
    ARRIVEE, DEPART
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TimePickerDialog(
    onDismiss: () -> Unit,
    onConfirm: (String) -> Unit,
    initialTime: String
) {
    val timePickerState = rememberTimePickerState(
        initialHour = initialTime.takeIf { it.isNotEmpty() }?.split(":")?.get(0)?.toIntOrNull() ?: 8,
        initialMinute = initialTime.takeIf { it.isNotEmpty() }?.split(":")?.get(1)?.toIntOrNull() ?: 0
    )

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            TextButton(
                onClick = {
                    val time = String.format("%02d:%02d", timePickerState.hour, timePickerState.minute)
                    onConfirm(time)
                }
            ) {
                Text("OK")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Annuler")
            }
        },
        text = {
            TimePicker(state = timePickerState)
        }
    )
}

private fun formatDateDisplay(dateString: String?): String {
    return try {
        if (dateString == null || dateString.isEmpty()) return ""
        val date = LocalDate.parse(dateString.take(10))
        date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
    } catch (e: Exception) {
        dateString ?: ""
    }
}

private fun formatMinutes(minutes: Int): String {
    val hours = minutes / 60
    val mins = minutes % 60
    return String.format("%02d:%02d", hours, mins)
}

private fun parseTimeToMinutes(time: String): Int? {
    return try {
        if (time.isEmpty()) return null
        val parts = time.split(":")
        val hours = parts[0].toInt()
        val minutes = parts[1].toInt()
        hours * 60 + minutes
    } catch (e: Exception) {
        null
    }
}
