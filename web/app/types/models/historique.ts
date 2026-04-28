import { EntityType, TypeAction } from '../enums'
import { ParentProfilModel, ParentProfilCreateInput } from './parent-profil'
import { SuiviGardeAssistantModel, SuiviGardeAssistantCreateInput } from './suivi-garde-assistant'

export interface HistoriqueModel {
  id: number
  entityType: EntityType
  entityId: number
  modifieParParentId: number | null
  action: TypeAction
  beforeData: any | null
  afterData: any | null
  suiviGardeAssistantId: number | null
  createdAt: string
  updatedAt: string
  modifiePar?: ParentProfilModel
  suiviGardeAssistant?: SuiviGardeAssistantModel
}

export interface HistoriqueCreateInput {
  id?: number
  entityType: EntityType
  entityId: number
  modifieParParentId?: number | null
  action: TypeAction
  beforeData?: any | null
  afterData?: any | null
  suiviGardeAssistantId?: number | null
  createdAt?: string
  updatedAt?: string
  modifiePar?: ParentProfilCreateInput
  suiviGardeAssistant?: SuiviGardeAssistantCreateInput
}

export type HistoriqueUpdateInput = Partial<HistoriqueCreateInput>
