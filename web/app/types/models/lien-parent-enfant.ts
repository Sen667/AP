import { EnfantModel, EnfantCreateInput } from "./enfant";
import { ParentProfilModel, ParentProfilCreateInput } from "./parent-profil";

export interface LienParentEnfantModel {
  parentId: number;
  enfantId: number;
  createdAt: string;
  updatedAt: string;
  enfant?: EnfantModel;
  parent?: ParentProfilModel;
}

export interface LienParentEnfantCreateInput {
  parentId?: number;
  enfantId?: number;
  createdAt?: string;
  updatedAt?: string;
  enfant?: EnfantCreateInput;
  parent?: ParentProfilCreateInput;
}

export type LienParentEnfantUpdateInput = Partial<LienParentEnfantCreateInput>;

