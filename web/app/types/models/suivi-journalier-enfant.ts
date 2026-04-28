import { AssistantProfilModel, AssistantProfilCreateInput } from "./assistant-profil";
import { EnfantModel, EnfantCreateInput } from "./enfant";

export interface SuiviJournalierEnfantModel {
  id: number;
  enfantId: number;
  assistantId: number;
  date: string;
  temperature: number | null;
  humeur: string | null;
  repas: string | null;
  sieste: string | null;
  remarques: string | null;
  assistant?: AssistantProfilModel;
  enfant?: EnfantModel;
}

export interface SuiviJournalierEnfantCreateInput {
  id?: number;
  enfantId?: number;
  assistantId?: number;
  date: string;
  temperature?: number | null;
  humeur?: string | null;
  repas?: string | null;
  sieste?: string | null;
  remarques?: string | null;
  assistant?: AssistantProfilCreateInput;
  enfant?: EnfantCreateInput;
}

export type SuiviJournalierEnfantUpdateInput = Partial<SuiviJournalierEnfantCreateInput>;

