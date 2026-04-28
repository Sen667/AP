import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import {
  EntityType,
  JourSemaine,
  Role,
  Sexe,
  StatutContrat,
  StatutInscription,
  StatutValidation,
  TypeAccueilCreche,
  TypeAction,
  TypePublicAtelier,
} from '../generated/types/enums';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  try {
    console.log('🌱 Démarrage du seeding...');

    const addDays = (baseDate: Date, days: number) => {
      const date = new Date(baseDate);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + days);
      return date;
    };

    const today = new Date();

    // Rend le seed idempotent: on repart d'une base applicative vide.
    const tables = [
      'historiques',
      'suivi_journalier_enfants',
      'reservations_creche',
      'jours_reservation_creche',
      'inscriptions_creche',
      'inscriptions_ateliers',
      'ateliers',
      'paies',
      'suivis_garde_assistants',
      'contrats_garde',
      'personnes_autorisees',
      'liens_parent_enfant',
      'enfants',
      'assistants_profil',
      'parents_profil',
      'parametres_structure',
      'parametres_legaux',
      'utilisateurs',
    ];

    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${tables.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE;`,
    );

    const adminPassword = await bcrypt.hash('Admin2026!', 12);
    const adminRamPassword = await bcrypt.hash('Admin123!', 12);

    await Promise.all([
      prisma.utilisateur.create({
        data: {
          nom: 'Admin RAM',
          prenom: 'Admin',
          telephone: '0321910003',
          dateNaissance: new Date('1980-01-01'),
          email: 'admin@ram.fr',
          password: adminRamPassword,
          role: Role.ADMIN,
          sexe: Sexe.MASCULIN,
        },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Administrateur',
          prenom: 'Admin',
          telephone: '0321910000',
          dateNaissance: new Date('1980-01-01'),
          email: 'admin@fripouilles.fr',
          password: adminPassword,
          role: Role.ADMIN,
          sexe: Sexe.MASCULIN,
        },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Directrice',
          prenom: 'Claire',
          telephone: '0321910001',
          dateNaissance: new Date('1975-06-15'),
          email: 'claire.directrice@fripouilles.fr',
          password: adminPassword,
          role: Role.ADMIN,
          sexe: Sexe.FEMININ,
        },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Responsable',
          prenom: 'Thomas',
          telephone: '0321910002',
          dateNaissance: new Date('1982-03-20'),
          email: 'thomas.responsable@fripouilles.fr',
          password: adminPassword,
          role: Role.ADMIN,
          sexe: Sexe.MASCULIN,
        },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ═════════════════════════ ASSISTANTS ═════════════════════
    // ═══════════════════════════════════════════════════════════
    const [assistant1, assistant2, assistant3, assistant4] = await Promise.all([
      prisma.utilisateur.create({
        data: {
          nom: 'Dupont',
          prenom: 'Sophie',
          telephone: '0601020304',
          dateNaissance: new Date('1990-05-15'),
          email: 'sophie.dupont@gmail.com',
          password: await bcrypt.hash('Sophie2026!', 12),
          role: Role.ASSISTANT,
          sexe: Sexe.FEMININ,
          assistantProfil: {
            create: {
              adresse: '15 Rue des Fleurs',
              ville: 'Calais',
              codePostal: '62100',
              numeroAgrement: 'AGR62001',
              dateObtentionAgrement: new Date('2015-06-01'),
              capaciteAccueil: 4,
              experience: 8,
              disponibilites:
                'Lundi au vendredi de 7h30 à 18h30. Jardin sécurisé.',
            },
          },
        },
        include: { assistantProfil: true },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Martin',
          prenom: 'Céline',
          telephone: '0605060708',
          dateNaissance: new Date('1985-10-20'),
          email: 'celine.martin@outlook.com',
          password: await bcrypt.hash('Celine2026!', 12),
          role: Role.ASSISTANT,
          sexe: Sexe.FEMININ,
          assistantProfil: {
            create: {
              adresse: '42 Avenue du Général de Gaulle',
              ville: 'Dunkerque',
              codePostal: '59140',
              numeroAgrement: 'AGR62002',
              dateObtentionAgrement: new Date('2018-03-15'),
              capaciteAccueil: 3,
              experience: 5,
              disponibilites: 'Lundi au vendredi de 8h à 18h.',
            },
          },
        },
        include: { assistantProfil: true },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Bernard',
          prenom: 'Isabelle',
          telephone: '0612345678',
          dateNaissance: new Date('1978-08-12'),
          email: 'isabelle.bernard@free.fr',
          password: await bcrypt.hash('Isabelle2026!', 12),
          role: Role.ASSISTANT,
          sexe: Sexe.FEMININ,
          assistantProfil: {
            create: {
              adresse: '8 Impasse des Lilas',
              ville: 'Arras',
              codePostal: '62000',
              numeroAgrement: 'AGR62003',
              dateObtentionAgrement: new Date('2010-09-01'),
              capaciteAccueil: 4,
              experience: 15,
              disponibilites: 'Lundi au vendredi de 7h à 19h.',
            },
          },
        },
        include: { assistantProfil: true },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Rousseau',
          prenom: 'Nathalie',
          telephone: '0698765432',
          dateNaissance: new Date('1988-02-28'),
          email: 'nathalie.rousseau@yahoo.fr',
          password: await bcrypt.hash('Nathalie2026!', 12),
          role: Role.ASSISTANT,
          sexe: Sexe.FEMININ,
          assistantProfil: {
            create: {
              adresse: '23 Rue Victor Hugo',
              ville: 'Le Touquet-Paris-Plage',
              codePostal: '62520',
              numeroAgrement: 'AGR62004',
              dateObtentionAgrement: new Date('2019-01-10'),
              capaciteAccueil: 3,
              experience: 6,
              disponibilites: 'Lundi, mardi, jeudi, vendredi de 8h à 17h30.',
            },
          },
        },
        include: { assistantProfil: true },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ══════════════════════════ PARENTS ══════════════════════
    // ═══════════════════════════════════════════════════════════
    const [parent1, parent2, parent3, parent4, parent5] = await Promise.all([
      prisma.utilisateur.create({
        data: {
          nom: 'Dubois',
          prenom: 'Marie',
          telephone: '0612345601',
          dateNaissance: new Date('1988-03-12'),
          email: 'marie.dubois@gmail.com',
          password: await bcrypt.hash('Marie2026!', 12),
          role: Role.PARENT,
          sexe: Sexe.FEMININ,
          parentProfil: {
            create: {
              adresse: '10 Rue de la République',
              codePostal: '62100',
              ville: 'Calais',
              situationFamiliale: 'En couple',
              profession: 'Infirmière',
              employeur: 'Centre Hospitalier de Calais',
              beneficiaireCAF: true,
              numeroAllocataire: 'CAF123456',
              contactUrgenceNom: 'Dubois Pierre',
              contactUrgenceTel: '0612345602',
            },
          },
        },
        include: { parentProfil: true },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Leroy',
          prenom: 'Thomas',
          telephone: '0623456701',
          dateNaissance: new Date('1985-07-20'),
          email: 'thomas.leroy@outlook.com',
          password: await bcrypt.hash('Thomas2026!', 12),
          role: Role.PARENT,
          sexe: Sexe.MASCULIN,
          parentProfil: {
            create: {
              adresse: '25 Avenue Jean Jaurès',
              codePostal: '59140',
              ville: 'Dunkerque',
              situationFamiliale: 'Marié',
              profession: 'Enseignant',
              employeur: 'Collège Victor Hugo',
              beneficiaireCAF: true,
              numeroAllocataire: 'CAF234567',
              contactUrgenceNom: 'Leroy Sophie',
              contactUrgenceTel: '0623456702',
            },
          },
        },
        include: { parentProfil: true },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Moreau',
          prenom: 'Julie',
          telephone: '0634567801',
          dateNaissance: new Date('1990-11-05'),
          email: 'julie.moreau@free.fr',
          password: await bcrypt.hash('Julie2026!', 12),
          role: Role.PARENT,
          sexe: Sexe.FEMININ,
          parentProfil: {
            create: {
              adresse: '18 Rue des Lilas',
              codePostal: '62000',
              ville: 'Arras',
              situationFamiliale: 'Célibataire',
              profession: 'Comptable',
              employeur: 'Cabinet Moreau & Associés',
              beneficiaireCAF: true,
              numeroAllocataire: 'CAF345678',
              contactUrgenceNom: 'Moreau Anne',
              contactUrgenceTel: '0634567802',
            },
          },
        },
        include: { parentProfil: true },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Simon',
          prenom: 'Laurent',
          telephone: '0645678901',
          dateNaissance: new Date('1982-04-15'),
          email: 'laurent.simon@yahoo.fr',
          password: await bcrypt.hash('Laurent2026!', 12),
          role: Role.PARENT,
          sexe: Sexe.MASCULIN,
          parentProfil: {
            create: {
              adresse: '30 Boulevard de la Mer',
              codePostal: '62520',
              ville: 'Le Touquet-Paris-Plage',
              situationFamiliale: 'Divorcé',
              profession: 'Kinésithérapeute',
              employeur: 'Cabinet libéral',
              beneficiaireCAF: false,
              contactUrgenceNom: 'Simon Claire',
              contactUrgenceTel: '0645678902',
            },
          },
        },
        include: { parentProfil: true },
      }),
      prisma.utilisateur.create({
        data: {
          nom: 'Laurent',
          prenom: 'Émilie',
          telephone: '0656789012',
          dateNaissance: new Date('1993-09-28'),
          email: 'emilie.laurent@gmail.com',
          password: await bcrypt.hash('Emilie2026!', 12),
          role: Role.PARENT,
          sexe: Sexe.FEMININ,
          parentProfil: {
            create: {
              adresse: '45 Rue du Port',
              codePostal: '62600',
              ville: 'Berck',
              situationFamiliale: 'En couple',
              profession: 'Pharmacienne',
              employeur: 'Pharmacie du Centre',
              beneficiaireCAF: true,
              numeroAllocataire: 'CAF456789',
              contactUrgenceNom: 'Laurent Paul',
              contactUrgenceTel: '0656789013',
            },
          },
        },
        include: { parentProfil: true },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ══════════════════════════ ENFANTS ══════════════════════
    // ═══════════════════════════════════════════════════════════
    const [
      enfant1,
      enfant2,
      enfant3,
      enfant4,
      enfant5,
      enfant6,
      enfant7,
      enfant8,
    ] = await Promise.all([
      // Enfants de Marie Dubois (parent1) - 2 enfants
      prisma.enfant.create({
        data: {
          nom: 'Dubois',
          prenom: 'Lucas',
          dateNaissance: new Date('2023-01-15'),
          sexe: Sexe.MASCULIN,
          allergies: 'Aucune allergie connue',
          remarquesMedicales: 'Aucune remarque particulière',
          medecinTraitant: 'Dr. Martin',
          medecinTraitantTel: '0321000001',
        },
      }),
      prisma.enfant.create({
        data: {
          nom: 'Dubois',
          prenom: 'Emma',
          dateNaissance: new Date('2021-06-20'),
          sexe: Sexe.FEMININ,
          allergies: 'Aucune allergie connue',
          remarquesMedicales: 'Aucune remarque particulière',
          medecinTraitant: 'Dr. Martin',
          medecinTraitantTel: '0321000001',
        },
      }),
      // Enfants de Thomas Leroy (parent2) - 2 enfants
      prisma.enfant.create({
        data: {
          nom: 'Leroy',
          prenom: 'Hugo',
          dateNaissance: new Date('2022-03-10'),
          sexe: Sexe.MASCULIN,
          allergies: 'Allergie aux arachides',
          remarquesMedicales: 'Asthme léger',
          medecinTraitant: 'Dr. Durand',
          medecinTraitantTel: '0321000002',
        },
      }),
      prisma.enfant.create({
        data: {
          nom: 'Leroy',
          prenom: 'Camille',
          dateNaissance: new Date('2023-11-08'),
          sexe: Sexe.FEMININ,
          allergies: 'Aucune allergie connue',
          remarquesMedicales: 'Aucune remarque particulière',
          medecinTraitant: 'Dr. Durand',
          medecinTraitantTel: '0321000002',
        },
      }),
      // Enfant de Julie Moreau (parent3) - 1 enfant
      prisma.enfant.create({
        data: {
          nom: 'Moreau',
          prenom: 'Léa',
          dateNaissance: new Date('2023-09-05'),
          sexe: Sexe.FEMININ,
          allergies: 'Aucune allergie connue',
          remarquesMedicales: 'Aucune remarque particulière',
          medecinTraitant: 'Dr. Bernard',
          medecinTraitantTel: '0321000003',
        },
      }),
      // Enfants de Laurent Simon (parent4) - 2 enfants
      prisma.enfant.create({
        data: {
          nom: 'Simon',
          prenom: 'Mathis',
          dateNaissance: new Date('2022-11-22'),
          sexe: Sexe.MASCULIN,
          allergies: 'Intolérance au lactose',
          remarquesMedicales: 'Régime sans lactose',
          medecinTraitant: 'Dr. Petit',
          medecinTraitantTel: '0321000004',
        },
      }),
      prisma.enfant.create({
        data: {
          nom: 'Simon',
          prenom: 'Zoé',
          dateNaissance: new Date('2023-07-12'),
          sexe: Sexe.FEMININ,
          allergies: 'Aucune allergie connue',
          remarquesMedicales: 'Aucune remarque particulière',
          medecinTraitant: 'Dr. Petit',
          medecinTraitantTel: '0321000004',
        },
      }),
      // Enfant d'Émilie Laurent (parent5) - 1 enfant
      prisma.enfant.create({
        data: {
          nom: 'Laurent',
          prenom: 'Chloé',
          dateNaissance: new Date('2021-08-14'),
          sexe: Sexe.FEMININ,
          allergies: 'Aucune allergie connue',
          remarquesMedicales: 'Aucune remarque particulière',
          medecinTraitant: 'Dr. Rousseau',
          medecinTraitantTel: '0321000005',
        },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ════════════════════ LIENS PARENT-ENFANT ════════════════
    // ═══════════════════════════════════════════════════════════
    await Promise.all([
      // Marie Dubois (parent1) → Lucas + Emma
      prisma.lienParentEnfant.create({
        data: { parentId: parent1.parentProfil!.id, enfantId: enfant1.id },
      }),
      prisma.lienParentEnfant.create({
        data: { parentId: parent1.parentProfil!.id, enfantId: enfant2.id },
      }),
      // Thomas Leroy (parent2) → Hugo + Camille
      prisma.lienParentEnfant.create({
        data: { parentId: parent2.parentProfil!.id, enfantId: enfant3.id },
      }),
      prisma.lienParentEnfant.create({
        data: { parentId: parent2.parentProfil!.id, enfantId: enfant4.id },
      }),
      // Julie Moreau (parent3) → Léa
      prisma.lienParentEnfant.create({
        data: { parentId: parent3.parentProfil!.id, enfantId: enfant5.id },
      }),
      // Laurent Simon (parent4) → Mathis + Zoé
      prisma.lienParentEnfant.create({
        data: { parentId: parent4.parentProfil!.id, enfantId: enfant6.id },
      }),
      prisma.lienParentEnfant.create({
        data: { parentId: parent4.parentProfil!.id, enfantId: enfant7.id },
      }),
      // Émilie Laurent (parent5) → Chloé
      prisma.lienParentEnfant.create({
        data: { parentId: parent5.parentProfil!.id, enfantId: enfant8.id },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ══════════════════ PERSONNES AUTORISÉES ═════════════════
    // ═══════════════════════════════════════════════════════════
    await Promise.all([
      // Pères/conjoints autorisés pour quelques enfants
      prisma.personneAutorisee.create({
        data: {
          enfantId: enfant1.id,
          nom: 'Dubois',
          prenom: 'Pierre',
          telephone: '0612345602',
          email: 'pierre.dubois@gmail.com',
          lien: 'Père',
        },
      }),
      prisma.personneAutorisee.create({
        data: {
          enfantId: enfant2.id,
          nom: 'Dubois',
          prenom: 'Pierre',
          telephone: '0612345602',
          email: 'pierre.dubois@gmail.com',
          lien: 'Père',
        },
      }),
      prisma.personneAutorisee.create({
        data: {
          enfantId: enfant3.id,
          nom: 'Leroy',
          prenom: 'Sophie',
          telephone: '0623456702',
          email: 'sophie.leroy@outlook.com',
          lien: 'Mère',
        },
      }),
      prisma.personneAutorisee.create({
        data: {
          enfantId: enfant5.id,
          nom: 'Moreau',
          prenom: 'Anne',
          telephone: '0634567802',
          email: 'anne.moreau@free.fr',
          lien: 'Grand-mère',
        },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ════════════════════ CONTRATS DE GARDE ══════════════════
    // ═══════════════════════════════════════════════════════════
    // Chaque assistant a exactement 2 contrats pour assurer un bon équilibre
    const [
      contrat1,
      contrat2,
      contrat3,
      contrat4,
      contrat5,
      contrat6,
      contrat7,
      contrat8,
    ] = await Promise.all([
      // Sophie (assistant1) - Contrat 1 : Lucas (enfant1)
      prisma.contratGarde.create({
        data: {
          enfantId: enfant1.id,
          parentId: parent1.parentProfil!.id,
          assistantId: assistant1.assistantProfil!.id,
          dateDebut: new Date('2026-01-01'),
          dateFin: null,
          statut: StatutContrat.ACTIF,
          tarifHoraireBrut: 4.5,
          nombreHeuresSemaine: 35,
          indemniteEntretien: 3.5,
          indemniteRepas: 5.0,
          indemniteKm: 0.5,
        },
      }),
      // Sophie (assistant1) - Contrat 2 : Chloé (enfant8)
      prisma.contratGarde.create({
        data: {
          enfantId: enfant8.id,
          parentId: parent5.parentProfil!.id,
          assistantId: assistant1.assistantProfil!.id,
          dateDebut: new Date('2026-01-20'),
          dateFin: null,
          statut: StatutContrat.ACTIF,
          tarifHoraireBrut: 4.6,
          nombreHeuresSemaine: 32,
          indemniteEntretien: 3.6,
          indemniteRepas: 5.2,
          indemniteKm: 0.55,
        },
      }),
      // Céline (assistant2) - Contrat 1 : Emma (enfant2)
      prisma.contratGarde.create({
        data: {
          enfantId: enfant2.id,
          parentId: parent1.parentProfil!.id,
          assistantId: assistant2.assistantProfil!.id,
          dateDebut: new Date('2025-06-01'),
          dateFin: null,
          statut: StatutContrat.ACTIF,
          tarifHoraireBrut: 4.5,
          nombreHeuresSemaine: 30,
          indemniteEntretien: 3.5,
          indemniteRepas: 5.0,
          indemniteKm: null,
        },
      }),
      // Céline (assistant2) - Contrat 2 : Léa (enfant5)
      prisma.contratGarde.create({
        data: {
          enfantId: enfant5.id,
          parentId: parent3.parentProfil!.id,
          assistantId: assistant2.assistantProfil!.id,
          dateDebut: new Date('2026-01-15'),
          dateFin: null,
          statut: StatutContrat.ACTIF,
          tarifHoraireBrut: 4.25,
          nombreHeuresSemaine: 25,
          indemniteEntretien: 3.25,
          indemniteRepas: 4.75,
          indemniteKm: null,
        },
      }),
      // Isabelle (assistant3) - Contrat 1 : Hugo (enfant3)
      prisma.contratGarde.create({
        data: {
          enfantId: enfant3.id,
          parentId: parent2.parentProfil!.id,
          assistantId: assistant3.assistantProfil!.id,
          dateDebut: new Date('2025-09-01'),
          dateFin: null,
          statut: StatutContrat.ACTIF,
          tarifHoraireBrut: 4.75,
          nombreHeuresSemaine: 40,
          indemniteEntretien: 3.75,
          indemniteRepas: 5.5,
          indemniteKm: null,
        },
      }),
      // Isabelle (assistant3) - Contrat 2 : Mathis (enfant6)
      prisma.contratGarde.create({
        data: {
          enfantId: enfant6.id,
          parentId: parent4.parentProfil!.id,
          assistantId: assistant3.assistantProfil!.id,
          dateDebut: new Date('2026-01-08'),
          dateFin: null,
          statut: StatutContrat.ACTIF,
          tarifHoraireBrut: 4.3,
          nombreHeuresSemaine: 28,
          indemniteEntretien: 3.3,
          indemniteRepas: 4.8,
          indemniteKm: null,
        },
      }),
      // Nathalie (assistant4) - Contrat 1 : Camille (enfant4)
      prisma.contratGarde.create({
        data: {
          enfantId: enfant4.id,
          parentId: parent2.parentProfil!.id,
          assistantId: assistant4.assistantProfil!.id,
          dateDebut: new Date('2025-11-01'),
          dateFin: null,
          statut: StatutContrat.ACTIF,
          tarifHoraireBrut: 5.0,
          nombreHeuresSemaine: 30,
          indemniteEntretien: 4.0,
          indemniteRepas: 6.0,
          indemniteKm: 0.6,
        },
      }),
      // Nathalie (assistant4) - Contrat 2 : Zoé (enfant7)
      prisma.contratGarde.create({
        data: {
          enfantId: enfant7.id,
          parentId: parent4.parentProfil!.id,
          assistantId: assistant4.assistantProfil!.id,
          dateDebut: new Date('2025-12-15'),
          dateFin: null,
          statut: StatutContrat.ACTIF,
          tarifHoraireBrut: 5.1,
          nombreHeuresSemaine: 33,
          indemniteEntretien: 4.1,
          indemniteRepas: 6.1,
          indemniteKm: 0.65,
        },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ══════════════════════ SUIVIS DE GARDE ══════════════════
    // ═══════════════════════════════════════════════════════════
    const suiviGardePromises: any[] = [];
    const dateDebut = new Date('2026-01-01');
    const dateFin = new Date('2026-02-15');

    // Tous les contrats ont des suivis de garde détaillés
    for (const contrat of [
      contrat1,
      contrat2,
      contrat3,
      contrat4,
      contrat5,
      contrat6,
      contrat7,
      contrat8,
    ]) {
      for (
        let d = new Date(dateDebut);
        d <= dateFin;
        d.setDate(d.getDate() + 1)
      ) {
        const jourSemaine = d.getDay();
        if (jourSemaine >= 1 && jourSemaine <= 5) {
          // Lundi à Vendredi
          const dateGarde = new Date(d);
          let statut: StatutValidation = StatutValidation.EN_ATTENTE;
          const randomSeed = dateGarde.getDate() % 10;
          if (randomSeed < 6) statut = StatutValidation.VALIDE;
          else if (randomSeed === 6) statut = StatutValidation.REFUSE;

          suiviGardePromises.push(
            prisma.suiviGardeAssistant.create({
              data: {
                contratId: contrat.id,
                date: dateGarde,
                arriveeMinutes: 480 + Math.floor(Math.random() * 30), // 8h00-8h30
                departMinutes: 1020 + Math.floor(Math.random() * 60), // 17h00-18h00
                repasFournis: Math.floor(Math.random() * 3), // 0-2 repas
                fraisDivers: Math.random() > 0.7 ? Math.random() * 15 + 5 : 0, // Parfois des frais divers
                km: Math.random() > 0.5 ? Math.random() * 20 + 5 : null, // Parfois des km
                statut,
                dateValidation:
                  statut === StatutValidation.VALIDE
                    ? new Date(dateGarde.getTime() + 86400000)
                    : null,
                commentairesParent:
                  statut === StatutValidation.VALIDE && Math.random() > 0.7
                    ? 'Merci pour votre travail'
                    : null,
              },
            }),
          );
        }
      }
    }

    await Promise.all(suiviGardePromises);

    // ═══════════════════════════════════════════════════════════
    // ══════════════════════════ PAIES ════════════════════════
    // ═══════════════════════════════════════════════════════════
    const paiePromises: any[] = [];
    // Toutes les assistantes avec des contrats ont des paies détaillées
    for (const assistant of [assistant1, assistant2, assistant3, assistant4]) {
      for (const mois of [1]) {
        // Paie de janvier 2026
        const contrats = await prisma.contratGarde.findMany({
          where: { assistantId: assistant.assistantProfil!.id },
        });

        for (const contrat of contrats) {
          const heuresNormales = Number(contrat.nombreHeuresSemaine) * 4.33; // Heures mensuelles
          const heuresMajorees = heuresNormales * 0.1; // 10% d'heures sup
          const tauxHoraire = Number(contrat.tarifHoraireBrut);
          const salaireBrut =
            heuresNormales * tauxHoraire + heuresMajorees * tauxHoraire * 1.25;
          const chargesSalariales = salaireBrut * 0.22;
          const chargesPatronales = salaireBrut * 0.42;
          const salaireNet = salaireBrut - chargesSalariales;

          paiePromises.push(
            prisma.paie.create({
              data: {
                contratId: contrat.id,
                mois,
                annee: 2026,
                heuresNormales,
                heuresMajorees,
                salaireBrut,
                salaireNet,
                chargesPatronales,
                chargesSalariales,
                priseEnChargeCAF:
                  Math.random() > 0.5 ? salaireBrut * 0.15 : null,
                commentaire: 'Paie du mois de janvier 2026',
              },
            }),
          );
        }
      }
    }

    await Promise.all(paiePromises);

    // ═══════════════════════════════════════════════════════════
    // ══════════════════════════ ATELIERS ═════════════════════
    // ═══════════════════════════════════════════════════════════
    const [atelier1, atelier2, atelier3, atelier4, atelier5, atelier6] =
      await Promise.all([
        // ── Ateliers ENFANT ─────────────────────────────────────
        prisma.atelier.create({
          data: {
            nom: 'Atelier Musique et Éveil',
            description:
              'Découverte des instruments et des rythmes pour les tout-petits',
            date: addDays(today, 7),
            debutMinutes: 600, // 10h00
            finMinutes: 690, // 11h30
            dateLimiteInscription: addDays(today, 3),
            nombrePlaces: 12,
            lieu: 'Salle polyvalente du R.A.M.',
            typePublic: TypePublicAtelier.ENFANT,
            ageMinMois: 6,
            ageMaxMois: 36,
            animateurId: assistant1.assistantProfil!.id,
          },
        }),
        prisma.atelier.create({
          data: {
            nom: 'Atelier Motricité Libre',
            description:
              'Parcours de motricité pour développer la coordination',
            date: addDays(today, 14),
            debutMinutes: 540, // 9h00
            finMinutes: 630, // 10h30
            dateLimiteInscription: addDays(today, 10),
            nombrePlaces: 10,
            lieu: 'Gymnase municipal',
            typePublic: TypePublicAtelier.ENFANT,
            ageMinMois: 12,
            ageMaxMois: 48,
            animateurId: assistant2.assistantProfil!.id,
          },
        }),
        // ── Ateliers PARENTS UNIQUEMENT ──────────────────────────
        prisma.atelier.create({
          data: {
            nom: 'Café des Parents',
            description:
              "Échange et partage d'expériences entre parents autour d'un café",
            date: addDays(today, 10),
            debutMinutes: 570, // 9h30
            finMinutes: 660, // 11h00
            dateLimiteInscription: addDays(today, 6),
            nombrePlaces: 20,
            lieu: 'Cafétéria du R.A.M.',
            typePublic: TypePublicAtelier.PARENT_UNIQUEMENT,
            animateurId: null,
          },
        }),
        prisma.atelier.create({
          data: {
            nom: 'Atelier Premiers Secours Enfants',
            description:
              "Formation aux gestes d'urgence dispensée par une infirmière du R.A.M.",
            date: addDays(today, 21),
            debutMinutes: 840, // 14h00
            finMinutes: 960, // 16h00
            dateLimiteInscription: addDays(today, 17),
            nombrePlaces: 14,
            lieu: 'Salle de réunion du R.A.M.',
            typePublic: TypePublicAtelier.PARENT_UNIQUEMENT,
            animateurId: null,
          },
        }),
        // ── Ateliers ASSISTANTS UNIQUEMENT ────────────────────────
        prisma.atelier.create({
          data: {
            nom: 'Réunion Mensuelle des Assistantes',
            description:
              'Point mensuel sur les actualités règlementaires et échanges de pratiques',
            date: addDays(today, 8),
            debutMinutes: 570, // 9h30
            finMinutes: 660, // 11h00
            dateLimiteInscription: addDays(today, 4),
            nombrePlaces: 15,
            lieu: 'Salle du conseil du R.A.M.',
            typePublic: TypePublicAtelier.ASSISTANT_UNIQUEMENT,
            animateurId: null,
          },
        }),
        // ── Ateliers MIXTE ─────────────────────────────────────────
        prisma.atelier.create({
          data: {
            nom: 'Bébés Nageurs',
            description:
              "Initiation aquatique pour les bébés accompagnés d'un parent et encadrés par une assistante",
            date: addDays(today, 28),
            debutMinutes: 600, // 10h00
            finMinutes: 660, // 11h00
            dateLimiteInscription: addDays(today, 24),
            nombrePlaces: 8,
            lieu: 'Piscine municipale',
            typePublic: TypePublicAtelier.MIXTE,
            ageMinMois: 4,
            ageMaxMois: 24,
            animateurId: assistant3.assistantProfil!.id,
          },
        }),
      ]);

    // ═══════════════════════════════════════════════════════════
    // ═══════════════════ INSCRIPTIONS ATELIERS ═══════════════
    // ═══════════════════════════════════════════════════════════
    await Promise.all([
      // Parents inscrivant leurs enfants (ateliers ENFANT)
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier1.id,
          parentId: parent1.parentProfil!.id,
          enfantId: enfant1.id,
          present: true,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier1.id,
          parentId: parent1.parentProfil!.id,
          enfantId: enfant2.id,
          present: false,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier2.id,
          parentId: parent2.parentProfil!.id,
          enfantId: enfant3.id,
          present: true,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier2.id,
          parentId: parent3.parentProfil!.id,
          enfantId: enfant5.id,
          present: true,
        },
      }),

      // Parents inscrits au café / formation (ateliers PARENT_UNIQUEMENT)
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier3.id,
          parentId: parent1.parentProfil!.id,
          enfantId: enfant1.id,
          present: true,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier3.id,
          parentId: parent2.parentProfil!.id,
          enfantId: enfant3.id,
          present: false,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier3.id,
          parentId: parent5.parentProfil!.id,
          enfantId: enfant8.id,
          present: false,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier4.id,
          parentId: parent3.parentProfil!.id,
          enfantId: enfant5.id,
          present: false,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier4.id,
          parentId: parent4.parentProfil!.id,
          enfantId: enfant6.id,
          present: true,
        },
      }),

      // Bébés nageurs MIXTE
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier6.id,
          parentId: parent1.parentProfil!.id,
          enfantId: enfant1.id,
          present: false,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier6.id,
          parentId: parent4.parentProfil!.id,
          enfantId: enfant7.id,
          present: false,
        },
      }),

      // Assistantes inscrites (ateliers ASSISTANT_UNIQUEMENT)
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier5.id,
          assistantId: assistant1.assistantProfil!.id,
          present: true,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier5.id,
          assistantId: assistant2.assistantProfil!.id,
          present: false,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier5.id,
          assistantId: assistant3.assistantProfil!.id,
          present: true,
        },
      }),
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier5.id,
          assistantId: assistant4.assistantProfil!.id,
          present: false,
        },
      }),

      // Assistante inscrite sur un atelier MIXTE
      prisma.inscriptionAtelier.create({
        data: {
          atelierId: atelier6.id,
          assistantId: assistant2.assistantProfil!.id,
          present: false,
        },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ═══════════════════════ CRÈCHE ══════════════════════════
    // ═══════════════════════════════════════════════════════════
    await prisma.parametreStructure.create({
      data: {
        capaciteCreche: 30,
      },
    });

    const [
      inscriptionCreche1,
      inscriptionCreche2,
      inscriptionCreche3,
      inscriptionCreche4,
    ] = await Promise.all([
      prisma.inscriptionCreche.create({
        data: {
          enfantId: enfant1.id,
          parentId: parent1.parentProfil!.id,
          typeAccueil: TypeAccueilCreche.REGULIER,
          dateDebut: new Date('2026-01-15'),
          dateFin: null,
          statut: StatutInscription.ACTIVE,
        },
      }),
      prisma.inscriptionCreche.create({
        data: {
          enfantId: enfant3.id,
          parentId: parent2.parentProfil!.id,
          typeAccueil: TypeAccueilCreche.REGULIER,
          dateDebut: new Date('2026-01-01'),
          dateFin: null,
          statut: StatutInscription.ACTIVE,
        },
      }),
      prisma.inscriptionCreche.create({
        data: {
          enfantId: enfant5.id,
          parentId: parent3.parentProfil!.id,
          typeAccueil: TypeAccueilCreche.OCCASIONNEL,
          dateDebut: new Date('2026-02-01'),
          dateFin: null,
          statut: StatutInscription.ACTIVE,
        },
      }),
      prisma.inscriptionCreche.create({
        data: {
          enfantId: enfant8.id,
          parentId: parent5.parentProfil!.id,
          typeAccueil: TypeAccueilCreche.REGULIER,
          dateDebut: new Date('2025-12-01'),
          dateFin: null,
          statut: StatutInscription.ACTIVE,
        },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ═════════════════ JOURS RÉSERVATION CRÈCHE ══════════════
    // ═══════════════════════════════════════════════════════════
    await Promise.all([
      // Inscription 1 : Lundi, Mercredi, Vendredi
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche1.id,
          jourSemaine: JourSemaine.LUNDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche1.id,
          jourSemaine: JourSemaine.MERCREDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche1.id,
          jourSemaine: JourSemaine.VENDREDI,
        },
      }),

      // Inscription 2 : Lundi, Mardi, Jeudi, Vendredi
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche2.id,
          jourSemaine: JourSemaine.LUNDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche2.id,
          jourSemaine: JourSemaine.MARDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche2.id,
          jourSemaine: JourSemaine.JEUDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche2.id,
          jourSemaine: JourSemaine.VENDREDI,
        },
      }),

      // Inscription 3 : Mardi, Jeudi (occasionnel)
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche3.id,
          jourSemaine: JourSemaine.MARDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche3.id,
          jourSemaine: JourSemaine.JEUDI,
        },
      }),

      // Inscription 4 : Tous les jours (Lundi au Vendredi)
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche4.id,
          jourSemaine: JourSemaine.LUNDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche4.id,
          jourSemaine: JourSemaine.MARDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche4.id,
          jourSemaine: JourSemaine.MERCREDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche4.id,
          jourSemaine: JourSemaine.JEUDI,
        },
      }),
      prisma.jourReservationCreche.create({
        data: {
          inscriptionId: inscriptionCreche4.id,
          jourSemaine: JourSemaine.VENDREDI,
        },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ════════════════════ RÉSERVATIONS CRÈCHE ════════════════
    // ═══════════════════════════════════════════════════════════
    const reservationPromises: any[] = [];
    const inscriptions = [
      inscriptionCreche1,
      inscriptionCreche2,
      inscriptionCreche3,
      inscriptionCreche4,
    ];

    for (const inscription of inscriptions) {
      const joursReserves = await prisma.jourReservationCreche.findMany({
        where: { inscriptionId: inscription.id },
      });

      const joursSecondes: { [key: string]: number } = {
        [JourSemaine.LUNDI]: 1,
        [JourSemaine.MARDI]: 2,
        [JourSemaine.MERCREDI]: 3,
        [JourSemaine.JEUDI]: 4,
        [JourSemaine.VENDREDI]: 5,
      };

      // Génération des réservations sur février 2026
      for (
        let d = new Date('2026-02-01');
        d <= new Date('2026-02-28');
        d.setDate(d.getDate() + 1)
      ) {
        const jourSemaine = d.getDay();
        const jourEnum = Object.keys(joursSecondes).find(
          (k) => joursSecondes[k] === jourSemaine,
        );

        if (
          jourEnum &&
          joursReserves.some((jr) => jr.jourSemaine === jourEnum)
        ) {
          const dateReservation = new Date(d);
          const arriveeMinutes = 480 + Math.floor(Math.random() * 60); // 8h00-9h00
          const departMinutes = 960 + Math.floor(Math.random() * 120); // 16h00-18h00
          const heures = (departMinutes - arriveeMinutes) / 60;
          const montant = heures * 5.5; // 5.5€/heure

          const randomSeed = dateReservation.getDate() % 10;
          let statut: StatutValidation = StatutValidation.EN_ATTENTE;
          if (randomSeed < 7) statut = StatutValidation.VALIDE;

          reservationPromises.push(
            prisma.reservationCreche.create({
              data: {
                enfantId: inscription.enfantId,
                parentId: inscription.parentId,
                date: dateReservation,
                arriveeMinutes,
                departMinutes,
                statut,
                montant,
              },
            }),
          );
        }
      }
    }

    await Promise.all(reservationPromises);

    // ═══════════════════════════════════════════════════════════
    // ══════════════════ SUIVIS JOURNALIERS ═══════════════════
    // ═══════════════════════════════════════════════════════════
    const suiviJournalierPromises: any[] = [];

    // Suivis détaillés pour tous les enfants chez les assistantes
    for (const contrat of [
      contrat1,
      contrat2,
      contrat3,
      contrat4,
      contrat5,
      contrat6,
      contrat7,
      contrat8,
    ]) {
      for (
        let d = new Date('2026-02-01');
        d <= new Date('2026-02-15');
        d.setDate(d.getDate() + 1)
      ) {
        const jourSemaine = d.getDay();
        if (jourSemaine >= 1 && jourSemaine <= 5) {
          // Lundi à Vendredi
          const date = new Date(d);
          const humeurs = [
            'Joyeux',
            'Calme',
            'Fatigué',
            'Énergique',
            'Grognon',
          ];
          const repasOptions = [
            'Très bien mangé',
            'Bien mangé',
            'Peu mangé',
            'Mangé normalement',
          ];
          const siesteOptions = [
            '2h',
            '1h30',
            '1h',
            'Pas de sieste',
            '45 minutes',
          ];

          suiviJournalierPromises.push(
            prisma.suiviJournalierEnfant.create({
              data: {
                enfantId: contrat.enfantId,
                assistantId: contrat.assistantId,
                date,
                temperature:
                  Math.random() > 0.9
                    ? 37.5 + Math.random() * 1.5
                    : 36.5 + Math.random() * 0.8,
                humeur: humeurs[Math.floor(Math.random() * humeurs.length)],
                repas:
                  repasOptions[Math.floor(Math.random() * repasOptions.length)],
                sieste:
                  siesteOptions[
                    Math.floor(Math.random() * siesteOptions.length)
                  ],
                remarques:
                  Math.random() > 0.7
                    ? 'Journée agréable, enfant en forme'
                    : null,
              },
            }),
          );
        }
      }
    }

    await Promise.all(suiviJournalierPromises);

    // ═══════════════════════════════════════════════════════════
    // ══════════════════ PARAMÈTRES LÉGAUX ════════════════════
    // ═══════════════════════════════════════════════════════════
    await Promise.all([
      // SMIC horaire brut ass. mat. (depuis 01/04/2025 selon le sujet : 3,64€ brut / 2,85€ net)
      prisma.parametreLegal.create({
        data: {
          nom: 'SMIC_HORAIRE_BRUT',
          valeur: 3.64,
          valeurNet: 2.85,
          description:
            "Salaire horaire minimum conventionnel brut d'une assistante maternelle",
          dateMiseEnVigueur: new Date('2025-04-01'),
          dateFinVigueur: null,
        },
      }),

      // Taux de charges salariales (~22% dans le seed existant)
      prisma.parametreLegal.create({
        data: {
          nom: 'TAUX_CHARGE_SALARIALE',
          valeur: 0.22,
          valeurNet: null,
          description:
            "Taux de cotisations salariales appliqué au salaire brut de l'assistante maternelle",
          dateMiseEnVigueur: new Date('2025-01-01'),
          dateFinVigueur: null,
        },
      }),

      // Taux de charges patronales (~42% dans le seed existant)
      prisma.parametreLegal.create({
        data: {
          nom: 'TAUX_CHARGE_PATRONALE',
          valeur: 0.42,
          valeurNet: null,
          description:
            "Taux de cotisations patronales appliqué au salaire brut de l'assistante maternelle",
          dateMiseEnVigueur: new Date('2025-01-01'),
          dateFinVigueur: null,
        },
      }),

      // Majoration heures supplémentaires (25% dans le seed existant)
      prisma.parametreLegal.create({
        data: {
          nom: 'MAJORATION_HEURE_SUP',
          valeur: 0.25,
          valeurNet: null,
          description:
            'Taux de majoration appliqué aux heures supplémentaires (au-delà des heures contractuelles)',
          dateMiseEnVigueur: new Date('2025-01-01'),
          dateFinVigueur: null,
        },
      }),

      // Indemnité d'entretien journalière minimale
      prisma.parametreLegal.create({
        data: {
          nom: 'INDEMNITE_ENTRETIEN_MIN',
          valeur: 3.25,
          valeurNet: null,
          description:
            "Montant minimum journalier de l'indemnité d'entretien par enfant gardé",
          dateMiseEnVigueur: new Date('2025-04-01'),
          dateFinVigueur: null,
        },
      }),

      // Indemnité kilométrique
      prisma.parametreLegal.create({
        data: {
          nom: 'INDEMNITE_KM',
          valeur: 0.5,
          valeurNet: null,
          description:
            "Taux de remboursement kilométrique pour les déplacements de l'assistante maternelle",
          dateMiseEnVigueur: new Date('2025-01-01'),
          dateFinVigueur: null,
        },
      }),

      // Taux de prise en charge CAF (CMG - Complément Mode de Garde)
      prisma.parametreLegal.create({
        data: {
          nom: 'TAUX_PRISE_CHARGE_CAF',
          valeur: 0.15,
          valeurNet: null,
          description:
            'Taux moyen de prise en charge CAF (CMG) sur le salaire brut (varie selon revenus familiaux)',
          dateMiseEnVigueur: new Date('2025-01-01'),
          dateFinVigueur: null,
        },
      }),
    ]);

    // ═══════════════════════════════════════════════════════════
    // ═══════════════════════ HISTORIQUE ═════════════════════
    // ═══════════════════════════════════════════════════════════
    const suiviGarde1 = await prisma.suiviGardeAssistant.findFirst({
      where: { contratId: contrat1.id, statut: StatutValidation.VALIDE },
    });

    if (suiviGarde1) {
      await Promise.all([
        prisma.historique.create({
          data: {
            entityType: EntityType.SUIVI_GARDE,
            entityId: suiviGarde1.id,
            modifieParParentId: parent1.parentProfil!.id,
            action: TypeAction.MODIFICATION,
            beforeData: { repasFournis: 1, km: 10 },
            afterData: { repasFournis: 2, km: 15 },
            suiviGardeAssistantId: suiviGarde1.id,
          },
        }),
        prisma.historique.create({
          data: {
            entityType: EntityType.CONTRAT,
            entityId: contrat1.id,
            modifieParParentId: parent1.parentProfil!.id,
            action: TypeAction.MODIFICATION,
            beforeData: { statut: 'ACTIF' },
            afterData: { statut: 'ACTIF', tarifHoraireBrut: 4.6 },
          },
        }),
      ]);
    }

    console.log('\n🎉 Seed terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
