import { TypePublicAtelier } from '../enums'
import { AssistantProfilModel, AssistantProfilCreateInput } from './assistant-profil'
import { InscriptionAtelierModel, InscriptionAtelierCreateInput } from './inscription-atelier'

export interface AtelierModel {
  id: number
  nom: string
  description: string | null
  date: string
  debutMinutes: number
  finMinutes: number
  dateLimiteInscription: string
  nombrePlaces: number
  lieu: string
  typePublic: TypePublicAtelier
  ageMinMois: number | null
  ageMaxMois: number | null
  animateurId: number | null
  createdAt: string
  updatedAt: string
  animateur?: AssistantProfilModel
  inscriptions?: InscriptionAtelierModel[]
}

export interface AtelierCreateInput {
  id?: number
  nom: string
  description?: string | null
  date: string
  debutMinutes: number
  finMinutes: number
  dateLimiteInscription: string
  nombrePlaces: number
  lieu: string
  typePublic: TypePublicAtelier
  ageMinMois?: number | null
  ageMaxMois?: number | null
  animateurId?: number | null
  createdAt?: string
  updatedAt?: string
  animateur?: AssistantProfilCreateInput
  inscriptions?: InscriptionAtelierCreateInput[]
}

export type AtelierUpdateInput = Partial<AtelierCreateInput>
