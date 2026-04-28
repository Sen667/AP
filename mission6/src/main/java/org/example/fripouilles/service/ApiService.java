package org.example.fripouilles.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import okhttp3.*;

import java.io.IOException;
import java.lang.reflect.Type;

public class ApiService {
    // URL de base de l'API avec IPv4 explicite
    private static final String BASE_URL = "http://127.0.0.1:3000/api";
    private static final MediaType JSON = MediaType.get("application/json");

    private final Gson gson;
    private final JwtService jwtService;
    private final OkHttpClient client;

    public ApiService() {
        this.gson = new GsonBuilder().create();
        this.jwtService = JwtService.getInstance();
        this.client = new OkHttpClient();
    }

    public <T> T get(String endpoint, Class<T> responseClass) throws IOException {
        return execute(buildRequest(endpoint).get().build(), responseClass);
    }

    public <T> T get(String endpoint, Type type) throws IOException {
        return execute(buildRequest(endpoint).get().build(), type);
    }

    public <T> T post(String endpoint, Object body, Class<T> responseClass) throws IOException {
        return execute(buildRequest(endpoint).post(toBody(body)).build(), responseClass);
    }

    public <T> T put(String endpoint, Object body, Class<T> responseClass) throws IOException {
        return execute(buildRequest(endpoint).put(toBody(body)).build(), responseClass);
    }

    public <T> T patch(String endpoint, Object body, Class<T> responseClass) throws IOException {
        return execute(buildRequest(endpoint).patch(toBody(body)).build(), responseClass);
    }

    public void delete(String endpoint) throws IOException {
        execute(buildRequest(endpoint).delete().build(), Void.class);
    }

    private RequestBody toBody(Object body) {
        return RequestBody.create(body != null ? gson.toJson(body) : "", JSON);
    }

    private Request.Builder buildRequest(String endpoint) {
        Request.Builder builder = new Request.Builder()
                .url(BASE_URL + endpoint)
                .header("Content-Type", "application/json");

        if (jwtService.isAuthenticated()) {
            builder.header("Authorization", "Bearer " + jwtService.getToken());
        }

        return builder;
    }

    private <T> T execute(Request request, Class<T> responseClass) throws IOException {
        try (Response response = client.newCall(request).execute()) {
            String body = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                throw new IOException("Erreur HTTP " + response.code() + ": " + body);
            }
            return gson.fromJson(body, responseClass);
        }
    }

    private <T> T execute(Request request, Type type) throws IOException {
        try (Response response = client.newCall(request).execute()) {
            String body = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                throw new IOException("Erreur HTTP " + response.code() + ": " + body);
            }
            return gson.fromJson(body, type);
        }
    }
}