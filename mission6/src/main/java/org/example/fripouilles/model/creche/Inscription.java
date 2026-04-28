package org.example.fripouilles.model.creche;

public class Inscription {
    private int id;
    private String typeAccueil;
    private String dateDebut;
    private String dateFin;
    private String statut;
    private Enfant enfant;
    private org.example.fripouilles.model.User parent;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDateFin() {
        return dateFin;
    }

    public void setDateFin(String dateFin) {
        this.dateFin = dateFin;
    }

    public org.example.fripouilles.model.User getParent() {
        return parent;
    }

    public void setParent(org.example.fripouilles.model.User parent) {
        this.parent = parent;
    }

    public String getTypeAccueil() {
        return typeAccueil;
    }

    public void setTypeAccueil(String typeAccueil) {
        this.typeAccueil = typeAccueil;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(String dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Enfant getEnfant() {
        return enfant;
    }

    public void setEnfant(Enfant enfant) {
        this.enfant = enfant;
    }
}
