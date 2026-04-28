import { StatutContrat, Role, StatutValidation } from '../enums'
import { AssistantProfilModel, AssistantProfilCreateInput } from './assistant-profil'
import { EnfantModel, EnfantCreateInput } from './enfant'
import { ParentProfilModel, ParentProfilCreateInput } from './parent-profil'
import { PaieModel, PaieCreateInput } from './paie'
import { SuiviGardeAssistantModel, SuiviGardeAssistantCreateInput } from './suivi-garde-assistant'

export interface ContratGardeModel {
  id: number
  enfantId: number
  parentId: number
  assistantId: number
  dateDebut: string
  dateFin: string | null
  statut: StatutContrat
  tarifHoraireBrut: number
  nombreHeuresSemaine: number
  indemniteEntretien: number
  indemniteRepas: number
  indemniteKm: number | null
  revocationDemandeePar: Role | null
  revocationStatut: StatutValidation | null
  revocationDateDemande: string | null
  revocationMotif: string | null
  revocationDateValidation: string | null
  revocationCommentaireParent: string | null
  createdAt: string
  updatedAt: string
  assistant?: AssistantProfilModel
  enfant?: EnfantModel
  parent?: ParentProfilModel
  paies?: PaieModel[]
  suivis?: SuiviGardeAssistantModel[]
}

export interface ContratGardeCreateInput {
  id?: number
  enfantId?: number
  parentId?: number
  assistantId?: number
  dateDebut: string
  dateFin?: string | null
  statut: StatutContrat
  tarifHoraireBrut: number
  nombreHeuresSemaine: number
  indemniteEntretien: number
  indemniteRepas: number
  indemniteKm?: number | null
  revocationDemandeePar?: Role | null
  revocationStatut?: StatutValidation | null
  revocationDateDemande?: string | null
  revocationMotif?: string | null
  revocationDateValidation?: string | null
  revocationCommentaireParent?: string | null
  createdAt?: string
  updatedAt?: string
  assistant?: AssistantProfilCreateInput
  enfant?: EnfantCreateInput
  parent?: ParentProfilCreateInput
  paies?: PaieCreateInput[]
  suivis?: SuiviGardeAssistantCreateInput[]
}

export type ContratGardeUpdateInput = Partial<ContratGardeCreateInput>
