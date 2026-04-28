// navigation/NavGraph.kt
package com.example.fripouilles.navigation

import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.example.fripouilles.controller.LoginController
import com.example.fripouilles.controller.SuiviGardeController
import com.example.fripouilles.controller.AtelierController
import com.example.fripouilles.model.Role
import com.example.fripouilles.service.AuthPreferences
import com.example.fripouilles.service.LoginService
import com.example.fripouilles.view.screens.*
import kotlinx.coroutines.launch
import androidx.compose.animation.*
import androidx.compose.animation.core.tween

@Composable
fun AppNavGraph(
    navController: NavHostController,
) {
    val scope = rememberCoroutineScope()

    val loginController = remember { LoginController() }
    val suiviGardeController = remember { SuiviGardeController() }
    val atelierController = remember { AtelierController() }
    val suiviJournalierController = remember { com.example.fripouilles.controller.SuiviJournalierController() }

    val isLoading by remember { derivedStateOf { loginController.isLoading } }
    val errorMessage by remember { derivedStateOf { loginController.errorMessage } }
    
    // Vérifier si l'utilisateur est déjà connecté
    val isLoggedIn = AuthPreferences.isLoggedIn()
    val userRole = AuthPreferences.getUserRole()
    
    val startDestination = if (isLoggedIn) {
        when (userRole) {
            Role.ASSISTANT -> "assistant_suivis"
            Role.PARENT -> "parent_suivis"
            Role.ADMIN -> "dashboard"
            else -> "login"
        }
    } else {
        "login"
    }

    NavHost(
        navController = navController,
        startDestination = startDestination,
        enterTransition = {
            fadeIn(animationSpec = tween(300)) + slideInHorizontally { it }
        },
        exitTransition = {
            fadeOut(animationSpec = tween(300)) + slideOutHorizontally { -it }
        },
        popEnterTransition = {
            fadeIn(animationSpec = tween(300)) + slideInHorizontally { -it }
        },
        popExitTransition = {
            fadeOut(animationSpec = tween(300)) + slideOutHorizontally { it }
        }
    ) {
        composable("login") {
            LoginScreen(
                onLoginClick = { email, password ->
                    scope.launch {
                        loginController.login(
                            email = email,
                            password = password,
                            onSuccess = {
                                // Router vers le bon écran selon le rôle
                                val role = AuthPreferences.getUserRole()
                                val destination = when (role) {
                                    Role.ASSISTANT -> "assistant_suivis"
                                    Role.PARENT -> "parent_suivis"
                                    Role.ADMIN -> "dashboard"
                                    else -> "login"
                                }
                                navController.navigate(destination) {
                                    popUpTo("login") { inclusive = true }
                                }
                            }
                        )
                    }
                },
                isLoading = isLoading,
                errorMessage = errorMessage
            )
        }

        // Routes pour les assistantes
        composable("assistant_suivis") {
            AssistantSuivisScreen(
                controller = suiviGardeController,
                onNavigateToAddEdit = { suiviId ->
                    if (suiviId != null) {
                        navController.navigate("assistant_suivi_edit/$suiviId")
                    } else {
                        navController.navigate("assistant_suivi_add")
                    }
                },
                onNavigateToAteliers = {
                    navController.navigate("assistant_ateliers")
                },
                onNavigateToDaily = {
                    navController.navigate("suivi_journalier_assistant")
                },
                onLogout = {
                    LoginService.logout()
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable("assistant_suivi_add") {
            AddEditSuiviScreen(
                controller = suiviGardeController,
                suiviId = null,
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }
        
        composable(
            route = "assistant_suivi_edit/{suiviId}",
            arguments = listOf(navArgument("suiviId") { type = NavType.IntType })
        ) { backStackEntry ->
            val suiviId = backStackEntry.arguments?.getInt("suiviId")
            AddEditSuiviScreen(
                controller = suiviGardeController,
                suiviId = suiviId,
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }

        composable("assistant_ateliers") {
            AteliersScreen(
                controller = atelierController,
                onNavigateToSuivis = {
                    navController.navigate("assistant_suivis") {
                        popUpTo("assistant_suivis") { inclusive = true }
                    }
                },
                onNavigateToDaily = {
                    navController.navigate("suivi_journalier_assistant")
                },
                onLogout = {
                    LoginService.logout()
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable("suivi_journalier_assistant") {
            AssistantDailySyncScreen(
                controller = suiviJournalierController,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToSuivis = {
                    navController.navigate("assistant_suivis") {
                        popUpTo("assistant_suivis") { inclusive = true }
                    }
                },
                onNavigateToAteliers = {
                    navController.navigate("assistant_ateliers")
                },
                onLogout = {
                    LoginService.logout()
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        // Routes pour les parents
        composable("parent_suivis") {
            ParentSuivisScreen(
                controller = suiviGardeController,
                onNavigateToAteliers = {
                    navController.navigate("parent_ateliers")
                },
                onNavigateToDaily = {
                    navController.navigate("suivi_journalier_parent")
                },
                onNavigateToCreche = {
                    navController.navigate("parent_creche")
                },
                onLogout = {
                    LoginService.logout()
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable("parent_ateliers") {
            AteliersScreen(
                controller = atelierController,
                onNavigateToSuivis = {
                    navController.navigate("parent_suivis") {
                        popUpTo("parent_suivis") { inclusive = true }
                    }
                },
                onNavigateToDaily = {
                    navController.navigate("suivi_journalier_parent")
                },
                onLogout = {
                    LoginService.logout()
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable("suivi_journalier_parent") {
            ParentDailySyncScreen(
                controller = suiviJournalierController,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToSuivis = {
                    navController.navigate("parent_suivis") {
                        popUpTo("parent_suivis") { inclusive = true }
                    }
                },
                onNavigateToAteliers = {
                    navController.navigate("parent_ateliers")
                },
                onLogout = {
                    LoginService.logout()
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable("parent_creche") {
            val userId = AuthPreferences.getUserId()
            if (userId > 0) {
                CrecheScreen(
                    parentId = userId,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
        
        // Dashboard (si besoin pour les admins)
        composable("dashboard") {
            DashboardScreen(
                onLogout = {
                    LoginService.logout()
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
    }
}