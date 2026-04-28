export interface ParametreLegalModel {
  id: number;
  nom: string;
  valeur: number;
  valeurNet: number | null;
  description: string | null;
  dateMiseEnVigueur: string;
  dateFinVigueur: string | null;
}

export interface ParametreLegalCreateInput {
  id?: number;
  nom: string;
  valeur: number;
  valeurNet?: number | null;
  description?: string | null;
  dateMiseEnVigueur: string;
  dateFinVigueur?: string | null;
}

export type ParametreLegalUpdateInput = Partial<ParametreLegalCreateInput>;

