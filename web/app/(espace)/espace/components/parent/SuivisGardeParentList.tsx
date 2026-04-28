'use client'

import Button from '@/app/components/ui/Button'
import { getSuivisParent } from '@/app/lib/api/suiviGarde'
import type { SuiviGardeAssistantModel } from '@/app/types/models/suivi-garde-assistant'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clipboard,
  Clock,
  DollarSign,
  XCircle,
} from '@deemlol/next-icons'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ValidationSuiviModal from './ValidationSuiviModal'

export default function SuivisGardeParentList() {
  const [suivis, setSuivis] = useState<SuiviGardeAssistantModel[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSuivi, setSelectedSuivi] = useState<SuiviGardeAssistantModel | null>(null)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [filterMois, setFilterMois] = useState<number | undefined>()
  const [filterAnnee, setFilterAnnee] = useState<number | undefined>()
  const [filterStatut, setFilterStatut] = useState<string | undefined>()

  const fetchSuivis = async () => {
    try {
      setLoading(true)
      const data = await getSuivisParent(filterMois, filterAnnee)
      setSuivis(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des suivis:', error)
      toast.error('Erreur lors de la récupération des suivis')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuivis()
  }, [filterMois, filterAnnee])

  const formatMinutesToTime = (minutes: number | null) => {
    if (minutes === null) return '--:--'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const handleOpenValidation = (suivi: SuiviGardeAssistantModel) => {
    setSelectedSuivi(suivi)
    setShowValidationModal(true)
  }

  const handleCloseValidation = () => {
    setSelectedSuivi(null)
    setShowValidationModal(false)
  }

  const handleSuccess = () => {
    fetchSuivis()
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3" />
            En attente
          </span>
        )
      case 'VALIDE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Validé
          </span>
        )
      case 'REFUSE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Refusé
          </span>
        )
      default:
        return null
    }
  }

  const suivisEnAttente = suivis.filter((s) => s.statut === 'EN_ATTENTE')

  // Filtrage par statut
  const suivisFiltres = filterStatut ? suivis.filter((s) => s.statut === filterStatut) : suivis

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Chargement des suivis...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alerte suivis en attente */}
      {suivisEnAttente.length > 0 && (
        <div className="bg-yellow-50 border border-gray-200 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-900">
                Suivis en attente de validation
              </h3>
              <p className="text-sm text-yellow-800 mt-1">
                Vous avez {suivisEnAttente.length} suivi
                {suivisEnAttente.length > 1 ? 's' : ''} en attente de validation par les assistantes
                maternelles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-sm  p-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Mois:</label>
            <select
              value={filterMois || ''}
              onChange={(e) => setFilterMois(e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tous</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1).toLocaleDateString('fr-FR', {
                    month: 'long',
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Année:</label>
            <select
              value={filterAnnee || ''}
              onChange={(e) =>
                setFilterAnnee(e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Toutes</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Statut:</label>
            <select
              value={filterStatut || ''}
              onChange={(e) => setFilterStatut(e.target.value || undefined)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="VALIDE">Validé</option>
              <option value="REFUSE">Refusé</option>
            </select>
          </div>

          {(filterMois || filterAnnee || filterStatut) && (
            <Button
              type="gray"
              text="Réinitialiser"
              onClick={() => {
                setFilterMois(undefined)
                setFilterAnnee(undefined)
                setFilterStatut(undefined)
              }}
              className="text-xs"
            />
          )}
        </div>
      </div>

      {/* Liste des suivis */}
      {suivisFiltres.length === 0 ? (
        <div className="bg-white rounded-sm  p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun suivi de garde</h3>
          <p className="text-sm text-gray-500">
            Les suivis de garde créés par vos assistantes maternelles apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suivisFiltres.map((suivi) => (
            <div
              key={suivi.id}
              className="bg-white rounded-sm  transition-shadow border border-gray-200"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {suivi.contrat?.enfant?.prenom} {suivi.contrat?.enfant?.nom}
                      </h3>
                      {getStatutBadge(suivi.statut)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Assistante:{' '}
                      <span className="font-medium">
                        {suivi.contrat?.assistant?.utilisateur?.prenom}{' '}
                        {suivi.contrat?.assistant?.utilisateur?.nom}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(suivi.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-xs">Arrivée</p>
                      <p className="font-medium text-gray-900">
                        {formatMinutesToTime(suivi.arriveeMinutes)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-xs">Départ</p>
                      <p className="font-medium text-gray-900">
                        {formatMinutesToTime(suivi.departMinutes)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clipboard className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-xs">Repas</p>
                      <p className="font-medium text-gray-900">{suivi.repasFournis}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500 text-xs">Frais divers</p>
                      <p className="font-medium text-gray-900">
                        {suivi.fraisDivers ? `${Number(suivi.fraisDivers).toFixed(2)} €` : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Commentaire */}
                {suivi.commentairesParent && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-sm">
                    <p className="text-xs font-medium text-blue-900 mb-1">Votre commentaire</p>
                    <p className="text-sm text-blue-800">{suivi.commentairesParent}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  {suivi.statut === 'EN_ATTENTE' ? (
                    <Button
                      type="primary"
                      icon={<CheckCircle size={16} />}
                      text="Valider"
                      onClick={() => handleOpenValidation(suivi)}
                      className="text-xs"
                    />
                  ) : (
                    <Button
                      type="gray"
                      icon={<Clipboard size={16} />}
                      text="Voir les détails"
                      disabled
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de validation */}
      {showValidationModal && selectedSuivi && (
        <ValidationSuiviModal
          suivi={selectedSuivi}
          onClose={handleCloseValidation}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
