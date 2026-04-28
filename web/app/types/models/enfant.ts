import { Sexe } from '../enums'
import { ContratGardeModel, ContratGardeCreateInput } from './contrat-garde'
import { InscriptionAtelierModel, InscriptionAtelierCreateInput } from './inscription-atelier'
import { InscriptionCrecheModel, InscriptionCrecheCreateInput } from './inscription-creche'
import { LienParentEnfantModel, LienParentEnfantCreateInput } from './lien-parent-enfant'
import { PersonneAutoriseeModel, PersonneAutoriseeCreateInput } from './personne-autorisee'
import { ReservationCrecheModel, ReservationCrecheCreateInput } from './reservation-creche'
import {
  SuiviJournalierEnfantModel,
  SuiviJournalierEnfantCreateInput,
} from './suivi-journalier-enfant'

export interface EnfantModel {
  id: number
  nom: string
  prenom: string
  dateNaissance: string
  sexe: Sexe
  allergies: string | null
  remarquesMedicales: string | null
  medecinTraitant: string
  medecinTraitantTel: string
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  contrats?: ContratGardeModel[]
  inscriptionAteliers?: InscriptionAtelierModel[]
  inscriptionCreches?: InscriptionCrecheModel[]
  parents?: LienParentEnfantModel[]
  personnesAutorisees?: PersonneAutoriseeModel[]
  reservationCreches?: ReservationCrecheModel[]
  suivis?: SuiviJournalierEnfantModel[]
}

export interface EnfantCreateInput {
  id?: number
  nom: string
  prenom: string
  dateNaissance: string
  sexe: Sexe
  allergies?: string | null
  remarquesMedicales?: string | null
  medecinTraitant: string
  medecinTraitantTel: string
  deletedAt?: string | null
  createdAt?: string
  updatedAt?: string
  contrats?: ContratGardeCreateInput[]
  inscriptionAteliers?: InscriptionAtelierCreateInput[]
  inscriptionCreches?: InscriptionCrecheCreateInput[]
  parents?: LienParentEnfantCreateInput[]
  personnesAutorisees?: PersonneAutoriseeCreateInput[]
  reservationCreches?: ReservationCrecheCreateInput[]
  suivis?: SuiviJournalierEnfantCreateInput[]
}

export type EnfantUpdateInput = Partial<EnfantCreateInput>
