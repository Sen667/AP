-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARENT', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "Sexe" AS ENUM ('MASCULIN', 'FEMININ');

-- CreateEnum
CREATE TYPE "StatutValidation" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REFUSE');

-- CreateEnum
CREATE TYPE "StatutContrat" AS ENUM ('EN_ATTENTE_VALIDATION', 'ACTIF', 'SUSPENDU', 'TERMINE');

-- CreateEnum
CREATE TYPE "TypeAccueilCreche" AS ENUM ('REGULIER', 'OCCASIONNEL');

-- CreateEnum
CREATE TYPE "StatutInscription" AS ENUM ('ACTIVE', 'SUSPENDUE', 'TERMINEE');

-- CreateEnum
CREATE TYPE "TypePublicAtelier" AS ENUM ('ENFANT', 'PARENT_UNIQUEMENT', 'ASSISTANT_UNIQUEMENT', 'MIXTE');

-- CreateEnum
CREATE TYPE "TypeAction" AS ENUM ('AJOUT', 'MODIFICATION', 'SUPPRESSION');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('SUIVI_GARDE', 'SUIVI_JOURNALIER', 'CONTRAT', 'RESERVATION_CRECHE');

-- CreateEnum
CREATE TYPE "JourSemaine" AS ENUM ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "prenom" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "sexe" "Sexe" NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents_profil" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "adresse" VARCHAR(255) NOT NULL,
    "codePostal" VARCHAR(10) NOT NULL,
    "ville" VARCHAR(255) NOT NULL,
    "situationFamiliale" VARCHAR(100),
    "profession" VARCHAR(255),
    "employeur" VARCHAR(255),
    "beneficiaireCAF" BOOLEAN NOT NULL DEFAULT false,
    "numeroAllocataire" TEXT,
    "contactUrgenceNom" VARCHAR(255) NOT NULL,
    "contactUrgenceTel" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assistants_profil" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "adresse" VARCHAR(255) NOT NULL,
    "codePostal" VARCHAR(10) NOT NULL,
    "ville" VARCHAR(255) NOT NULL,
    "numeroAgrement" TEXT NOT NULL,
    "dateObtentionAgrement" TIMESTAMP(3) NOT NULL,
    "dateFinAgrement" TIMESTAMP(3),
    "capaciteAccueil" INTEGER NOT NULL,
    "experience" INTEGER,
    "disponibilites" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assistants_profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enfants" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "prenom" VARCHAR(255) NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "sexe" "Sexe" NOT NULL,
    "allergies" TEXT,
    "remarquesMedicales" TEXT,
    "medecinTraitant" VARCHAR(255) NOT NULL,
    "medecinTraitantTel" VARCHAR(20) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enfants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liens_parent_enfant" (
    "parentId" INTEGER NOT NULL,
    "enfantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "liens_parent_enfant_pkey" PRIMARY KEY ("parentId","enfantId")
);

-- CreateTable
CREATE TABLE "personnes_autorisees" (
    "id" SERIAL NOT NULL,
    "enfantId" INTEGER NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "prenom" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "lien" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personnes_autorisees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contrats_garde" (
    "id" SERIAL NOT NULL,
    "enfantId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    "assistantId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "statut" "StatutContrat" NOT NULL,
    "tarifHoraireBrut" DECIMAL(10,2) NOT NULL,
    "nombreHeuresSemaine" DECIMAL(5,2) NOT NULL,
    "indemniteEntretien" DECIMAL(10,2) NOT NULL,
    "indemniteRepas" DECIMAL(10,2) NOT NULL,
    "indemniteKm" DECIMAL(10,2),
    "revocation_demandee_par" "Role",
    "revocation_statut" "StatutValidation",
    "revocation_date_demande" TIMESTAMP(3),
    "revocation_motif" TEXT,
    "revocation_date_validation" TIMESTAMP(3),
    "revocation_commentaire_parent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contrats_garde_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suivis_garde_assistants" (
    "id" SERIAL NOT NULL,
    "contratId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "arriveeMinutes" INTEGER,
    "departMinutes" INTEGER,
    "repasFournis" INTEGER NOT NULL DEFAULT 0,
    "fraisDivers" DECIMAL(10,2),
    "km" DECIMAL(10,2),
    "statut" "StatutValidation" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateValidation" TIMESTAMP(3),
    "commentairesParent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suivis_garde_assistants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paies" (
    "id" SERIAL NOT NULL,
    "contratId" INTEGER NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "heuresNormales" DECIMAL(10,2) NOT NULL,
    "heuresMajorees" DECIMAL(10,2) NOT NULL,
    "salaireBrut" DECIMAL(10,2) NOT NULL,
    "salaireNet" DECIMAL(10,2) NOT NULL,
    "chargesPatronales" DECIMAL(10,2) NOT NULL,
    "chargesSalariales" DECIMAL(10,2) NOT NULL,
    "priseEnChargeCAF" DECIMAL(10,2),
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ateliers" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "debutMinutes" INTEGER NOT NULL,
    "finMinutes" INTEGER NOT NULL,
    "dateLimiteInscription" TIMESTAMP(3) NOT NULL,
    "nombrePlaces" INTEGER NOT NULL,
    "lieu" VARCHAR(255) NOT NULL,
    "typePublic" "TypePublicAtelier" NOT NULL,
    "ageMinMois" INTEGER,
    "ageMaxMois" INTEGER,
    "animateurId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ateliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions_ateliers" (
    "id" SERIAL NOT NULL,
    "atelierId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "enfantId" INTEGER,
    "assistantId" INTEGER,
    "present" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "inscriptions_ateliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametres_structure" (
    "id" SERIAL NOT NULL,
    "capaciteCreche" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parametres_structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions_creche" (
    "id" SERIAL NOT NULL,
    "enfantId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    "typeAccueil" "TypeAccueilCreche" NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "statut" "StatutInscription" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "inscriptions_creche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jours_reservation_creche" (
    "id" SERIAL NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "jourSemaine" "JourSemaine" NOT NULL,

    CONSTRAINT "jours_reservation_creche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations_creche" (
    "id" SERIAL NOT NULL,
    "enfantId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "arriveeMinutes" INTEGER NOT NULL,
    "departMinutes" INTEGER NOT NULL,
    "statut" "StatutValidation" NOT NULL DEFAULT 'EN_ATTENTE',
    "montant" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "reservations_creche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suivi_journalier_enfants" (
    "id" SERIAL NOT NULL,
    "enfantId" INTEGER NOT NULL,
    "assistantId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature" DECIMAL(4,1),
    "humeur" VARCHAR(255),
    "repas" VARCHAR(255),
    "sieste" VARCHAR(255),
    "remarques" TEXT,

    CONSTRAINT "suivi_journalier_enfants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historique" (
    "id" SERIAL NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "modifieParParentId" INTEGER,
    "action" "TypeAction" NOT NULL,
    "beforeData" JSONB,
    "afterData" JSONB,
    "suiviGardeAssistantId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Historique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametres_legaux" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "valeur" DECIMAL(10,2) NOT NULL,
    "valeurNet" DECIMAL(10,2),
    "description" TEXT,
    "dateMiseEnVigueur" TIMESTAMP(3) NOT NULL,
    "dateFinVigueur" TIMESTAMP(3),

    CONSTRAINT "parametres_legaux_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE INDEX "utilisateurs_role_idx" ON "utilisateurs"("role");

-- CreateIndex
CREATE UNIQUE INDEX "parents_profil_utilisateurId_key" ON "parents_profil"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "assistants_profil_utilisateurId_key" ON "assistants_profil"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "assistants_profil_numeroAgrement_key" ON "assistants_profil"("numeroAgrement");

-- CreateIndex
CREATE INDEX "enfants_deletedAt_idx" ON "enfants"("deletedAt");

-- CreateIndex
CREATE INDEX "enfants_dateNaissance_idx" ON "enfants"("dateNaissance");

-- CreateIndex
CREATE INDEX "contrats_garde_assistantId_idx" ON "contrats_garde"("assistantId");

-- CreateIndex
CREATE INDEX "contrats_garde_parentId_idx" ON "contrats_garde"("parentId");

-- CreateIndex
CREATE INDEX "suivis_garde_assistants_date_idx" ON "suivis_garde_assistants"("date");

-- CreateIndex
CREATE UNIQUE INDEX "suivis_garde_assistants_contratId_date_key" ON "suivis_garde_assistants"("contratId", "date");

-- CreateIndex
CREATE INDEX "paies_annee_mois_idx" ON "paies"("annee", "mois");

-- CreateIndex
CREATE UNIQUE INDEX "paies_contratId_mois_annee_key" ON "paies"("contratId", "mois", "annee");

-- CreateIndex
CREATE INDEX "ateliers_date_idx" ON "ateliers"("date");

-- CreateIndex
CREATE INDEX "inscriptions_ateliers_atelierId_idx" ON "inscriptions_ateliers"("atelierId");

-- CreateIndex
CREATE INDEX "inscriptions_ateliers_parentId_idx" ON "inscriptions_ateliers"("parentId");

-- CreateIndex
CREATE INDEX "inscriptions_ateliers_enfantId_idx" ON "inscriptions_ateliers"("enfantId");

-- CreateIndex
CREATE INDEX "inscriptions_ateliers_assistantId_idx" ON "inscriptions_ateliers"("assistantId");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_ateliers_atelierId_enfantId_key" ON "inscriptions_ateliers"("atelierId", "enfantId");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_ateliers_atelierId_assistantId_key" ON "inscriptions_ateliers"("atelierId", "assistantId");

-- CreateIndex
CREATE UNIQUE INDEX "jours_reservation_creche_inscriptionId_jourSemaine_key" ON "jours_reservation_creche"("inscriptionId", "jourSemaine");

-- CreateIndex
CREATE INDEX "reservations_creche_date_idx" ON "reservations_creche"("date");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_creche_enfantId_date_key" ON "reservations_creche"("enfantId", "date");

-- CreateIndex
CREATE INDEX "suivi_journalier_enfants_date_idx" ON "suivi_journalier_enfants"("date");

-- CreateIndex
CREATE INDEX "suivi_journalier_enfants_assistantId_idx" ON "suivi_journalier_enfants"("assistantId");

-- CreateIndex
CREATE UNIQUE INDEX "suivi_journalier_enfants_enfantId_date_key" ON "suivi_journalier_enfants"("enfantId", "date");

-- CreateIndex
CREATE INDEX "Historique_entityType_entityId_idx" ON "Historique"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "parametres_legaux_nom_dateMiseEnVigueur_idx" ON "parametres_legaux"("nom", "dateMiseEnVigueur");

-- AddForeignKey
ALTER TABLE "parents_profil" ADD CONSTRAINT "parents_profil_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistants_profil" ADD CONSTRAINT "assistants_profil_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liens_parent_enfant" ADD CONSTRAINT "liens_parent_enfant_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents_profil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liens_parent_enfant" ADD CONSTRAINT "liens_parent_enfant_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnes_autorisees" ADD CONSTRAINT "personnes_autorisees_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrats_garde" ADD CONSTRAINT "contrats_garde_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrats_garde" ADD CONSTRAINT "contrats_garde_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents_profil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrats_garde" ADD CONSTRAINT "contrats_garde_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "assistants_profil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suivis_garde_assistants" ADD CONSTRAINT "suivis_garde_assistants_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "contrats_garde"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paies" ADD CONSTRAINT "paies_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "contrats_garde"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ateliers" ADD CONSTRAINT "ateliers_animateurId_fkey" FOREIGN KEY ("animateurId") REFERENCES "assistants_profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions_ateliers" ADD CONSTRAINT "inscriptions_ateliers_atelierId_fkey" FOREIGN KEY ("atelierId") REFERENCES "ateliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions_ateliers" ADD CONSTRAINT "inscriptions_ateliers_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents_profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions_ateliers" ADD CONSTRAINT "inscriptions_ateliers_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions_ateliers" ADD CONSTRAINT "inscriptions_ateliers_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "assistants_profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions_creche" ADD CONSTRAINT "inscriptions_creche_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions_creche" ADD CONSTRAINT "inscriptions_creche_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents_profil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jours_reservation_creche" ADD CONSTRAINT "jours_reservation_creche_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "inscriptions_creche"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations_creche" ADD CONSTRAINT "reservations_creche_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations_creche" ADD CONSTRAINT "reservations_creche_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents_profil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suivi_journalier_enfants" ADD CONSTRAINT "suivi_journalier_enfants_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suivi_journalier_enfants" ADD CONSTRAINT "suivi_journalier_enfants_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "assistants_profil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historique" ADD CONSTRAINT "Historique_modifieParParentId_fkey" FOREIGN KEY ("modifieParParentId") REFERENCES "parents_profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historique" ADD CONSTRAINT "Historique_suiviGardeAssistantId_fkey" FOREIGN KEY ("suiviGardeAssistantId") REFERENCES "suivis_garde_assistants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
