package com.example.fripouilles.view.screens

import android.app.TimePickerDialog
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
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

fun ParentSuivisScreen(
    controller: SuiviGardeController,
    onLogout: () -> Unit,
    onNavigateToAteliers: () -> Unit = {},
    onNavigateToDaily: () -> Unit,
    onNavigateToCreche: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val scope = rememberCoroutineScope()
    var showFilters by remember { mutableStateOf(false) }
    var selectedMois by remember { mutableStateOf<Int?>(null) }
    var selectedAnnee by remember { mutableStateOf<Int?>(LocalDate.now().year) }
    var selectedStatut by remember { mutableStateOf<StatutValidation?>(null) }
    var selectedSuivi by remember { mutableStateOf<SuiviGarde?>(null) }

    LaunchedEffect(Unit) {
        controller.loadSuivisParent(selectedMois, selectedAnnee)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Suivis de garde", fontWeight = FontWeight.Bold) },
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
                    onClick = onNavigateToCreche,
                    icon = { Icon(Icons.Default.ChildCare, contentDescription = null) },
                    label = { Text("Crèche", fontSize = 10.sp) }
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
                    onMoisChange = { selectedMois = it },
                    onAnneeChange = { selectedAnnee = it },
                    onStatutChange = { selectedStatut = it },
                    onApplyFilters = {
                        scope.launch {
                            controller.loadSuivisParent(selectedMois, selectedAnnee, selectedStatut)
                            showFilters = false
                        }
                    },
                    onResetFilters = {
                        selectedMois = null
                        selectedAnnee = LocalDate.now().year
                        selectedStatut = null
                        scope.launch {
                            controller.loadSuivisParent(null, selectedAnnee, null)
                            showFilters = false
                        }
                    }
                )
            }

            // Statistiques
            val enAttente = controller.suivis.count { it.statut == StatutValidation.EN_ATTENTE }
            if (enAttente > 0) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF4E6)),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Warning,
                            contentDescription = null,
                            tint = Color(0xFFFFA726),
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            "$enAttente suivi(s) en attente de validation",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFFFFA726)
                        )
                    }
                }
            }

            controller.errorMessage?.let { error ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
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
                        ParentSuiviCard(
                            suivi = suivi,
                            onClick = { selectedSuivi = suivi }
                        )
                    }
                }
            }
        }
    }

    // Dialog de validation/modification
    selectedSuivi?.let { suivi ->
        suivi.id?.let { id ->
            ValidationDialog(
                suivi = suivi,
                onDismiss = {
                    selectedSuivi = null
                    controller.clearError()
                },
                onValidate = { statut, arrivee, depart, repas, frais, km, commentaire ->
                    scope.launch {
                        val success = controller.validerSuivi(
                            id = id,
                            statut = statut,
                            arriveeMinutes = arrivee,
                            departMinutes = depart,
                            repasFournis = repas,
                            fraisDivers = frais,
                            km = km,
                            commentairesParent = commentaire
                        )
                        if (success) {
                            selectedSuivi = null
                        }
                    }
                },
                isLoading = controller.isLoading,
                errorMessage = controller.errorMessage
            )
        }
    }
}

@Composable
private fun ParentSuiviCard(
    suivi: SuiviGarde,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
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

                suivi.statut?.let { StatutBadge(it) }
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

            if (suivi.statut == StatutValidation.EN_ATTENTE) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    Text(
                        "Cliquez pour valider",
                        fontSize = 12.sp,
                        color = Primary,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(
                        Icons.Default.ChevronRight,
                        contentDescription = null,
                        tint = Primary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            if (!suivi.commentairesParent.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(12.dp))
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF5F5F5))
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            "Vos commentaires:",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.Gray
                        )
                        Text(
                            suivi.commentairesParent,
                            fontSize = 12.sp,
                            color = Color.Black,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ValidationDialog(
    suivi: SuiviGarde,
    onDismiss: () -> Unit,
    onValidate: (StatutValidation, Int?, Int?, Int?, Double?, Double?, String?) -> Unit,
    isLoading: Boolean,
    errorMessage: String?
) {
    var arriveeMinutes by remember { mutableStateOf(suivi.arriveeMinutes?.let { formatMinutes(it) } ?: "") }
    var departMinutes by remember { mutableStateOf(suivi.departMinutes?.let { formatMinutes(it) } ?: "") }
    var repasFournis by remember { mutableStateOf(suivi.repasFournis.toString()) }
    var fraisDivers by remember { mutableStateOf(suivi.fraisDivers ?: "") }
    var km by remember { mutableStateOf(suivi.km ?: "") }
    var commentaire by remember { mutableStateOf(suivi.commentairesParent ?: "") }
    var showTimePicker by remember { mutableStateOf(false) }
    var timePickerType by remember { mutableStateOf<TimePickerType>(TimePickerType.ARRIVEE) }

    AlertDialog(
        onDismissRequest = onDismiss,
        modifier = Modifier.fillMaxWidth()
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(24.dp)
            ) {
                Text(
                    "Validation du suivi",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    suivi.date?.let { formatDate(it) } ?: "Date inconnue",
                    fontSize = 14.sp,
                    color = Color.Gray
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Heures
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Arrivée",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.Gray
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    timePickerType = TimePickerType.ARRIVEE
                                    showTimePicker = true
                                }
                        ) {
                            OutlinedTextField(
                                value = arriveeMinutes,
                                onValueChange = {},
                                enabled = false,
                                placeholder = { Text("--:--", fontSize = 14.sp) },
                                trailingIcon = {
                                    Icon(Icons.Default.AccessTime, contentDescription = null, modifier = Modifier.size(20.dp))
                                },
                                modifier = Modifier.fillMaxWidth(),
                                colors = OutlinedTextFieldDefaults.colors(
                                    disabledBorderColor = Color.Gray,
                                    disabledTextColor = Color.Black,
                                    disabledPlaceholderColor = Color.Gray,
                                    disabledTrailingIconColor = Primary
                                ),
                                textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                            )
                        }
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Départ",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.Gray
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    timePickerType = TimePickerType.DEPART
                                    showTimePicker = true
                                }
                        ) {
                            OutlinedTextField(
                                value = departMinutes,
                                onValueChange = {},
                                enabled = false,
                                placeholder = { Text("--:--", fontSize = 14.sp) },
                                trailingIcon = {
                                    Icon(Icons.Default.AccessTime, contentDescription = null, modifier = Modifier.size(20.dp))
                                },
                                modifier = Modifier.fillMaxWidth(),
                                colors = OutlinedTextFieldDefaults.colors(
                                    disabledBorderColor = Color.Gray,
                                    disabledTextColor = Color.Black,
                                    disabledPlaceholderColor = Color.Gray,
                                    disabledTrailingIconColor = Primary
                                ),
                                textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Repas
                Text(
                    "Nombre de repas",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = repasFournis,
                    onValueChange = { repasFournis = it.filter { char -> char.isDigit() } },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Primary,
                        unfocusedBorderColor = Color.Gray
                    ),
                    textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Frais divers
                Text(
                    "Frais divers (€)",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = fraisDivers,
                    onValueChange = { fraisDivers = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Primary,
                        unfocusedBorderColor = Color.Gray
                    ),
                    textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Kilomètres
                Text(
                    "Kilomètres",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = km,
                    onValueChange = { km = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Primary,
                        unfocusedBorderColor = Color.Gray
                    ),
                    textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Commentaire
                Text(
                    "Commentaire (optionnel)",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = commentaire,
                    onValueChange = { commentaire = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Primary,
                        unfocusedBorderColor = Color.Gray
                    ),
                    textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                )

                errorMessage?.let { error ->
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = error,
                        fontSize = 12.sp,
                        color = Color.Red
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Boutons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (suivi.statut == StatutValidation.EN_ATTENTE) {
                        OutlinedButton(
                            onClick = {
                                onValidate(
                                    StatutValidation.REFUSE,
                                    parseTimeToMinutes(arriveeMinutes),
                                    parseTimeToMinutes(departMinutes),
                                    repasFournis.toIntOrNull(),
                                    fraisDivers.toDoubleOrNull(),
                                    km.toDoubleOrNull(),
                                    commentaire.takeIf { it.isNotEmpty() }
                                )
                            },
                            modifier = Modifier.weight(1f),
                            enabled = !isLoading,
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.Red)
                        ) {
                            Text("Refuser", fontSize = 14.sp)
                        }
                    }

                    if (suivi.statut != StatutValidation.EN_ATTENTE) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Annuler", fontSize = 14.sp)
                        }
                    }

                    Button(
                        onClick = {
                            onValidate(
                                StatutValidation.VALIDE,
                                parseTimeToMinutes(arriveeMinutes),
                                parseTimeToMinutes(departMinutes),
                                repasFournis.toIntOrNull(),
                                fraisDivers.toDoubleOrNull(),
                                km.toDoubleOrNull(),
                                commentaire.takeIf { it.isNotEmpty() }
                            )
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF66BB6A)),
                        enabled = !isLoading
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text("Valider", fontSize = 14.sp)
                        }
                    }
                }
            }
        }
    }

    if (showTimePicker) {
        TimePickerDialog(
            onDismiss = { showTimePicker = false },
            onConfirm = { time ->
                when (timePickerType) {
                    TimePickerType.ARRIVEE -> arriveeMinutes = time
                    TimePickerType.DEPART -> departMinutes = time
                }
                showTimePicker = false
            },
            initialTime = when (timePickerType) {
                TimePickerType.ARRIVEE -> arriveeMinutes
                TimePickerType.DEPART -> departMinutes
            }
        )
    }
}

// Réutilisation des composants communs avec AssistantSuivisScreen
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FilterSection(
    selectedMois: Int?,
    selectedAnnee: Int?,
    selectedStatut: StatutValidation?,
    onMoisChange: (Int?) -> Unit,
    onAnneeChange: (Int?) -> Unit,
    onStatutChange: (StatutValidation?) -> Unit,
    onApplyFilters: () -> Unit,
    onResetFilters: () -> Unit
) {
    var showMoisDropdown by remember { mutableStateOf(false) }
    var showAnneeDropdown by remember { mutableStateOf(false) }
    var showStatutDropdown by remember { mutableStateOf(false) }

    val moisNames = mapOf(
        1 to "Janvier", 2 to "Février", 3 to "Mars", 4 to "Avril",
        5 to "Mai", 6 to "Juin", 7 to "Juillet", 8 to "Août",
        9 to "Septembre", 10 to "Octobre", 11 to "Novembre", 12 to "Décembre"
    )
    val annees = (2020..2030).toList()
    val statutOptions = mapOf(
        StatutValidation.EN_ATTENTE to "En attente",
        StatutValidation.VALIDE to "Validé",
        StatutValidation.REFUSE to "Refusé"
    )

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Filtrer par période", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(12.dp))

            // Filtre Mois
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        "Mois",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    ExposedDropdownMenuBox(
                        expanded = showMoisDropdown,
                        onExpandedChange = { showMoisDropdown = it }
                    ) {
                        OutlinedTextField(
                            value = selectedMois?.let { moisNames[it] } ?: "Tous",
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = showMoisDropdown) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Primary,
                                unfocusedBorderColor = Color.Gray
                            ),
                            textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                        )
                        ExposedDropdownMenu(
                            expanded = showMoisDropdown,
                            onDismissRequest = { showMoisDropdown = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("Tous") },
                                onClick = {
                                    onMoisChange(null)
                                    showMoisDropdown = false
                                }
                            )
                            moisNames.forEach { (numero, nom) ->
                                DropdownMenuItem(
                                    text = { Text(nom) },
                                    onClick = {
                                        onMoisChange(numero)
                                        showMoisDropdown = false
                                    }
                                )
                            }
                        }
                    }
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        "Année",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    ExposedDropdownMenuBox(
                        expanded = showAnneeDropdown,
                        onExpandedChange = { showAnneeDropdown = it }
                    ) {
                        OutlinedTextField(
                            value = selectedAnnee?.toString() ?: "Toutes",
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = showAnneeDropdown) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Primary,
                                unfocusedBorderColor = Color.Gray
                            ),
                            textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                        )
                        ExposedDropdownMenu(
                            expanded = showAnneeDropdown,
                            onDismissRequest = { showAnneeDropdown = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("Toutes") },
                                onClick = {
                                    onAnneeChange(null)
                                    showAnneeDropdown = false
                                }
                            )
                            annees.forEach { annee ->
                                DropdownMenuItem(
                                    text = { Text(annee.toString()) },
                                    onClick = {
                                        onAnneeChange(annee)
                                        showAnneeDropdown = false
                                    }
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Filtre Statut
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    "Statut",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(4.dp))
                ExposedDropdownMenuBox(
                    expanded = showStatutDropdown,
                    onExpandedChange = { showStatutDropdown = it }
                ) {
                    OutlinedTextField(
                        value = selectedStatut?.let { statutOptions[it] } ?: "Tous",
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = showStatutDropdown) },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            unfocusedBorderColor = Color.Gray
                        ),
                        textStyle = LocalTextStyle.current.copy(fontSize = 14.sp)
                    )
                    ExposedDropdownMenu(
                        expanded = showStatutDropdown,
                        onDismissRequest = { showStatutDropdown = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Tous") },
                            onClick = {
                                onStatutChange(null)
                                showStatutDropdown = false
                            }
                        )
                        statutOptions.forEach { (statut, nom) ->
                            DropdownMenuItem(
                                text = { Text(nom) },
                                onClick = {
                                    onStatutChange(statut)
                                    showStatutDropdown = false
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
