import { UtilisateurModel, UtilisateurCreateInput } from "./utilisateur";
import { AtelierModel, AtelierCreateInput } from "./atelier";
import { ContratGardeModel, ContratGardeCreateInput } from "./contrat-garde";
import { InscriptionAtelierModel, InscriptionAtelierCreateInput } from "./inscription-atelier";
import { SuiviJournalierEnfantModel, SuiviJournalierEnfantCreateInput } from "./suivi-journalier-enfant";

export interface AssistantProfilModel {
  id: number;
  utilisateurId: number;
  adresse: string;
  codePostal: string;
  ville: string;
  numeroAgrement: string;
  dateObtentionAgrement: string;
  dateFinAgrement: string | null;
  capaciteAccueil: number;
  experience: number | null;
  disponibilites: string | null;
  createdAt: string;
  updatedAt: string;
  utilisateur?: UtilisateurModel;
  ateliers?: AtelierModel[];
  contrats?: ContratGardeModel[];
  inscriptionAteliers?: InscriptionAtelierModel[];
  suiviJournalierEnfants?: SuiviJournalierEnfantModel[];
}

export interface AssistantProfilCreateInput {
  id?: number;
  utilisateurId?: number;
  adresse: string;
  codePostal: string;
  ville: string;
  numeroAgrement: string;
  dateObtentionAgrement: string;
  dateFinAgrement?: string | null;
  capaciteAccueil: number;
  experience?: number | null;
  disponibilites?: string | null;
  createdAt?: string;
  updatedAt?: string;
  utilisateur?: UtilisateurCreateInput;
  ateliers?: AtelierCreateInput[];
  contrats?: ContratGardeCreateInput[];
  inscriptionAteliers?: InscriptionAtelierCreateInput[];
  suiviJournalierEnfants?: SuiviJournalierEnfantCreateInput[];
}

export type AssistantProfilUpdateInput = Partial<AssistantProfilCreateInput>;

