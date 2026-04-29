package org.example.fripouilles.model.creche;

import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;

public class PlanningEnfant {
    private final StringProperty nom;
    private final StringProperty prenom;
    private final StringProperty type;
    private final StringProperty horaires;
    private final StringProperty motif;

    public PlanningEnfant(String nom, String prenom, String type, String horaires, String motif) {
        this.nom = new SimpleStringProperty(nom);
        this.prenom = new SimpleStringProperty(prenom);
        this.type = new SimpleStringProperty(type != null ? type : "");
        this.horaires = new SimpleStringProperty(horaires != null ? horaires : "—");
        this.motif = new SimpleStringProperty(motif != null ? motif : "—");
    }

    public String getNom()      { return nom.get(); }
    public String getPrenom()   { return prenom.get(); }
    public String getType()     { return type.get(); }
    public String getHoraires() { return horaires.get(); }
    public String getMotif()    { return motif.get(); }

    public StringProperty nomProperty()      { return nom; }
    public StringProperty prenomProperty()   { return prenom; }
    public StringProperty typeProperty()     { return type; }
    public StringProperty horairesProperty() { return horaires; }
    public StringProperty motifProperty()    { return motif; }
}
