package org.example.fripouilles.model;

public class Contrat {
    private int id;
    private int enfantId;
    private int parentId;
    private int assistantId;
    private String dateDebut;
    private String dateFin;
    private String statut;
    private double tarifHoraireBrut;
    private double nombreHeuresSemaine;
    private double indemniteEntretien;
    private double indemniteRepas;
    private Double indemniteKm;
    
    // Relations
    private Enfant enfant;
    private ParentProfil parent;
    private AssistantProfil assistant;

    public Contrat() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEnfantId() {
        return enfantId;
    }

    public void setEnfantId(int enfantId) {
        this.enfantId = enfantId;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public int getAssistantId() {
        return assistantId;
    }

    public void setAssistantId(int assistantId) {
        this.assistantId = assistantId;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(String dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getDateFin() {
        return dateFin;
    }

    public void setDateFin(String dateFin) {
        this.dateFin = dateFin;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public double getTarifHoraireBrut() {
        return tarifHoraireBrut;
    }

    public void setTarifHoraireBrut(double tarifHoraireBrut) {
        this.tarifHoraireBrut = tarifHoraireBrut;
    }

    public double getNombreHeuresSemaine() {
        return nombreHeuresSemaine;
    }

    public void setNombreHeuresSemaine(double nombreHeuresSemaine) {
        this.nombreHeuresSemaine = nombreHeuresSemaine;
    }

    public double getIndemniteEntretien() {
        return indemniteEntretien;
    }

    public void setIndemniteEntretien(double indemniteEntretien) {
        this.indemniteEntretien = indemniteEntretien;
    }

    public double getIndemniteRepas() {
        return indemniteRepas;
    }

    public void setIndemniteRepas(double indemniteRepas) {
        this.indemniteRepas = indemniteRepas;
    }

    public Double getIndemniteKm() {
        return indemniteKm;
    }

    public void setIndemniteKm(Double indemniteKm) {
        this.indemniteKm = indemniteKm;
    }

    public Enfant getEnfant() {
        return enfant;
    }

    public void setEnfant(Enfant enfant) {
        this.enfant = enfant;
    }

    public ParentProfil getParent() {
        return parent;
    }

    public void setParent(ParentProfil parent) {
        this.parent = parent;
    }

    public AssistantProfil getAssistant() {
        return assistant;
    }

    public void setAssistant(AssistantProfil assistant) {
        this.assistant = assistant;
    }

    @Override
    public String toString() {
        String parentNom = (parent != null && parent.getUtilisateur() != null) 
            ? parent.getUtilisateur().getNom() + " " + parent.getUtilisateur().getPrenom() 
            : "Parent inconnu";
        String assistantNom = (assistant != null && assistant.getUtilisateur() != null) 
            ? assistant.getUtilisateur().getNom() + " " + assistant.getUtilisateur().getPrenom() 
            : "Assistant inconnu";
        String enfantNom = (enfant != null) 
            ? enfant.getPrenom() + " " + enfant.getNom() 
            : "Enfant inconnu";
        
        return "Contrat #" + id + " - " + enfantNom + " (Parent: " + parentNom + " / Assistant: " + assistantNom + ")";
    }
}
