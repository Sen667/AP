import { AssistantProfilModel, AssistantProfilCreateInput } from "./assistant-profil";
import { AtelierModel, AtelierCreateInput } from "./atelier";
import { EnfantModel, EnfantCreateInput } from "./enfant";
import { ParentProfilModel, ParentProfilCreateInput } from "./parent-profil";

export interface InscriptionAtelierModel {
  id: number;
  atelierId: number;
  parentId: number | null;
  enfantId: number | null;
  assistantId: number | null;
  present: boolean;
  assistant?: AssistantProfilModel;
  atelier?: AtelierModel;
  enfant?: EnfantModel;
  parent?: ParentProfilModel;
}

export interface InscriptionAtelierCreateInput {
  id?: number;
  atelierId?: number;
  parentId?: number | null;
  enfantId?: number | null;
  assistantId?: number | null;
  present?: boolean;
  assistant?: AssistantProfilCreateInput;
  atelier?: AtelierCreateInput;
  enfant?: EnfantCreateInput;
  parent?: ParentProfilCreateInput;
}

export type InscriptionAtelierUpdateInput = Partial<InscriptionAtelierCreateInput>;

