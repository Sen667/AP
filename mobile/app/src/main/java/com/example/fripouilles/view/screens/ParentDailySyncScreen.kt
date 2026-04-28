package com.example.fripouilles.view.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fripouilles.controller.SuiviJournalierController
import com.example.fripouilles.model.EnfantInfo
import com.example.fripouilles.model.SuiviJournalierEnfant
import com.example.fripouilles.view.theme.Primary
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ParentDailySyncScreen(
    controller: SuiviJournalierController,
    onNavigateBack: () -> Unit,
    onNavigateToSuivis: () -> Unit = {},
    onNavigateToAteliers: () -> Unit = {},
    onLogout: () -> Unit = {}
) {
    val scope = rememberCoroutineScope()
    
    // Charger les enfants du PARENT
    LaunchedEffect(Unit) {
        controller.loadEnfants(isAssistant = false)
    }

    LaunchedEffect(controller.selectedEnfantId, controller.currentWeekStart) {
        controller.selectedEnfantId?.let { id ->
            controller.loadSemaine(id, controller.currentWeekStart)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Carnet de Liaison", fontWeight = FontWeight.Bold) },
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
                        
                        DayCardReadOnly(
                            date = date,
                            suivi = suivi
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
private fun DayCardReadOnly(
    date: LocalDate,
    suivi: SuiviJournalierEnfant?
) {
    var expanded by remember { mutableStateOf(false) }
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
                    Text("Pas de données", fontSize = 12.sp, color = Color.Gray)
                } else {
                    Icon(Icons.Default.Info, contentDescription = "Voir", tint = Primary)
                }
            }
            
            AnimatedVisibility(visible = expanded && !isEmpty) {
                suivi?.let { data ->
                    Column(modifier = Modifier.padding(16.dp)) {
                        
                        // SANTE
                        if (data.temperature != null || !data.pleurs.isNullOrEmpty() || !data.besoins.isNullOrEmpty()) {
                            SectionTitle(icon = Icons.Default.MedicalServices, title = "Santé")
                            data.temperature?.let { InfoItem("Température", "$it °C") }
                            data.pleurs?.let { InfoItem("Pleurs", it) }
                            data.besoins?.let { InfoItem("Besoins", it) }
                            Spacer(modifier = Modifier.height(16.dp))
                        }

                        // REPAS
                        if (!data.repasHoraires.isNullOrEmpty() || !data.repasAliments.isNullOrEmpty()) {
                            SectionTitle(icon = Icons.Default.Restaurant, title = "Repas")
                            data.repasHoraires?.let { InfoItem("Horaires", it) }
                            data.repasAliments?.let { InfoItem("Aliments", it) }
                            Spacer(modifier = Modifier.height(16.dp))
                        }
                        
                        // DODO
                        if (!data.dodoDeb.isNullOrEmpty() || !data.dodoFin.isNullOrEmpty()) {
                            SectionTitle(icon = Icons.Default.Hotel, title = "Sieste / Dodo")
                            Row {
                                data.dodoDeb?.let { InfoItem("Début", it, Modifier.weight(1f)) }
                                data.dodoFin?.let { InfoItem("Fin", it, Modifier.weight(1f)) }
                            }
                            Spacer(modifier = Modifier.height(16.dp))
                        }

                        // HUMEUR
                        if (!data.humeur.isNullOrEmpty()) {
                             SectionTitle(icon = Icons.Default.Face, title = "Humeur")
                             MoodDisplay(data.humeur)
                             Spacer(modifier = Modifier.height(16.dp))
                        }

                        // ACTIVITES
                        if (!data.activites.isNullOrEmpty()) {
                            SectionTitle(icon = Icons.Default.Brush, title = "Activités")
                            Text(data.activites, fontSize = 14.sp)
                            Spacer(modifier = Modifier.height(16.dp))
                        }

                        // PROMENADES
                        if (!data.promenadeHoraires.isNullOrEmpty()) {
                            SectionTitle(icon = Icons.Default.DirectionsWalk, title = "Promenades")
                            InfoItem("Horaires", data.promenadeHoraires)
                            Spacer(modifier = Modifier.height(16.dp))
                        }

                        // REMARQUES
                         if (!data.remarques.isNullOrEmpty()) {
                            SectionTitle(icon = Icons.Default.Edit, title = "Remarques")
                            Text(data.remarques, fontSize = 14.sp)
                        }
                    }
                }
            }
            if (expanded && isEmpty) {
                 Column(modifier = Modifier.padding(16.dp)) {
                     Text("Aucune information saisie pour ce jour.", color = Color.Gray, fontStyle = androidx.compose.ui.text.font.FontStyle.Italic)
                 }
            }
        }
    }
}

@Composable
fun SectionTitle(icon: ImageVector, title: String) {
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
fun InfoItem(label: String, value: String, modifier: Modifier = Modifier) {
    if (value.isNotEmpty()) {
        Column(modifier = modifier.padding(bottom = 8.dp)) {
            Text(label, fontSize = 12.sp, color = Color.Gray)
            Text(value, fontSize = 14.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun MoodDisplay(moodLabel: String) {
    val moodEmoji = when(moodLabel) {
        "Joyeux" -> "😀"
        "Calme" -> "😌"
        "Triste" -> "😢"
        "Fatigué" -> "😴"
        "Excité" -> "🤩"
        "Grognon" -> "😠"
        else -> "😐"
    }
    
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .background(Primary.copy(alpha = 0.1f), RoundedCornerShape(8.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Text(moodEmoji, fontSize = 24.sp)
        Spacer(modifier = Modifier.width(8.dp))
        Text(moodLabel, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Primary)
    }
}
