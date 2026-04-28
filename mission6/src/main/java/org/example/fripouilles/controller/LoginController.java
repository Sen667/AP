package org.example.fripouilles.controller;

import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;

import org.example.fripouilles.service.AuthService;

import java.io.IOException;
import java.util.Objects;

public class LoginController {

    @FXML
    private VBox root;

    @FXML
    private TextField emailField;

    @FXML
    private PasswordField passwordField;

    private final AuthService authService;
    private Stage primaryStage;

    public LoginController() {
        this.authService = new AuthService();
    }

    public void setPrimaryStage(Stage primaryStage) {
        this.primaryStage = primaryStage;
    }

    @FXML
    public void initialize() {
        Platform.runLater(() -> {
            Rectangle clip = new Rectangle();
            clip.widthProperty().bind(root.widthProperty());
            clip.heightProperty().bind(root.heightProperty());
            clip.setArcWidth(20);
            clip.setArcHeight(20);
            root.setClip(clip);
        });
    }

    @FXML
    private void handleLogin() {
        String email = emailField.getText().trim();
        String password = passwordField.getText();

        if (email.isEmpty() || password.isEmpty()) {
            showError("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        try {
            authService.login(email, password);

            openMainWindow();

        } catch (IOException e) {
            e.printStackTrace();
            showError("Erreur de connexion", "Impossible de se connecter au serveur.\n" + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            showError("Erreur inattendue", "Une erreur s'est produite: " + e.getMessage());
        }
    }

    @FXML
    private void handleCancel() {
        Stage stage = (Stage) emailField.getScene().getWindow();
        stage.close();
    }

    private void openMainWindow() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/org/example/fripouilles/main-view.fxml"));
            Parent mainRoot = loader.load();

            MainController mainController = loader.getController();
            mainController.setLoginStage((Stage) emailField.getScene().getWindow());

            Scene scene = new Scene(mainRoot, 1200, 700);
            scene.setFill(javafx.scene.paint.Color.TRANSPARENT);

            Stage stage = new Stage();
            stage.initStyle(javafx.stage.StageStyle.TRANSPARENT);
            stage.getIcons().add(new javafx.scene.image.Image(
                    Objects.requireNonNull(
                            getClass().getResourceAsStream("/org/example/fripouilles/assets/fripouilles.png"))));
            stage.setTitle("RAM Les Fripouilles - Gestion des Paies");
            stage.setScene(scene);
            stage.show();

            // Cacher le login (pas fermer, pour pouvoir le réutiliser à la déco)
            Stage loginStage = (Stage) emailField.getScene().getWindow();
            loginStage.hide();

        } catch (IOException e) {
            showError("Erreur", "Impossible d'ouvrir la fenêtre principale: " + e.getMessage());
        }
    }

    private void showError(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}