import { ContratGardeModel, ContratGardeCreateInput } from "./contrat-garde";

export interface PaieModel {
  id: number;
  contratId: number;
  mois: number;
  annee: number;
  heuresNormales: number;
  heuresMajorees: number;
  salaireBrut: number;
  salaireNet: number;
  chargesPatronales: number;
  chargesSalariales: number;
  priseEnChargeCAF: number | null;
  commentaire: string | null;
  createdAt: string;
  updatedAt: string;
  contrat?: ContratGardeModel;
}

export interface PaieCreateInput {
  id?: number;
  contratId?: number;
  mois: number;
  annee: number;
  heuresNormales: number;
  heuresMajorees: number;
  salaireBrut: number;
  salaireNet: number;
  chargesPatronales: number;
  chargesSalariales: number;
  priseEnChargeCAF?: number | null;
  commentaire?: string | null;
  createdAt?: string;
  updatedAt?: string;
  contrat?: ContratGardeCreateInput;
}

export type PaieUpdateInput = Partial<PaieCreateInput>;

