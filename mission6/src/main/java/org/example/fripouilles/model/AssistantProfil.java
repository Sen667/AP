package org.example.fripouilles.model;

public class AssistantProfil {
    private int id;
    private int utilisateurId;
    private String numeroAgrement;
    private String dateAgrement;
    private String dateRenouvellement;
    private int capaciteAccueil;
    private String adresse;
    private String ville;
    private String codePostal;
    private String telephone;
    private User utilisateur;

    public AssistantProfil() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(int utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public String getNumeroAgrement() {
        return numeroAgrement;
    }

    public void setNumeroAgrement(String numeroAgrement) {
        this.numeroAgrement = numeroAgrement;
    }

    public String getDateAgrement() {
        return dateAgrement;
    }

    public void setDateAgrement(String dateAgrement) {
        this.dateAgrement = dateAgrement;
    }

    public String getDateRenouvellement() {
        return dateRenouvellement;
    }

    public void setDateRenouvellement(String dateRenouvellement) {
        this.dateRenouvellement = dateRenouvellement;
    }

    public int getCapaciteAccueil() {
        return capaciteAccueil;
    }

    public void setCapaciteAccueil(int capaciteAccueil) {
        this.capaciteAccueil = capaciteAccueil;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public User getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(User utilisateur) {
        this.utilisateur = utilisateur;
    }
}
