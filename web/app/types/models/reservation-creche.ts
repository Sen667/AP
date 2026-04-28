import { StatutValidation } from '../enums'
import { EnfantModel, EnfantCreateInput } from './enfant'
import { ParentProfilModel, ParentProfilCreateInput } from './parent-profil'

export interface ReservationCrecheModel {
  id: number
  enfantId: number
  parentId: number
  date: string
  arriveeMinutes: number
  departMinutes: number
  statut: StatutValidation
  montant: number
  enfant?: EnfantModel
  parent?: ParentProfilModel
}

export interface ReservationCrecheCreateInput {
  id?: number
  enfantId?: number
  parentId?: number
  date: string
  arriveeMinutes: number
  departMinutes: number
  statut?: StatutValidation
  montant: number
  enfant?: EnfantCreateInput
  parent?: ParentProfilCreateInput
}

export type ReservationCrecheUpdateInput = Partial<ReservationCrecheCreateInput>
