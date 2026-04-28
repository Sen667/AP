import { EnfantModel, EnfantCreateInput } from "./enfant";

export interface PersonneAutoriseeModel {
  id: number;
  enfantId: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  lien: string | null;
  createdAt: string;
  updatedAt: string;
  enfant?: EnfantModel;
}

export interface PersonneAutoriseeCreateInput {
  id?: number;
  enfantId?: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  lien?: string | null;
  createdAt?: string;
  updatedAt?: string;
  enfant?: EnfantCreateInput;
}

export type PersonneAutoriseeUpdateInput = Partial<PersonneAutoriseeCreateInput>;

