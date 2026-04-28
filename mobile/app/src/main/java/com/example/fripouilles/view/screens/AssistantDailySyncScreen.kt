package com.example.fripouilles.view.screens

import android.app.TimePickerDialog
import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fripouilles.controller.SuiviJournalierController
import com.example.fripouilles.model.CreateSuiviJournalierDto
import com.example.fripouilles.model.EnfantInfo
import com.example.fripouilles.model.SuiviJournalierEnfant
import com.example.fripouilles.view.theme.Primary
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.Calendar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AssistantDailySyncScreen(
    controller: SuiviJournalierController,
    onNavigateBack: () -> Unit,
    onNavigateToSuivis: () -> Unit = {},
    onNavigateToAteliers: () -> Unit = {},
    onLogout: () -> Unit = {}
) {
    val scope = rememberCoroutineScope()
    
    LaunchedEffect(Unit) {
        controller.loadEnfants(isAssistant = true)
    }

    LaunchedEffect(controller.selectedEnfantId, controller.currentWeekStart) {
        controller.selectedEnfantId?.let { id ->
            controller.loadSemaine(id, controller.currentWeekStart)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Suivi Journalier", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Primary,
                    titleContentColor = Color.White
                ),
                actions = {
                    IconButton(onClick = onLogout) {
                        Icon(Icons.Default.Logout, contentDescription = "Déconnexion", tint = Color.White)
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Color.White) {
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToSuivis,
                    icon = { Icon(Icons.Default.CheckCircle, contentDescription = null) },
                    label = { Text("Garde", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = true,
                    onClick = {},
                    icon = { Icon(Icons.Default.DateRange, contentDescription = null) },
                    label = { Text("Journalier", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToAteliers,
                    icon = { Icon(Icons.Default.Star, contentDescription = null) },
                    label = { Text("Ateliers", fontSize = 10.sp) }
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF5F5F5))
        ) {
            // Sélecteur d'enfant
            if (controller.enfants.isNotEmpty()) {
                EnfantSelector(
                    enfants = controller.enfants,
                    selectedId = controller.selectedEnfantId,
                    onSelect = { controller.selectedEnfantId = it }
                )
            }

            // Navigation Semaine
            WeekNavigation(
                currentWeekStart = controller.currentWeekStart,
                onPrevious = { controller.previousWeek() },
                onNext = { controller.nextWeek() }
            )

            // Liste des jours
            if (controller.isLoading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Primary)
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(7) { dayIndex ->
                        val date = controller.currentWeekStart.plusDays(dayIndex.toLong())
                        val dateStr = date.toString()
                        val suivi = controller.suivisSemaine[dateStr]
                        
                        DayCard(
                            date = date,
                            suivi = suivi,
                            enfantId = controller.selectedEnfantId ?: 0,
                            onSave = { dto ->
                                scope.launch {
                                    controller.saveDay(dto)
                                }
                            }
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun EnfantSelector(
    enfants: List<EnfantInfo>,
    selectedId: Int?,
    onSelect: (Int) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedEnfant = enfants.find { it.id == selectedId }
    
    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it },
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        OutlinedTextField(
            value = "${selectedEnfant?.prenom ?: ""} ${selectedEnfant?.nom ?: ""}",
            onValueChange = {},
            readOnly = true,
            label = { Text("Enfant") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White
            ),
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
        )
        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            enfants.forEach { enfant ->
                DropdownMenuItem(
                    text = { Text("${enfant.prenom} ${enfant.nom}") },
                    onClick = {
                        onSelect(enfant.id)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Composable
private fun WeekNavigation(
    currentWeekStart: LocalDate,
    onPrevious: () -> Unit,
    onNext: () -> Unit
) {
    val endOfWeek = currentWeekStart.plusDays(6)
    val formatter = DateTimeFormatter.ofPattern("d MMM", Locale.FRENCH)
    
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(
            onClick = onPrevious,
            modifier = Modifier.background(Color.White, CircleShape)
        ) {
            Icon(Icons.Default.ChevronLeft, contentDescription = "Précédent")
        }
        
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(20.dp)
        ) {
            Text(
                "${currentWeekStart.format(formatter)} - ${endOfWeek.format(formatter)}",
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
        }
        
        IconButton(
            onClick = onNext,
            modifier = Modifier.background(Color.White, CircleShape)
        ) {
            Icon(Icons.Default.ChevronRight, contentDescription = "Suivant")
        }
    }
}

@Composable
private fun DayCard(
    date: LocalDate,
    suivi: SuiviJournalierEnfant?,
    enfantId: Int,
    onSave: (CreateSuiviJournalierDto) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    
    // États initiaux basés sur le suivi existant ou vide
    var temperature by remember(suivi) { mutableStateOf(suivi?.temperature?.toString() ?: "") }
    var pleurs by remember(suivi) { mutableStateOf(suivi?.pleurs ?: "") }
    var besoins by remember(suivi) { mutableStateOf(suivi?.besoins ?: "") }
    
    var repasHoraires by remember(suivi) { mutableStateOf(suivi?.repasHoraires ?: "") }
    var repasAliments by remember(suivi) { mutableStateOf(suivi?.repasAliments ?: "") }
    
    var dodoDeb by remember(suivi) { mutableStateOf(suivi?.dodoDeb ?: "") }
    var dodoFin by remember(suivi) { mutableStateOf(suivi?.dodoFin ?: "") }
    
    var humeur by remember(suivi) { mutableStateOf(suivi?.humeur ?: "") }
    
    var activites by remember(suivi) { mutableStateOf(suivi?.activites ?: "") }
    var promHoraires by remember(suivi) { mutableStateOf(suivi?.promenadeHoraires ?: "") }
    
    var remarques by remember(suivi) { mutableStateOf(suivi?.remarques ?: "") }

    val isEmpty = suivi == null

    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { expanded = !expanded }
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        date.format(DateTimeFormatter.ofPattern("EEEE", Locale.FRENCH))
                            .replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() },
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Color.Black
                    )
                    Text(
                        date.format(DateTimeFormatter.ofPattern("d MMMM")),
                        color = Color.Gray,
                        fontSize = 14.sp
                    )
                }
                if (isEmpty) {
                    Text("À remplir", fontSize = 12.sp, color = Primary, fontWeight = FontWeight.Bold)
                } else {
                    Icon(Icons.Default.CheckCircle, contentDescription = "Rempli", tint = Color(0xFF66BB6A))
                }
            }
            
            AnimatedVisibility(visible = expanded) {
                Column(modifier = Modifier.padding(16.dp)) {
                    
                    // --- SANTÉ ---
                    FormSectionTitle(icon = Icons.Default.MedicalServices, title = "Santé") // Fallback icon if MedicalServices missing: Icons.Default.Favorite
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = temperature,
                            onValueChange = { temperature = it },
                            label = { Text("T° (°C)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Primary,
                                focusedLabelColor = Primary
                            )
                        )
                        OutlinedTextField(
                            value = pleurs,
                            onValueChange = { pleurs = it },
                            label = { Text("Pleurs") },
                            modifier = Modifier.weight(2f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Primary,
                                focusedLabelColor = Primary
                            )
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = besoins,
                        onValueChange = { besoins = it },
                        label = { Text("Besoins (Soins, couches...)") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            focusedLabelColor = Primary
                        )
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // --- REPAS ---
                    FormSectionTitle(icon = Icons.Default.Restaurant, title = "Repas") // Fallback: Icons.Default.Check
                    OutlinedTextField(
                        value = repasHoraires,
                        onValueChange = { repasHoraires = it },
                        label = { Text("Horaires (ex: 8h30, 12h, 16h)") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            focusedLabelColor = Primary
                        )
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = repasAliments,
                        onValueChange = { repasAliments = it },
                        label = { Text("Aliments") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            focusedLabelColor = Primary
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // --- SIESTE ---
                    FormSectionTitle(icon = Icons.Default.Hotel, title = "Sieste / Dodo") // Hotel for Bed
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        TimePickerField(
                            label = "Début",
                            value = dodoDeb,
                            onValueChange = { dodoDeb = it },
                            modifier = Modifier.weight(1f)
                        )
                        TimePickerField(
                            label = "Fin",
                            value = dodoFin,
                            onValueChange = { dodoFin = it },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // --- HUMEUR ---
                    FormSectionTitle(icon = Icons.Default.Face, title = "Humeur")
                    MoodSelector(
                        selectedMood = humeur,
                        onMoodSelected = { humeur = if (humeur == it) "" else it }
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // --- ACTIVITES ---
                    FormSectionTitle(icon = Icons.Default.Brush, title = "Activités") // Brush for activities
                    OutlinedTextField(
                        value = activites,
                        onValueChange = { activites = it },
                        label = { Text("Jeux, dessins, éveil...") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            focusedLabelColor = Primary
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // --- PROMENADES ---
                    FormSectionTitle(icon = Icons.Default.DirectionsWalk, title = "Promenades") // DirectionsWalk for Promenades
                    OutlinedTextField(
                        value = promHoraires,
                        onValueChange = { promHoraires = it },
                        label = { Text("Horaires") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            focusedLabelColor = Primary
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // --- REMARQUES ---
                    FormSectionTitle(icon = Icons.Default.Edit, title = "Remarques")
                    OutlinedTextField(
                        value = remarques,
                        onValueChange = { remarques = it },
                        label = { Text("Remarques générales") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            focusedLabelColor = Primary
                        )
                    )
                    
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    Button(
                        onClick = {
                            val dto = CreateSuiviJournalierDto(
                                enfantId = enfantId,
                                date = date.toString(),
                                temperature = temperature.toFloatOrNull(),
                                humeur = humeur,
                                pleurs = pleurs,
                                besoins = besoins,
                                repasHoraires = repasHoraires,
                                repasAliments = repasAliments,
                                dodoDeb = dodoDeb,
                                dodoFin = dodoFin,
                                activites = activites,
                                promenadeHoraires = promHoraires,
                                remarques = remarques
                            )
                            onSave(dto)
                            expanded = false
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Primary)
                    ) {
                        Text("Enregistrer")
                    }
                }
            }
        }
    }
}

@Composable
fun FormSectionTitle(icon: ImageVector, title: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(bottom = 8.dp)
    ) {
        Icon(icon, contentDescription = null, tint = Primary, modifier = Modifier.size(20.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Text(title, fontWeight = FontWeight.Bold, color = Primary)
    }
}


@Composable
fun TimePickerField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val calendar = Calendar.getInstance()
    
    // Parse current value if needed
    if (value.isNotEmpty() && value.contains(":")) {
        try {
            val parts = value.split(":")
            calendar.set(Calendar.HOUR_OF_DAY, parts[0].toInt())
            calendar.set(Calendar.MINUTE, parts[1].toInt())
        } catch (e: Exception) {}
    }

    val timePickerDialog = TimePickerDialog(
        context,
        { _, hour: Int, minute: Int ->
            onValueChange(String.format("%02d:%02d", hour, minute))
        },
        calendar.get(Calendar.HOUR_OF_DAY),
        calendar.get(Calendar.MINUTE),
        true
    )

    // Using Box + TextField disabled to capture clicks reliably
    Box(modifier = modifier.clickable { timePickerDialog.show() }) {
        OutlinedTextField(
            value = value,
            onValueChange = {},
            label = { Text(label) },
            readOnly = true,
            enabled = false, 
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                disabledTextColor = Color.Black,
                disabledBorderColor = Color.Gray,
                disabledLabelColor = Color.Gray,
                disabledTrailingIconColor = Color.Black
            ),
            trailingIcon = { Icon(Icons.Default.AccessTime, contentDescription = null) }
        )
    }
}


@Composable
fun MoodSelector(
    selectedMood: String,
    onMoodSelected: (String) -> Unit
) {
    val moods = listOf(
        "Joyeux" to "😀",
        "Calme" to "😌",
        "Triste" to "😢",
        "Fatigué" to "😴",
        "Excité" to "🤩",
        "Grognon" to "😠"
    )

    Column {
        val rows = moods.chunked(3)
        rows.forEach { rowMoods ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                rowMoods.forEach { (label, emoji) ->
                    val isSelected = selectedMood == label
                    
                    // Card wrapper for click and border
                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onMoodSelected(label) },
                        colors = CardDefaults.cardColors(
                            containerColor = if (isSelected) Primary.copy(alpha = 0.1f) else Color(0xFFFAFAFA)
                        ),
                        border = if (isSelected) BorderStroke(1.dp, Primary) else null
                    ) {
                        Column(
                            modifier = Modifier.padding(8.dp).fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(emoji, fontSize = 24.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                label, 
                                fontSize = 10.sp, 
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) Primary else Color.Gray,
                                maxLines = 1
                            )
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}
