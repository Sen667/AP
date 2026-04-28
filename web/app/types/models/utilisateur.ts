import { Role, Sexe } from '../enums'
import { AssistantProfilModel, AssistantProfilCreateInput } from './assistant-profil'
import { ParentProfilModel, ParentProfilCreateInput } from './parent-profil'

export interface UtilisateurModel {
  id: number
  nom: string
  prenom: string
  email: string
  password: string
  role: Role
  sexe: Sexe
  telephone: string
  dateNaissance: string
  createdAt: string
  updatedAt: string
  assistantProfil?: AssistantProfilModel
  parentProfil?: ParentProfilModel
}

export interface UtilisateurCreateInput {
  id?: number
  nom: string
  prenom: string
  email: string
  password: string
  role: Role
  sexe: Sexe
  telephone: string
  dateNaissance: string
  createdAt?: string
  updatedAt?: string
  assistantProfil?: AssistantProfilCreateInput
  parentProfil?: ParentProfilCreateInput
}

export type UtilisateurUpdateInput = Partial<UtilisateurCreateInput>
