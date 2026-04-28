# A MODIFIER

# RAM Les Fripouilles - Application Desktop Mission 4

Application Desktop JavaFX pour la gestion des fiches de paie des assistantes maternelles.

## Description

Cette application lourde permet au RAM (Relais Assistantes Maternelles) "Les Fripouilles" de gérer les fiches de paie des assistantes maternelles. Elle fait partie de la **Mission 4** du projet AP BTS SIO 2025-2026.

### Fonctionnalités principales

- **Authentification** : Connexion sécurisée réservée aux administrateurs du RAM
- **Consultation des paies** : Visualisation de toutes les fiches de paie avec filtres (année, mois)
- **Génération de paies** : Création automatique de fiches de paie à partir des suivis de garde validés
- **Détails des paies** : Affichage détaillé des informations d'une fiche de paie
- **Gestion des paies** : Suppression de fiches de paie

## Architecture

L'application suit le **pattern MVC (Model-View-Controller)** :

### Model (Modèle)
- `User.java` : Modèle utilisateur
- `Contrat.java` : Modèle contrat de garde
- `Paie.java` : Modèle fiche de paie
- `Enfant.java` : Modèle enfant
- `ParentProfil.java` : Modèle profil parent
- `AssistantProfil.java` : Modèle profil assistante maternelle

### View (Vue)
- `login-view.fxml` : Interface de connexion
- `main-view.fxml` : Interface principale avec liste des paies
- `paie-detail-view.fxml` : Interface de détails d'une paie
- `generer-paie-view.fxml` : Interface de génération d'une paie

### Controller (Contrôleur)
- `LoginController.java` : Gestion de la connexion
- `MainController.java` : Gestion de la vue principale
- `PaieDetailController.java` : Gestion de l'affichage des détails
- `GenererPaieController.java` : Gestion de la génération de paies

### Service (Services)
- `JwtService.java` : Gestion du token JWT (session)
- `ApiService.java` : Client HTTP pour les appels API
- `AuthService.java` : Service d'authentification
- `PaieService.java` : Service de gestion des paies
- `ContratService.java` : Service de gestion des contrats

## Technologies utilisées

- **Java 9+** : Langage de programmation
- **JavaFX 21** : Framework UI
- **Maven** : Gestionnaire de dépendances
- **Gson 2.10.1** : Sérialisation/désérialisation JSON
- **Apache HttpClient 5.3** : Client HTTP pour les appels API REST

## Configuration

### Backend API

L'application se connecte au backend NestJS sur `http://localhost:3000`.

Pour modifier l'URL du backend, éditez le fichier `ApiService.java` :

```java
private static final String BASE_URL = "http://localhost:3000";
```

### Authentification

L'application nécessite un compte avec le rôle `ADMIN` pour se connecter.

Exemple de compte admin (à créer dans le backend) :
- Email : admin@ram.fr
- Mot de passe : Admin123!

## Installation et lancement

### Prérequis

- Java JDK 9 ou supérieur
- Maven 3.6+
- Backend NestJS en cours d'exécution sur http://localhost:3000

### Compilation

```bash
cd desktop/fripouilles
mvn clean compile
```

### Lancement

```bash
mvn javafx:run
```

Ou avec Maven wrapper :

```bash
./mvnw javafx:run
```

### Création d'un package exécutable

```bash
mvn clean package
```

## Utilisation

1. **Connexion** : Lancez l'application et connectez-vous avec un compte administrateur
2. **Vue principale** : Consultez la liste des fiches de paie, filtrez par année/mois
3. **Générer une paie** : Cliquez sur "Générer une paie", sélectionnez un contrat et une période
4. **Voir les détails** : Sélectionnez une paie et cliquez sur "Voir détails"
5. **Supprimer** : Sélectionnez une paie et cliquez sur "Supprimer" (avec confirmation)

## Gestion de session

L'application stocke le JWT (JSON Web Token) en mémoire pendant la durée de la session. Le token est automatiquement ajouté aux headers des requêtes HTTP vers le backend.

**Note** : Le token n'est pas persisté sur le disque, il est perdu à la fermeture de l'application (pas de gestion de session persistante comme demandé).

## Structure du projet

```
src/
├── main/
│   ├── java/
│   │   ├── module-info.java
│   │   └── org/example/fripouilles/
│   │       ├── MainApplication.java
│   │       ├── controller/
│   │       │   ├── LoginController.java
│   │       │   ├── MainController.java
│   │       │   ├── PaieDetailController.java
│   │       │   └── GenererPaieController.java
│   │       ├── model/
│   │       │   ├── User.java
│   │       │   ├── Contrat.java
│   │       │   ├── Paie.java
│   │       │   ├── Enfant.java
│   │       │   ├── ParentProfil.java
│   │       │   └── AssistantProfil.java
│   │       └── service/
│   │           ├── JwtService.java
│   │           ├── ApiService.java
│   │           ├── AuthService.java
│   │           ├── PaieService.java
│   │           └── ContratService.java
│   └── resources/
│       └── org/example/fripouilles/
│           ├── login-view.fxml
│           ├── main-view.fxml
│           ├── paie-detail-view.fxml
│           └── generer-paie-view.fxml
└── pom.xml
```

## Mission 4 - Contexte

Cette application fait partie du système complet de gestion des paies qui comprend :

1. **Application Android** (pour les assistantes maternelles) : Saisie des horaires de garde
2. **Application Web** (pour les parents) : Validation et modification des données
3. **Application Desktop** (pour le RAM) : Génération et édition des bulletins de paie

L'application Desktop exploite les données transmises par l'application Android et validées par les parents via l'application Web pour générer automatiquement les fiches de paie.

## Calcul des paies

Les fiches de paie sont calculées automatiquement par le backend en fonction de :

- Nombre d'heures de garde (normales et majorées)
- Tarif horaire du contrat
- Charges patronales et salariales (paramètres légaux)
- Majoration pour heures supplémentaires

**Note** : Le salaire horaire minimum est de 3,64 € bruts (depuis avril 2025).

## Auteur

Projet réalisé dans le cadre du BTS SIO 2025-2026 - Atelier de Professionnalisation

## Licence

Projet pédagogique - RAM Les Fripouilles

Bonne question, soyons honnêtes : **pas totalement**.

Voici ce que le contexte dit explicitement vs ce que j'ai mis :

---

**✅ Ce qui est correct (source : sujet AP)**

| Paramètre | Valeur sujet | Ce que j'ai mis |
|---|---|---|
| `SMIC_HORAIRE_BRUT` | 3,64 € brut / 2,85 € net (depuis 01/04/2025) | ✅ Correct |

---

**⚠️ Ce que j'ai inventé / supposé**

| Paramètre | Ce que j'ai mis | Réalité |
|---|---|---|
| `TAUX_CHARGE_SALARIALE` | 0.22 (22%) | Repris de ton seed existant, **pas mentionné dans le sujet** |
| `TAUX_CHARGE_PATRONALE` | 0.42 (42%) | Idem, **pas mentionné dans le sujet** |
| `MAJORATION_HEURE_SUP` | 0.25 (25%) | Idem, **pas mentionné dans le sujet** |
| `INDEMNITE_ENTRETIEN_MIN` | 3.25 | **Pas mentionné dans le sujet** |
| `INDEMNITE_KM` | 0.50 | **Pas mentionné dans le sujet** |
| `TAUX_PRISE_CHARGE_CAF` | 0.15 | **Pas mentionné dans le sujet** |

---

**La réalité réglementaire 2025 pour les ass. mat. :**

- Charges salariales : ~**10,5 à 11%** (et non 22%) — les 22% dans ton seed sont surestimés
- Charges patronales : ~**35 à 40%** selon les cotisations — 42% est proche mais approximatif
- Majoration heures sup : **25%** pour les 8 premières heures au-delà de la durée légale — c'est correct réglementairement
- Indemnité entretien min : **3,64 €/jour** depuis avril 2025 (alignée sur le SMIC)

**Mon conseil :** garde les valeurs de ton seed existant (cohérence interne), mais sache que si ton prof vérifie les charges salariales à 22%, c'est à défendre. Le sujet ne les précisant pas, c'est une approximation pédagogique acceptable.
