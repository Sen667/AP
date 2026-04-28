package org.example.fripouilles.model;

public class Paie {
    private int id;
    private int contratId;
    private int mois;
    private int annee;
    private double heuresNormales;
    private double heuresMajorees;
    private double salaireBrut;
    private double salaireNet;
    private double chargesPatronales;
    private double chargesSalariales;
    private Double priseEnChargeCAF;
    private String commentaire;
    private String createdAt;
    private String updatedAt;
    
    // Relation
    private Contrat contrat;

    public Paie() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getContratId() {
        return contratId;
    }

    public void setContratId(int contratId) {
        this.contratId = contratId;
    }

    public int getMois() {
        return mois;
    }

    public void setMois(int mois) {
        this.mois = mois;
    }

    public int getAnnee() {
        return annee;
    }

    public void setAnnee(int annee) {
        this.annee = annee;
    }

    public double getHeuresNormales() {
        return heuresNormales;
    }

    public void setHeuresNormales(double heuresNormales) {
        this.heuresNormales = heuresNormales;
    }

    public double getHeuresMajorees() {
        return heuresMajorees;
    }

    public void setHeuresMajorees(double heuresMajorees) {
        this.heuresMajorees = heuresMajorees;
    }

    public double getSalaireBrut() {
        return salaireBrut;
    }

    public void setSalaireBrut(double salaireBrut) {
        this.salaireBrut = salaireBrut;
    }

    public double getSalaireNet() {
        return salaireNet;
    }

    public void setSalaireNet(double salaireNet) {
        this.salaireNet = salaireNet;
    }

    public double getChargesPatronales() {
        return chargesPatronales;
    }

    public void setChargesPatronales(double chargesPatronales) {
        this.chargesPatronales = chargesPatronales;
    }

    public double getChargesSalariales() {
        return chargesSalariales;
    }

    public void setChargesSalariales(double chargesSalariales) {
        this.chargesSalariales = chargesSalariales;
    }

    public Double getPriseEnChargeCAF() {
        return priseEnChargeCAF;
    }

    public void setPriseEnChargeCAF(Double priseEnChargeCAF) {
        this.priseEnChargeCAF = priseEnChargeCAF;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Contrat getContrat() {
        return contrat;
    }

    public void setContrat(Contrat contrat) {
        this.contrat = contrat;
    }

    public double getTotalHeures() {
        return heuresNormales + heuresMajorees;
    }

    @Override
    public String toString() {
        return "Paie #" + id + " - " + mois + "/" + annee + " - " + salaireNet + "€ net";
    }
}
