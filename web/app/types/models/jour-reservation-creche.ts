import { JourSemaine } from '../enums'
import { InscriptionCrecheModel, InscriptionCrecheCreateInput } from './inscription-creche'

export interface JourReservationCrecheModel {
  id: number
  inscriptionId: number
  jourSemaine: JourSemaine
  inscription?: InscriptionCrecheModel
}

export interface JourReservationCrecheCreateInput {
  id?: number
  inscriptionId?: number
  jourSemaine: JourSemaine
  inscription?: InscriptionCrecheCreateInput
}

export type JourReservationCrecheUpdateInput = Partial<JourReservationCrecheCreateInput>
