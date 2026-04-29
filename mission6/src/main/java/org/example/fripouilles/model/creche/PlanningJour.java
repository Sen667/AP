package org.example.fripouilles.model.creche;

import java.util.List;

public class PlanningJour {
    private String date;
    private int totalCapacite;
    private int nbPresents;
    private int placesDisponibles;
    private int nbAbsences;
    private List<PlanningEnfantRaw> presents;
    private List<PlanningEnfantRaw> absents;

    public String getDate()              { return date; }
    public int getTotalCapacite()        { return totalCapacite; }
    public int getNbPresents()           { return nbPresents; }
    public int getPlacesDisponibles()    { return placesDisponibles; }
    public int getNbAbsences()           { return nbAbsences; }
    public List<PlanningEnfantRaw> getPresents() { return presents; }
    public List<PlanningEnfantRaw> getAbsents()  { return absents; }

    /** Gson-deserializable inner class matching the API JSON shape */
    public static class PlanningEnfantRaw {
        private String nom;
        private String prenom;
        private String type;
        private String horaires;
        private String motif;

        public String getNom()      { return nom; }
        public String getPrenom()   { return prenom; }
        public String getType()     { return type; }
        public String getHoraires() { return horaires; }
        public String getMotif()    { return motif; }
    }
}
