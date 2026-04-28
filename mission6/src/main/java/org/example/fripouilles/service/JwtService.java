package org.example.fripouilles.service;

/**
 * Service pour gérer le JWT (JSON Web Token)
 * Stocke temporairement le token pour la session en cours
 */
public class JwtService {
    private static JwtService instance;
    private String token;
    private String userRole;
    private int userId;

    private JwtService() {
    }

    public static JwtService getInstance() {
        if (instance == null) {
            instance = new JwtService();
        }
        return instance;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public boolean isAuthenticated() {
        return token != null && !token.isEmpty();
    }

    public void clearSession() {
        token = null;
        userRole = null;
        userId = 0;
    }
}
