package org.example.fripouilles.model.creche;

public class Reservation {
    private int id;
    private String date;
    private int arriveeMinutes;
    private int departMinutes;
    private String statut;
    private double montant;
    private Enfant enfant;
    private org.example.fripouilles.model.User parent;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public org.example.fripouilles.model.User getParent() {
        return parent;
    }

    public void setParent(org.example.fripouilles.model.User parent) {
        this.parent = parent;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getArriveeMinutes() {
        return arriveeMinutes;
    }

    public void setArriveeMinutes(int arriveeMinutes) {
        this.arriveeMinutes = arriveeMinutes;
    }

    public int getDepartMinutes() {
        return departMinutes;
    }

    public void setDepartMinutes(int departMinutes) {
        this.departMinutes = departMinutes;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public Enfant getEnfant() {
        return enfant;
    }

    public void setEnfant(Enfant enfant) {
        this.enfant = enfant;
    }

    public String getHorairesFormatted() {
        int hArr = arriveeMinutes / 60;
        int mArr = arriveeMinutes % 60;
        int hDep = departMinutes / 60;
        int mDep = departMinutes % 60;
        return String.format("%02d:%02d - %02d:%02d", hArr, mArr, hDep, mDep);
    }
}
