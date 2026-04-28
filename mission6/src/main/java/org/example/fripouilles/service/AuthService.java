package org.example.fripouilles.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.example.fripouilles.model.User;

import java.io.IOException;

public class AuthService {
    private final ApiService apiService;
    private final JwtService jwtService;
    private final Gson gson;

    public AuthService() {
        this.apiService = new ApiService();
        this.jwtService = JwtService.getInstance();
        this.gson = new Gson();
    }

    /**
     * Connecte un utilisateur avec email et mot de passe
     */
    public User login(String email, String password) throws IOException {
        JsonObject credentials = new JsonObject();
        credentials.addProperty("email", email);
        credentials.addProperty("password", password);

        JsonObject response = apiService.post("/auth/login", credentials, JsonObject.class);

        if (response == null) {
            throw new IOException("La réponse de l'API est vide");
        }

        String token = response.get("token").getAsString();
        JsonObject userJson = response.getAsJsonObject("utilisateur");

        jwtService.setToken(token);
        jwtService.setUserRole(userJson.get("role").getAsString());
        jwtService.setUserId(userJson.get("id").getAsInt());

        return gson.fromJson(userJson, User.class);
    }

    public void logout() {
        jwtService.clearSession();
    }

    public boolean isAuthenticated() {
        return jwtService.isAuthenticated();
    }
}