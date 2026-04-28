import { TypeAccueilCreche, StatutInscription } from '../enums'
import { EnfantModel, EnfantCreateInput } from './enfant'
import { ParentProfilModel, ParentProfilCreateInput } from './parent-profil'
import {
  JourReservationCrecheModel,
  JourReservationCrecheCreateInput,
} from './jour-reservation-creche'

export interface InscriptionCrecheModel {
  id: number
  enfantId: number
  parentId: number
  typeAccueil: TypeAccueilCreche
  dateDebut: string
  dateFin: string | null
  statut: StatutInscription
  enfant?: EnfantModel
  parent?: ParentProfilModel
  jours?: JourReservationCrecheModel[]
}

export interface InscriptionCrecheCreateInput {
  id?: number
  enfantId?: number
  parentId?: number
  typeAccueil: TypeAccueilCreche
  dateDebut: string
  dateFin?: string | null
  statut?: StatutInscription
  enfant?: EnfantCreateInput
  parent?: ParentProfilCreateInput
  jours?: JourReservationCrecheCreateInput[]
}

export type InscriptionCrecheUpdateInput = Partial<InscriptionCrecheCreateInput>
