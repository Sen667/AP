package com.example.fripouilles.view.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fripouilles.model.*
import com.example.fripouilles.service.CrecheService
import com.example.fripouilles.view.theme.Primary
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CrecheScreen(parentId: Int, onNavigateBack: () -> Unit = {}) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("Mes Inscriptions", "Mes Réservations")
    
    val scope = rememberCoroutineScope()
    var inscriptions by remember { mutableStateOf<List<InscriptionCreche>>(emptyList()) }
    var reservations by remember { mutableStateOf<List<ReservationCreche>>(emptyList()) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var showAddInscriptionDialog by remember { mutableStateOf(false) }
    var showAddReservationDialog by remember { mutableStateOf(false) }

    // Fonction pour charger les données
    suspend fun loadData() {
        isLoading = true
        errorMessage = null
        try {
            inscriptions = CrecheService.getInscriptionsByParent(parentId)
            reservations = CrecheService.getReservationsByParent(parentId)
        } catch (e: Exception) {
            errorMessage = "Erreur: ${e.message}"
        } finally {
            isLoading = false
        }
    }

    // Charger les données au démarrage
    LaunchedEffect(Unit) {
        loadData()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Crèche - Planning & Réservations") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Retour",
                            tint = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    if (selectedTab == 0) showAddInscriptionDialog = true
                    else showAddReservationDialog = true
                },
                containerColor = Primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Ajouter")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Onglets
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = { Text(title) }
                    )
                }
            }

            // Contenu
            Box(modifier = Modifier.fillMaxSize()) {
                when {
                    isLoading -> {
                        CircularProgressIndicator(
                            modifier = Modifier.align(Alignment.Center)
                        )
                    }
                    errorMessage != null -> {
                        Text(
                            text = errorMessage ?: "",
                            color = MaterialTheme.colorScheme.error,
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(16.dp)
                        )
                    }
                    selectedTab == 0 -> {
                        InscriptionsTab(inscriptions) { scope.launch { loadData() } }
                    }
                    else -> {
                        ReservationsTab(reservations) { scope.launch { loadData() } }
                    }
                }
            }
        }
    }

    // Dialogs
    if (showAddInscriptionDialog) {
        AddInscriptionDialog(
            parentId = parentId,
            onDismiss = { showAddInscriptionDialog = false },
            onSuccess = {
                showAddInscriptionDialog = false
                scope.launch { loadData() }
            }
        )
    }

    if (showAddReservationDialog) {
        AddReservationDialog(
            parentId = parentId,
            onDismiss = { showAddReservationDialog = false },
            onSuccess = {
                showAddReservationDialog = false
                scope.launch { loadData() }
            }
        )
    }
}

@Composable
fun InscriptionsTab(inscriptions: List<InscriptionCreche>, onRefresh: () -> Unit) {
    if (inscriptions.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = null,
                    modifier = Modifier.size(64.dp),
                    tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "Aucune inscription",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(inscriptions) { inscription ->
                InscriptionCard(inscription)
            }
        }
    }
}

@Composable
fun InscriptionCard(inscription: InscriptionCreche) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = inscription.enfant?.let { "${it.prenom} ${it.nom}" } ?: "Enfant inconnu",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
                StatusChip(inscription.statut.name)
            }

            Spacer(modifier = Modifier.height(8.dp))

            InfoRow("Type", inscription.typeAccueil.name)
            InfoRow("Début", formatDate(inscription.dateDebut))
            inscription.dateFin?.let {
                InfoRow("Fin", formatDate(it))
            }

            if (inscription.typeAccueil == TypeAccueilCreche.REGULIER && !inscription.jours.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text("Jours réservés:", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                Text(
                    inscription.jours.joinToString(", ") { it.jourSemaine.name },
                    fontSize = 14.sp,
                    color = Primary
                )
            }
        }
    }
}

@Composable
fun ReservationsTab(reservations: List<ReservationCreche>, onRefresh: () -> Unit) {
    if (reservations.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = null,
                    modifier = Modifier.size(64.dp),
                    tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "Aucune réservation",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(reservations) { reservation ->
                ReservationCard(reservation)
            }
        }
    }
}

@Composable
fun ReservationCard(reservation: ReservationCreche) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = reservation.enfant?.let { "${it.prenom} ${it.nom}" } ?: "Enfant inconnu",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
                StatusChip(reservation.statut.name)
            }

            Spacer(modifier = Modifier.height(8.dp))

            InfoRow("Date", formatDate(reservation.date))
            InfoRow("Horaires", reservation.getHorairesFormatted())
            InfoRow("Montant", String.format("%.2f €", reservation.montant))
        }
    }
}

@Composable
fun StatusChip(status: String) {
    val (backgroundColor, textColor) = when (status) {
        "ACTIVE", "VALIDE" -> Pair(
            MaterialTheme.colorScheme.primaryContainer,
            MaterialTheme.colorScheme.onPrimaryContainer
        )
        "EN_ATTENTE" -> Pair(
            MaterialTheme.colorScheme.secondaryContainer,
            MaterialTheme.colorScheme.onSecondaryContainer
        )
        else -> Pair(
            MaterialTheme.colorScheme.errorContainer,
            MaterialTheme.colorScheme.onErrorContainer
        )
    }

    Surface(
        color = backgroundColor,
        shape = MaterialTheme.shapes.small,
        modifier = Modifier.padding(4.dp)
    ) {
        Text(
            text = status.replace("_", " "),
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            fontSize = 12.sp,
            color = textColor,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = "$label:",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
        Text(
            text = value,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

private fun formatDate(dateString: String): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        inputFormat.timeZone = TimeZone.getTimeZone("UTC")
        val date = inputFormat.parse(dateString)
        val outputFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
        outputFormat.format(date ?: Date())
    } catch (e: Exception) {
        try {
            val simpleFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val date = simpleFormat.parse(dateString)
            val outputFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
            outputFormat.format(date ?: Date())
        } catch (e2: Exception) {
            dateString
        }
    }
}
