package com.example.fripouilles.view.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fripouilles.controller.SuiviGardeController
import com.example.fripouilles.model.*
import com.example.fripouilles.view.theme.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable

fun AssistantSuivisScreen(
    controller: SuiviGardeController,
    onNavigateToAddEdit: (Int?) -> Unit,
    onNavigateToAteliers: () -> Unit = {},
    onNavigateToDaily: () -> Unit,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scope = rememberCoroutineScope()
    var showFilters by remember { mutableStateOf(false) }
    var selectedMois by remember { mutableStateOf<Int?>(null) }
    var selectedAnnee by remember { mutableStateOf<Int?>(LocalDate.now().year) }
    var selectedStatut by remember { mutableStateOf<StatutValidation?>(null) }
    var selectedContratId by remember { mutableStateOf<Int?>(null) }

    LaunchedEffect(Unit) {
        controller.loadContratsAssistant()
        controller.loadSuivisAssistant(selectedMois, selectedAnnee, selectedStatut, selectedContratId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mes suivis de garde", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Primary,
                    titleContentColor = Color.White
                ),
                actions = {
                    IconButton(onClick = { showFilters = !showFilters }) {
                        Icon(Icons.Default.FilterList, contentDescription = "Filtres", tint = Color.White)
                    }
                    IconButton(onClick = onLogout) {
                        Icon(Icons.Default.Logout, contentDescription = "Déconnexion", tint = Color.White)
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { onNavigateToAddEdit(null) },
                containerColor = Primary,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Ajouter un suivi")
            }
        },
        bottomBar = {
            NavigationBar(containerColor = Color.White) {
                NavigationBarItem(
                    selected = true,
                    onClick = {},
                    icon = { Icon(Icons.Default.CheckCircle, contentDescription = null) },
                    label = { Text("Garde", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToDaily,
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
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF5F5F5))
        ) {
            if (showFilters) {
                FilterSection(
                    selectedMois = selectedMois,
                    selectedAnnee = selectedAnnee,
                    selectedStatut = selectedStatut,
                    selectedContratId = selectedContratId,
                    contrats = controller.contrats,
                    onMoisChange = { selectedMois = it },
                    onAnneeChange = { selectedAnnee = it },
                    onStatutChange = { selectedStatut = it },
                    onContratChange = { selectedContratId = it },
                    onApplyFilters = {
                        scope.launch {
                            controller.loadSuivisAssistant(selectedMois, selectedAnnee, selectedStatut, selectedContratId)
                            showFilters = false
                        }
                    },
                    onResetFilters = {
                        selectedMois = null
                        selectedAnnee = LocalDate.now().year
                        selectedStatut = null
                        selectedContratId = null
                        scope.launch {
                            controller.loadSuivisAssistant(null, selectedAnnee, null, null)
                            showFilters = false
                        }
                    }
                )
            }

            controller.errorMessage?.let { error ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEE2E2))
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Error,
                            contentDescription = null,
                            tint = Color.Red,
                            modifier = Modifier.padding(end = 8.dp)
                        )
                        Text(error, fontSize = 12.sp, color = Color.Red)
                    }
                }
            }

            if (controller.isLoading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = Primary)
                }
            } else if (controller.suivis.isEmpty()) {
                EmptyState()
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(controller.suivis) { suivi ->
                        val id = suivi.id ?: return@items
                        SuiviCard(
                            suivi = suivi,
                            onEdit = { onNavigateToAddEdit(id) },
                            onDelete = {
                                scope.launch {
                                    controller.deleteSuivi(id)
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
private fun FilterSection(
    selectedMois: Int?,
    selectedAnnee: Int?,
    selectedStatut: StatutValidation?,
    selectedContratId: Int?,
    contrats: List<ContratGarde>,
    onMoisChange: (Int?) -> Unit,
    onAnneeChange: (Int?) -> Unit,
    onStatutChange: (StatutValidation?) -> Unit,
    onContratChange: (Int?) -> Unit,
    onApplyFilters: () -> Unit,
    onResetFilters: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Filtres", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(12.dp))

            // Filtre mois
            var expandedMois by remember { mutableStateOf(false) }
            ExposedDropdownMenuBox(
                expanded = expandedMois,
                onExpandedChange = { expandedMois = it }
            ) {
                OutlinedTextField(
                    value = selectedMois?.let { getMoisName(it) } ?: "Tous les mois",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Mois") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedMois) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = expandedMois,
                    onDismissRequest = { expandedMois = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Tous les mois") },
                        onClick = {
                            onMoisChange(null)
                            expandedMois = false
                        }
                    )
                    (1..12).forEach { mois ->
                        DropdownMenuItem(
                            text = { Text(getMoisName(mois)) },
                            onClick = {
                                onMoisChange(mois)
                                expandedMois = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Filtre statut
            var expandedStatut by remember { mutableStateOf(false) }
            val statutLabel = when (selectedStatut) {
                StatutValidation.EN_ATTENTE -> "En attente"
                StatutValidation.VALIDE -> "Validé"
                StatutValidation.REFUSE -> "Refusé"
                null -> "Tous les statuts"
            }
            ExposedDropdownMenuBox(
                expanded = expandedStatut,
                onExpandedChange = { expandedStatut = it }
            ) {
                OutlinedTextField(
                    value = statutLabel,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Statut") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedStatut) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = expandedStatut,
                    onDismissRequest = { expandedStatut = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Tous les statuts") },
                        onClick = { onStatutChange(null); expandedStatut = false }
                    )
                    DropdownMenuItem(
                        text = { Text("En attente") },
                        onClick = { onStatutChange(StatutValidation.EN_ATTENTE); expandedStatut = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Validé") },
                        onClick = { onStatutChange(StatutValidation.VALIDE); expandedStatut = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Refusé") },
                        onClick = { onStatutChange(StatutValidation.REFUSE); expandedStatut = false }
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Filtre année
            var expandedAnnee by remember { mutableStateOf(false) }
            ExposedDropdownMenuBox(
                expanded = expandedAnnee,
                onExpandedChange = { expandedAnnee = it }
            ) {
                OutlinedTextField(
                    value = selectedAnnee?.toString() ?: "",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Année") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedAnnee) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = expandedAnnee,
                    onDismissRequest = { expandedAnnee = false }
                ) {
                    val currentYear = LocalDate.now().year
                    (currentYear downTo currentYear - 2).forEach { annee ->
                        DropdownMenuItem(
                            text = { Text(annee.toString()) },
                            onClick = {
                                onAnneeChange(annee)
                                expandedAnnee = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Filtre enfant/contrat
            var expandedContrat by remember { mutableStateOf(false) }
            ExposedDropdownMenuBox(
                expanded = expandedContrat,
                onExpandedChange = { expandedContrat = it }
            ) {
                OutlinedTextField(
                    value = contrats.find { it.id == selectedContratId }?.enfant?.let { "${it.prenom} ${it.nom}" } ?: "Tous les enfants",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Enfant") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedContrat) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = expandedContrat,
                    onDismissRequest = { expandedContrat = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Tous les enfants") },
                        onClick = { onContratChange(null); expandedContrat = false }
                    )
                    contrats.forEach { contrat ->
                        contrat.enfant?.let { enfant ->
                            DropdownMenuItem(
                                text = { Text("${enfant.prenom} ${enfant.nom}") },
                                onClick = {
                                    onContratChange(contrat.id)
                                    expandedContrat = false
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = onResetFilters,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Réinitialiser")
                }
                Button(
                    onClick = onApplyFilters,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = Primary)
                ) {
                    Text("Appliquer")
                }
            }
        }
    }
}

@Composable
private fun SuiviCard(
    suivi: SuiviGarde,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    var showDeleteDialog by remember { mutableStateOf(false) }
    val canEdit = suivi.statut == StatutValidation.EN_ATTENTE

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = canEdit, onClick = onEdit),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = suivi.date?.let { formatDate(it) } ?: "Date inconnue",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                    if (suivi.contrat?.enfant != null) {
                        Text(
                            text = "${suivi.contrat.enfant.prenom} ${suivi.contrat.enfant.nom}",
                            fontSize = 14.sp,
                            color = Color.Gray,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }

                Row {
                    suivi.statut?.let {
                        StatutBadge(it)
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                    if (suivi.statut == StatutValidation.EN_ATTENTE) {
                        IconButton(
                            onClick = { showDeleteDialog = true },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                Icons.Default.Delete,
                                contentDescription = "Supprimer",
                                tint = Color.Red,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Divider(color = Color.LightGray.copy(alpha = 0.5f))

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    InfoRow(
                        icon = Icons.Default.AccessTime,
                        label = "Arrivée",
                        value = suivi.arriveeMinutes?.let { formatMinutes(it) } ?: "Non renseigné"
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    InfoRow(
                        icon = Icons.Default.Restaurant,
                        label = "Repas",
                        value = "${suivi.repasFournis}"
                    )
                }

                Column {
                    InfoRow(
                        icon = Icons.Default.AccessTime,
                        label = "Départ",
                        value = suivi.departMinutes?.let { formatMinutes(it) } ?: "Non renseigné"
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    if (suivi.fraisDivers != null && suivi.fraisDivers != "0") {
                        InfoRow(
                            icon = Icons.Default.Euro,
                            label = "Frais",
                            value = "${suivi.fraisDivers}€"
                        )
                    }
                }
            }
        }
    }

    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Confirmer la suppression") },
            text = { Text("Êtes-vous sûr de vouloir supprimer ce suivi ?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        onDelete()
                        showDeleteDialog = false
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = Color.Red)
                ) {
                    Text("Supprimer")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Annuler")
                }
            }
        )
    }
}

@Composable
private fun StatutBadge(statut: StatutValidation) {
    val (color, text) = when (statut) {
        StatutValidation.EN_ATTENTE -> Color(0xFFFFA726) to "En attente"
        StatutValidation.VALIDE -> Color(0xFF66BB6A) to "Validé"
        StatutValidation.REFUSE -> Color(0xFFEF5350) to "Refusé"
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(color.copy(alpha = 0.15f))
            .padding(horizontal = 12.dp, vertical = 4.dp)
    ) {
        Text(
            text = text,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = color
        )
    }
}

@Composable
private fun InfoRow(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, value: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Start
    ) {
        Icon(
            icon,
            contentDescription = null,
            modifier = Modifier.size(16.dp),
            tint = Color.Gray
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = "$label:",
            fontSize = 12.sp,
            color = Color.Gray
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = value,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = Color.Black
        )
    }
}

@Composable
private fun EmptyState() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                Icons.Default.EventNote,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = Color.Gray.copy(alpha = 0.5f)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                "Aucun suivi de garde",
                fontSize = 16.sp,
                color = Color.Gray,
                fontWeight = FontWeight.Medium
            )
            Text(
                "Ajoutez un premier suivi avec le bouton +",
                fontSize = 14.sp,
                color = Color.Gray.copy(alpha = 0.7f)
            )
        }
    }
}

private fun formatDate(dateString: String): String {
    return try {
        val date = LocalDate.parse(dateString.take(10))
        date.format(DateTimeFormatter.ofPattern("EEEE d MMMM yyyy"))
    } catch (e: Exception) {
        dateString
    }
}

private fun formatMinutes(minutes: Int): String {
    val hours = minutes / 60
    val mins = minutes % 60
    return String.format("%02d:%02d", hours, mins)
}

private fun getMoisName(mois: Int): String {
    return when (mois) {
        1 -> "Janvier"
        2 -> "Février"
        3 -> "Mars"
        4 -> "Avril"
        5 -> "Mai"
        6 -> "Juin"
        7 -> "Juillet"
        8 -> "Août"
        9 -> "Septembre"
        10 -> "Octobre"
        11 -> "Novembre"
        12 -> "Décembre"
        else -> ""
    }
}
