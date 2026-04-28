export const Role = {
  ADMIN: 'ADMIN',
  PARENT: 'PARENT',
  ASSISTANT: 'ASSISTANT',
} as const
export type Role = keyof typeof Role

export const Sexe = {
  MASCULIN: 'MASCULIN',
  FEMININ: 'FEMININ',
} as const
export type Sexe = keyof typeof Sexe

export const StatutValidation = {
  EN_ATTENTE: 'EN_ATTENTE',
  VALIDE: 'VALIDE',
  REFUSE: 'REFUSE',
} as const
export type StatutValidation = keyof typeof StatutValidation

export const StatutContrat = {
  EN_ATTENTE_VALIDATION: 'EN_ATTENTE_VALIDATION',
  ACTIF: 'ACTIF',
  SUSPENDU: 'SUSPENDU',
  TERMINE: 'TERMINE',
} as const
export type StatutContrat = keyof typeof StatutContrat

export const TypeAccueilCreche = {
  REGULIER: 'REGULIER',
  OCCASIONNEL: 'OCCASIONNEL',
} as const
export type TypeAccueilCreche = keyof typeof TypeAccueilCreche

export const StatutInscription = {
  ACTIVE: 'ACTIVE',
  SUSPENDUE: 'SUSPENDUE',
  TERMINEE: 'TERMINEE',
} as const
export type StatutInscription = keyof typeof StatutInscription

export const TypePublicAtelier = {
  ENFANT: 'ENFANT',
  PARENT_UNIQUEMENT: 'PARENT_UNIQUEMENT',
  ASSISTANT_UNIQUEMENT: 'ASSISTANT_UNIQUEMENT',
  MIXTE: 'MIXTE',
} as const
export type TypePublicAtelier = keyof typeof TypePublicAtelier

export const TypeAction = {
  AJOUT: 'AJOUT',
  MODIFICATION: 'MODIFICATION',
  SUPPRESSION: 'SUPPRESSION',
} as const
export type TypeAction = keyof typeof TypeAction

export const EntityType = {
  SUIVI_GARDE: 'SUIVI_GARDE',
  SUIVI_JOURNALIER: 'SUIVI_JOURNALIER',
  CONTRAT: 'CONTRAT',
  RESERVATION_CRECHE: 'RESERVATION_CRECHE',
} as const
export type EntityType = keyof typeof EntityType

export const JourSemaine = {
  LUNDI: 'LUNDI',
  MARDI: 'MARDI',
  MERCREDI: 'MERCREDI',
  JEUDI: 'JEUDI',
  VENDREDI: 'VENDREDI',
  SAMEDI: 'SAMEDI',
  DIMANCHE: 'DIMANCHE',
} as const
export type JourSemaine = keyof typeof JourSemaine
