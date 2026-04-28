package com.example.fripouilles.view.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.fripouilles.controller.AtelierController
import com.example.fripouilles.model.*
import com.example.fripouilles.view.theme.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter

private fun minutesToTime(minutes: Int): String {
    val h = (minutes / 60).toString().padStart(2, '0')
    val m = (minutes % 60).toString().padStart(2, '0')
    return "${h}h${m}"
}

private fun formatDate(dateStr: String): String {
    return try {
        val date = LocalDate.parse(dateStr.substring(0, 10))
        date.format(DateTimeFormatter.ofPattern("EEEE d MMMM yyyy", java.util.Locale.FRENCH))
            .replaceFirstChar { it.uppercase() }
    } catch (e: Exception) {
        dateStr.substring(0, 10)
    }
}

private fun typePublicLabel(typePublic: TypePublicAtelier): String = when (typePublic) {
    TypePublicAtelier.ENFANT -> "Avec enfants"
    TypePublicAtelier.PARENT_UNIQUEMENT -> "Parents uniquement"
    TypePublicAtelier.ASSISTANT_UNIQUEMENT -> "Assistantes uniquement"
    TypePublicAtelier.MIXTE -> "Mixte"
}

private fun typePublicColor(typePublic: TypePublicAtelier): Color = when (typePublic) {
    TypePublicAtelier.ENFANT -> Color(0xFF1E88E5)
    TypePublicAtelier.PARENT_UNIQUEMENT -> Color(0xFF8E24AA)
    TypePublicAtelier.ASSISTANT_UNIQUEMENT -> Color(0xFFEF6C00)
    TypePublicAtelier.MIXTE -> Color(0xFF00897B)
}

@Composable
fun InscriptionDialog(
    atelier: Atelier,
    isInscrit: Boolean,
    controller: AtelierController,
    onDismiss: () -> Unit,
    onConfirmInscrire: () -> Unit,
    onConfirmDesinscrire: () -> Unit,
    isLoading: Boolean
) {
    // Calcul des places restantes en utilisant les inscriptions du contrôleur pour la cohérence
    val totalInscriptions = controller.inscriptions.count { it.atelierId == atelier.id }
    val placesRestantes = maxOf(0, atelier.nombrePlaces - totalInscriptions)

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(8.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    atelier.nom,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = Color(0xFF1A1A1A)
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    formatDate(atelier.date),
                    fontSize = 13.sp,
                    color = Color.Gray
                )
                Spacer(Modifier.height(16.dp))

                // Infos
                InfoRow("Horaire", "${minutesToTime(atelier.debutMinutes)} – ${minutesToTime(atelier.finMinutes)}")
                InfoRow("Lieu", atelier.lieu)
                InfoRow(
                    "Places",
                    if (placesRestantes == 0) "Complet" else "$placesRestantes/${atelier.nombrePlaces}",
                    valueColor = if (placesRestantes == 0) Color.Red else Color(0xFF2E7D32)
                )

                Spacer(Modifier.height(20.dp))

                // Affichage d'erreur si présente
                controller.errorMessage?.let { msg ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFFFEBEE)
                    ) {
                        Text(
                            msg,
                            modifier = Modifier.padding(12.dp),
                            fontSize = 13.sp,
                            color = Color(0xFFD32F2F)
                        )
                    }
                    Spacer(Modifier.height(12.dp))
                }

                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        enabled = !controller.isInscriptionLoading
                    ) { Text("Annuler", fontSize = 13.sp) }

                    if (isInscrit) {
                        Button(
                            onClick = onConfirmDesinscrire,
                            modifier = Modifier.weight(1f),
                            enabled = !controller.isInscriptionLoading,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD32F2F))
                        ) {
                            if (controller.isInscriptionLoading) CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                            else Text("Se désinscrire", fontSize = 13.sp)
                        }
                    } else {
                        Button(
                            onClick = onConfirmInscrire,
                            modifier = Modifier.weight(1f),
                            enabled = !controller.isInscriptionLoading && placesRestantes > 0,
                            colors = ButtonDefaults.buttonColors(containerColor = Primary)
                        ) {
                            if (controller.isInscriptionLoading) CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                            else Text("S'inscrire", fontSize = 13.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String, valueColor: Color = Color(0xFF1A1A1A)) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, fontSize = 13.sp, color = Color.Gray)
        Text(value, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = valueColor)
    }
}

@Composable
fun AtelierCard(
    atelier: Atelier,
    isInscrit: Boolean,
    controller: AtelierController,
    onClick: () -> Unit
) {
    // Calcul des places restantes en utilisant les inscriptions du contrôleur pour la cohérence
    val totalInscriptions = controller.inscriptions.count { it.atelierId == atelier.id }
    val placesRestantes = maxOf(0, atelier.nombrePlaces - totalInscriptions)
    val complet = placesRestantes == 0

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        atelier.nom,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 15.sp,
                        color = Color(0xFF1A1A1A),
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(Modifier.height(2.dp))
                    // Badge type public
                    val color = typePublicColor(atelier.typePublic)
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = color.copy(alpha = 0.12f)
                    ) {
                        Text(
                            typePublicLabel(atelier.typePublic),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                            fontSize = 11.sp,
                            color = color,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }

                if (isInscrit) {
                    Spacer(Modifier.width(8.dp))
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFE8F5E9)
                    ) {
                        Text(
                            "✓ Inscrit",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            fontSize = 11.sp,
                            color = Color(0xFF2E7D32),
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(Modifier.height(10.dp))

            // Date & horaire
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(14.dp))
                Spacer(Modifier.width(4.dp))
                Text(
                    "${formatDate(atelier.date)}  ·  ${minutesToTime(atelier.debutMinutes)} – ${minutesToTime(atelier.finMinutes)}",
                    fontSize = 12.sp, color = Color.Gray
                )
            }

            Spacer(Modifier.height(4.dp))

            // Lieu
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(14.dp))
                Spacer(Modifier.width(4.dp))
                Text(atelier.lieu, fontSize = 12.sp, color = Color.Gray)
            }

            Spacer(Modifier.height(10.dp))

            // Places restantes
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    if (complet) "Complet" else "$placesRestantes place${if (placesRestantes > 1) "s" else ""} restante${if (placesRestantes > 1) "s" else ""}",
                    fontSize = 12.sp,
                    color = if (complet) Color(0xFFD32F2F) else Color(0xFF2E7D32),
                    fontWeight = FontWeight.Medium
                )
                Text(
                    if (isInscrit) "Gérer ›" else if (complet) "" else "S'inscrire ›",
                    fontSize = 12.sp,
                    color = if (isInscrit) Color(0xFFD32F2F) else Primary,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AteliersScreen(
    controller: AtelierController,
    onLogout: () -> Unit,
    onNavigateToSuivis: () -> Unit = {},
    onNavigateToDaily: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val scope = rememberCoroutineScope()
    var selectedAtelier by remember { mutableStateOf<Atelier?>(null) }
    var currentTab by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        controller.loadAll()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Ateliers d'éveil", fontWeight = FontWeight.Bold) },
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
                    selected = false,
                    onClick = onNavigateToDaily,
                    icon = { Icon(Icons.Default.DateRange, contentDescription = null) },
                    label = { Text("Journalier", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = true,
                    onClick = {},
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
            // Onglets
            TabRow(
                selectedTabIndex = currentTab,
                containerColor = Color.White,
                contentColor = Primary
            ) {
                Tab(
                    selected = currentTab == 0,
                    onClick = { currentTab = 0 },
                    text = { Text("Disponibles", fontSize = 13.sp) }
                )
                Tab(
                    selected = currentTab == 1,
                    onClick = { currentTab = 1 },
                    text = {
                        Text(
                            "Mes inscriptions (${controller.inscriptions.size})",
                            fontSize = 13.sp
                        )
                    }
                )
            }

            // Contenu
            if (controller.isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Primary)
                }
            } else {
                val displayed = if (currentTab == 0) {
                    controller.ateliers.toList()
                } else {
                    controller.inscriptions.mapNotNull { it.atelier }
                }

                if (displayed.isEmpty()) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("🎨", fontSize = 40.sp)
                            Spacer(Modifier.height(12.dp))
                            Text(
                                if (currentTab == 1) "Aucune inscription" else "Aucun atelier à venir",
                                color = Color.Gray,
                                fontSize = 14.sp
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(displayed, key = { it.id }) { atelier ->
                            AtelierCard(
                                atelier = atelier,
                                isInscrit = controller.isInscrit(atelier.id),
                                controller = controller,
                                onClick = { selectedAtelier = atelier }
                            )
                        }
                    }
                }
            }

            // Erreur
            controller.errorMessage?.let { msg ->
                Snackbar(
                    modifier = Modifier.padding(16.dp),
                    action = {
                        TextButton(onClick = { /* retry */ }) { Text("OK") }
                    }
                ) { Text(msg) }
            }
        }
    }

    selectedAtelier?.let { atelier ->
        val isInscrit = controller.isInscrit(atelier.id)
        InscriptionDialog(
            atelier = atelier,
            isInscrit = isInscrit,
            controller = controller,
            onDismiss = {
                selectedAtelier = null
                controller.clearError()
            },
            onConfirmInscrire = {
                scope.launch {
                    if (controller.inscrire(atelier.id)) {
                        selectedAtelier = null
                    }
                }
            },
            onConfirmDesinscrire = {
                scope.launch {
                    if (controller.desinscrire(atelier.id)) {
                        selectedAtelier = null
                    }
                }
            },
            isLoading = controller.isLoading
        )
    }
}
