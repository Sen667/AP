export interface ParametreStructureModel {
  id: number;
  capaciteCreche: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParametreStructureCreateInput {
  id?: number;
  capaciteCreche: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ParametreStructureUpdateInput = Partial<ParametreStructureCreateInput>;

