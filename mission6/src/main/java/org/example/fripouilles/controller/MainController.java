package org.example.fripouilles.controller;

import javafx.application.Platform;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;
import org.example.fripouilles.model.creche.Inscription;
import org.example.fripouilles.model.creche.Reservation;
import org.example.fripouilles.service.ApiService;
import org.example.fripouilles.service.AuthService;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

public class MainController {

    @FXML
    private BorderPane root;
    @FXML
    private StackPane overlay;

    // Inscriptions
    @FXML
    private TableView<Inscription> inscriptionsTable;
    @FXML
    private TableColumn<Inscription, Integer> colInscrId;
    @FXML
    private TableColumn<Inscription, String> colInscrEnfant;
    @FXML
    private TableColumn<Inscription, String> colInscrType;
    @FXML
    private TableColumn<Inscription, String> colInscrDateDebut;
    @FXML
    private TableColumn<Inscription, String> colInscrStatut;

    // Reservations
    @FXML
    private TableView<Reservation> reservationsTable;
    @FXML
    private TableColumn<Reservation, Integer> colResId;
    @FXML
    private TableColumn<Reservation, String> colResEnfant;
    @FXML
    private TableColumn<Reservation, String> colResDate;
    @FXML
    private TableColumn<Reservation, String> colResHoraires;
    @FXML
    private TableColumn<Reservation, String> colResStatut;

    private Stage loginStage;
    private final AuthService authService;
    private final ApiService apiService;

    private ObservableList<Inscription> inscriptionsList = FXCollections.observableArrayList();
    private ObservableList<Reservation> reservationsList = FXCollections.observableArrayList();

    public MainController() {
        this.authService = new AuthService();
        this.apiService = new ApiService();
    }

    public void setLoginStage(Stage loginStage) {
        this.loginStage = loginStage;
    }

    @FXML
    private void initialize() {
        try {
            Platform.runLater(() -> {
                Rectangle clip = new Rectangle();
                clip.widthProperty().bind(root.widthProperty());
                clip.heightProperty().bind(root.heightProperty());
                clip.setArcWidth(20);
                clip.setArcHeight(20);
                root.setClip(clip);
            });

            setupColumns();
            handleRefresh();

        } catch (Exception e) {
            e.printStackTrace();
            showError("Erreur d'initialisation", e.getMessage());
        }
    }

    private void setupColumns() {
        // Setup Inscriptions Columns
        colInscrId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colInscrEnfant.setCellValueFactory(cellData -> new SimpleStringProperty(
                cellData.getValue().getEnfant() != null ? cellData.getValue().getEnfant().toString() : ""));
        colInscrType.setCellValueFactory(new PropertyValueFactory<>("typeAccueil"));
        colInscrDateDebut.setCellValueFactory(
                cellData -> new SimpleStringProperty(formatDate(cellData.getValue().getDateDebut())));
        colInscrStatut.setCellValueFactory(new PropertyValueFactory<>("statut"));
        inscriptionsTable.setItems(inscriptionsList);

        // Setup Reservations Columns
        colResId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colResEnfant.setCellValueFactory(cellData -> new SimpleStringProperty(
                cellData.getValue().getEnfant() != null ? cellData.getValue().getEnfant().toString() : ""));
        colResDate.setCellValueFactory(cellData -> new SimpleStringProperty(formatDate(cellData.getValue().getDate())));
        colResHoraires.setCellValueFactory(new PropertyValueFactory<>("horairesFormatted"));
        colResStatut.setCellValueFactory(new PropertyValueFactory<>("statut"));
        reservationsTable.setItems(reservationsList);
    }

    private String formatDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty())
            return "";
        try {
            ZonedDateTime zdt = ZonedDateTime.parse(dateStr);
            return zdt.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        } catch (Exception e) {
            return dateStr;
        }
    }

    @FXML
    private void handleRefresh() {
        new Thread(() -> {
            try {
                Inscription[] inscrArray = apiService.get("/creche/inscriptions", Inscription[].class);
                Reservation[] resArray = apiService.get("/creche/reservations", Reservation[].class);

                Platform.runLater(() -> {
                    inscriptionsList.setAll(Arrays.asList(inscrArray));
                    reservationsList.setAll(Arrays.asList(resArray));
                });
            } catch (Exception e) {
                Platform.runLater(() -> showError("Erreur de rafraichissement",
                        "Impossible de récupérer les données: " + e.getMessage()));
            }
        }).start();
    }

    private void fetchOptionsAndShowDialog(boolean isReservation, Object existing) {
        new Thread(() -> {
            try {
                org.example.fripouilles.model.User[] users = apiService.get("/user/admin/users",
                        org.example.fripouilles.model.User[].class);
                org.example.fripouilles.model.creche.Enfant[] enfants = apiService.get("/enfant/admin/enfants",
                        org.example.fripouilles.model.creche.Enfant[].class);
                java.util.List<org.example.fripouilles.model.User> parents = java.util.Arrays.stream(users)
                        .filter(u -> "PARENT".equals(u.getRole()))
                        .collect(java.util.stream.Collectors.toList());
                java.util.List<org.example.fripouilles.model.creche.Enfant> enfantList = java.util.Arrays
                        .asList(enfants);

                Platform.runLater(() -> {
                    if (isReservation) {
                        showReservationDialog((Reservation) existing, parents, enfantList);
                    } else {
                        showInscriptionDialog((Inscription) existing, parents, enfantList);
                    }
                });
            } catch (Exception e) {
                Platform.runLater(() -> showError("Erreur",
                        "Impossible de charger les données (parents/enfants): " + e.getMessage()));
            }
        }).start();
    }

    @FXML
    private void handleAddInscription() {
        fetchOptionsAndShowDialog(false, null);
    }

    @FXML
    private void handleEditInscription() {
        Inscription selected = inscriptionsTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Sélection requise", "Veuillez sélectionner une inscription à modifier.");
            return;
        }
        fetchOptionsAndShowDialog(false, selected);
    }

    @FXML
    private void handleDeleteInscription() {
        Inscription selected = inscriptionsTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Sélection requise", "Veuillez sélectionner une inscription à supprimer.");
            return;
        }

        new Thread(() -> {
            try {
                apiService.delete("/creche/inscription/" + selected.getId());
                Platform.runLater(() -> {
                    showInfo("Succès", "Inscription supprimée !");
                    handleRefresh();
                });
            } catch (Exception e) {
                Platform.runLater(() -> showError("Erreur", "Impossible de supprimer: " + e.getMessage()));
            }
        }).start();
    }

    @FXML
    private void handleAddReservation() {
        fetchOptionsAndShowDialog(true, null);
    }

    @FXML
    private void handleEditReservation() {
        Reservation selected = reservationsTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Sélection requise", "Veuillez sélectionner une réservation à modifier.");
            return;
        }
        fetchOptionsAndShowDialog(true, selected);
    }

    @FXML
    private void handleDeleteReservation() {
        Reservation selected = reservationsTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showWarning("Sélection requise", "Veuillez sélectionner une réservation à supprimer.");
            return;
        }

        new Thread(() -> {
            try {
                apiService.delete("/creche/reservation/" + selected.getId());
                Platform.runLater(() -> {
                    showInfo("Succès", "Réservation supprimée !");
                    handleRefresh();
                });
            } catch (Exception e) {
                Platform.runLater(() -> showError("Erreur", "Impossible de supprimer: " + e.getMessage()));
            }
        }).start();
    }

    private void showInscriptionDialog(Inscription existing, java.util.List<org.example.fripouilles.model.User> parents,
            java.util.List<org.example.fripouilles.model.creche.Enfant> enfants) {
        javafx.scene.control.Dialog<Inscription> dialog = new javafx.scene.control.Dialog<>();
        boolean isEdit = existing != null;
        dialog.setTitle(isEdit ? "Modifier Inscription" : "Ajouter Inscription");
        dialog.setHeaderText("Saisir les détails de l'inscription");

        javafx.scene.control.ButtonType saveBtnType = new javafx.scene.control.ButtonType("Enregistrer",
                javafx.scene.control.ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveBtnType, javafx.scene.control.ButtonType.CANCEL);

        javafx.scene.layout.GridPane grid = new javafx.scene.layout.GridPane();
        grid.setHgap(10);
        grid.setVgap(10);

        javafx.scene.control.ComboBox<org.example.fripouilles.model.creche.Enfant> enfantCombo = new javafx.scene.control.ComboBox<>();
        enfantCombo.getItems().addAll(enfants);
        if (!enfants.isEmpty())
            enfantCombo.getSelectionModel().selectFirst();
        javafx.scene.control.ComboBox<org.example.fripouilles.model.User> parentCombo = new javafx.scene.control.ComboBox<>();
        parentCombo.getItems().addAll(parents);
        if (!parents.isEmpty())
            parentCombo.getSelectionModel().selectFirst();

        javafx.scene.control.ComboBox<String> typeField = new javafx.scene.control.ComboBox<>();
        typeField.getItems().addAll("REGULIER", "OCCASIONNEL");
        typeField.setValue("REGULIER");

        javafx.scene.control.DatePicker dateDebutPicker = new javafx.scene.control.DatePicker();
        javafx.scene.control.DatePicker dateFinPicker = new javafx.scene.control.DatePicker();

        if (isEdit) {
            final int pId = existing.getParent() != null ? existing.getParent().getId() : -1;
            parents.stream().filter(p -> p.getId() == pId).findFirst().ifPresent(parentCombo::setValue);
            final int eId = existing.getEnfant() != null ? existing.getEnfant().getId() : -1;
            enfants.stream().filter(e -> e.getId() == eId).findFirst().ifPresent(enfantCombo::setValue);
            typeField.setValue(existing.getTypeAccueil());
            if (existing.getDateDebut() != null && !existing.getDateDebut().isEmpty()) {
                dateDebutPicker.setValue(ZonedDateTime.parse(existing.getDateDebut()).toLocalDate());
            }
            if (existing.getDateFin() != null && !existing.getDateFin().isEmpty()) {
                dateFinPicker.setValue(ZonedDateTime.parse(existing.getDateFin()).toLocalDate());
            }
        }

        grid.add(new javafx.scene.control.Label("Enfant:"), 0, 0);
        grid.add(enfantCombo, 1, 0);
        grid.add(new javafx.scene.control.Label("Parent:"), 0, 1);
        grid.add(parentCombo, 1, 1);
        grid.add(new javafx.scene.control.Label("Type Accueil:"), 0, 2);
        grid.add(typeField, 1, 2);
        grid.add(new javafx.scene.control.Label("Date Début:"), 0, 3);
        grid.add(dateDebutPicker, 1, 3);
        grid.add(new javafx.scene.control.Label("Date Fin:"), 0, 4);
        grid.add(dateFinPicker, 1, 4);

        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if (dialogButton == saveBtnType) {
                try {
                    String dD = dateDebutPicker.getValue() != null
                            ? dateDebutPicker.getValue().toString() + "T00:00:00Z"
                            : "";
                    String dF = dateFinPicker.getValue() != null ? dateFinPicker.getValue().toString() + "T00:00:00Z"
                            : null;

                    java.util.Map<String, Object> payload = new java.util.HashMap<>();
                    if (enfantCombo.getValue() != null)
                        payload.put("enfantId", enfantCombo.getValue().getId());
                    if (parentCombo.getValue() != null)
                        payload.put("parentId", parentCombo.getValue().getId());
                    payload.put("typeAccueil", typeField.getValue());
                    payload.put("dateDebut", dD);
                    if (dF != null)
                        payload.put("dateFin", dF);

                    new Thread(() -> {
                        try {
                            if (isEdit) {
                                apiService.put("/creche/inscription/" + existing.getId(), payload, Object.class);
                            } else {
                                apiService.post("/creche/inscription", payload, Object.class);
                            }
                            Platform.runLater(() -> {
                                showInfo("Succès", "Inscription enregistrée !");
                                handleRefresh();
                            });
                        } catch (Exception ex) {
                            Platform.runLater(() -> showError("Erreur", "Sauvegarde impossible: " + ex.getMessage()));
                        }
                    }).start();
                } catch (Exception ex) {
                    showError("Erreur", "Données invalides : " + ex.getMessage());
                }
            }
            return null;
        });

        dialog.showAndWait();
    }

    private void showReservationDialog(Reservation existing, java.util.List<org.example.fripouilles.model.User> parents,
            java.util.List<org.example.fripouilles.model.creche.Enfant> enfants) {
        javafx.scene.control.Dialog<Reservation> dialog = new javafx.scene.control.Dialog<>();
        boolean isEdit = existing != null;
        dialog.setTitle(isEdit ? "Modifier Réservation" : "Ajouter Réservation");
        dialog.setHeaderText("Saisir les détails de la réservation");

        javafx.scene.control.ButtonType saveBtnType = new javafx.scene.control.ButtonType("Enregistrer",
                javafx.scene.control.ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveBtnType, javafx.scene.control.ButtonType.CANCEL);

        javafx.scene.layout.GridPane grid = new javafx.scene.layout.GridPane();
        grid.setHgap(10);
        grid.setVgap(10);

        javafx.scene.control.ComboBox<org.example.fripouilles.model.creche.Enfant> enfantCombo = new javafx.scene.control.ComboBox<>();
        enfantCombo.getItems().addAll(enfants);
        if (!enfants.isEmpty())
            enfantCombo.getSelectionModel().selectFirst();
        javafx.scene.control.ComboBox<org.example.fripouilles.model.User> parentCombo = new javafx.scene.control.ComboBox<>();
        parentCombo.getItems().addAll(parents);
        if (!parents.isEmpty())
            parentCombo.getSelectionModel().selectFirst();

        javafx.scene.control.DatePicker datePicker = new javafx.scene.control.DatePicker();
        javafx.scene.control.TextField arriveeField = new javafx.scene.control.TextField();
        arriveeField.setPromptText("Arrivée (min - ex 480)");
        javafx.scene.control.TextField departField = new javafx.scene.control.TextField();
        departField.setPromptText("Départ (min - ex 1020)");

        if (isEdit) {
            final int pId = existing.getParent() != null ? existing.getParent().getId() : -1;
            parents.stream().filter(p -> p.getId() == pId).findFirst().ifPresent(parentCombo::setValue);
            final int eId = existing.getEnfant() != null ? existing.getEnfant().getId() : -1;
            enfants.stream().filter(e -> e.getId() == eId).findFirst().ifPresent(enfantCombo::setValue);
            if (existing.getDate() != null && !existing.getDate().isEmpty()) {
                datePicker.setValue(ZonedDateTime.parse(existing.getDate()).toLocalDate());
            }
            arriveeField.setText(String.valueOf(existing.getArriveeMinutes()));
            departField.setText(String.valueOf(existing.getDepartMinutes()));
        }

        grid.add(new javafx.scene.control.Label("Enfant:"), 0, 0);
        grid.add(enfantCombo, 1, 0);
        grid.add(new javafx.scene.control.Label("Parent:"), 0, 1);
        grid.add(parentCombo, 1, 1);
        grid.add(new javafx.scene.control.Label("Date:"), 0, 2);
        grid.add(datePicker, 1, 2);
        grid.add(new javafx.scene.control.Label("Arrivée (min):"), 0, 3);
        grid.add(arriveeField, 1, 3);
        grid.add(new javafx.scene.control.Label("Départ (min):"), 0, 4);
        grid.add(departField, 1, 4);

        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if (dialogButton == saveBtnType) {
                try {
                    String date = datePicker.getValue() != null ? datePicker.getValue().toString() + "T00:00:00Z" : "";

                    java.util.Map<String, Object> payload = new java.util.HashMap<>();
                    if (enfantCombo.getValue() != null)
                        payload.put("enfantId", enfantCombo.getValue().getId());
                    if (parentCombo.getValue() != null)
                        payload.put("parentId", parentCombo.getValue().getId());
                    payload.put("date", date);
                    payload.put("arriveeMinutes", Integer.parseInt(arriveeField.getText()));
                    payload.put("departMinutes", Integer.parseInt(departField.getText()));

                    new Thread(() -> {
                        try {
                            if (isEdit) {
                                apiService.put("/creche/reservation/" + existing.getId(), payload, Object.class);
                            } else {
                                apiService.post("/creche/reservation", payload, Object.class);
                            }
                            Platform.runLater(() -> {
                                showInfo("Succès", "Réservation enregistrée !");
                                handleRefresh();
                            });
                        } catch (Exception ex) {
                            Platform.runLater(() -> showError("Erreur", "Sauvegarde impossible: " + ex.getMessage()));
                        }
                    }).start();
                } catch (Exception ex) {
                    showError("Erreur", "Données invalides : " + ex.getMessage());
                }
            }
            return null;
        });

        dialog.showAndWait();
    }

    @FXML
    private void handleLogout() {
        authService.logout();

        Stage mainStage = (Stage) root.getScene().getWindow();
        loginStage.show();
        mainStage.close();
    }

    private void showError(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void showWarning(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void showInfo(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}