import { HistoriqueModel, HistoriqueCreateInput } from "./historique";
import { ContratGardeModel, ContratGardeCreateInput } from "./contrat-garde";
import { InscriptionAtelierModel, InscriptionAtelierCreateInput } from "./inscription-atelier";
import { InscriptionCrecheModel, InscriptionCrecheCreateInput } from "./inscription-creche";
import { LienParentEnfantModel, LienParentEnfantCreateInput } from "./lien-parent-enfant";
import { UtilisateurModel, UtilisateurCreateInput } from "./utilisateur";
import { ReservationCrecheModel, ReservationCrecheCreateInput } from "./reservation-creche";

export interface ParentProfilModel {
  id: number;
  utilisateurId: number;
  adresse: string;
  codePostal: string;
  ville: string;
  situationFamiliale: string | null;
  profession: string | null;
  employeur: string | null;
  beneficiaireCAF: boolean;
  numeroAllocataire: string | null;
  contactUrgenceNom: string;
  contactUrgenceTel: string;
  createdAt: string;
  updatedAt: string;
  historiques?: HistoriqueModel[];
  contrats?: ContratGardeModel[];
  inscriptionsAtelier?: InscriptionAtelierModel[];
  inscriptionCreche?: InscriptionCrecheModel[];
  enfants?: LienParentEnfantModel[];
  utilisateur?: UtilisateurModel;
  reservationsCreche?: ReservationCrecheModel[];
}

export interface ParentProfilCreateInput {
  id?: number;
  utilisateurId?: number;
  adresse: string;
  codePostal: string;
  ville: string;
  situationFamiliale?: string | null;
  profession?: string | null;
  employeur?: string | null;
  beneficiaireCAF?: boolean;
  numeroAllocataire?: string | null;
  contactUrgenceNom: string;
  contactUrgenceTel: string;
  createdAt?: string;
  updatedAt?: string;
  historiques?: HistoriqueCreateInput[];
  contrats?: ContratGardeCreateInput[];
  inscriptionsAtelier?: InscriptionAtelierCreateInput[];
  inscriptionCreche?: InscriptionCrecheCreateInput[];
  enfants?: LienParentEnfantCreateInput[];
  utilisateur?: UtilisateurCreateInput;
  reservationsCreche?: ReservationCrecheCreateInput[];
}

export type ParentProfilUpdateInput = Partial<ParentProfilCreateInput>;

