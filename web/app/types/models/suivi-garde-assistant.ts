import { StatutValidation } from '../enums'
import { HistoriqueModel, HistoriqueCreateInput } from './historique'
import { ContratGardeModel, ContratGardeCreateInput } from './contrat-garde'

export interface SuiviGardeAssistantModel {
  id: number
  contratId: number
  date: string
  arriveeMinutes: number | null
  departMinutes: number | null
  repasFournis: number
  fraisDivers: number | null
  km: number | null
  statut: StatutValidation
  dateValidation: string | null
  commentairesParent: string | null
  createdAt: string
  updatedAt: string
  historiquesModificationParent?: HistoriqueModel[]
  contrat?: ContratGardeModel
}

export interface SuiviGardeAssistantCreateInput {
  id?: number
  contratId?: number
  date: string
  arriveeMinutes?: number | null
  departMinutes?: number | null
  repasFournis?: number
  fraisDivers?: number | null
  km?: number | null
  statut?: StatutValidation
  dateValidation?: string | null
  commentairesParent?: string | null
  createdAt?: string
  updatedAt?: string
  historiquesModificationParent?: HistoriqueCreateInput[]
  contrat?: ContratGardeCreateInput
}

export type SuiviGardeAssistantUpdateInput = Partial<SuiviGardeAssistantCreateInput>
