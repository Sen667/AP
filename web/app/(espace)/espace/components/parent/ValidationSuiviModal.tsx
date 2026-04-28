'use client'

import Button from '@/app/components/ui/Button'
import { validerSuiviGarde, type ValiderSuiviGardeDto } from '@/app/lib/api/suiviGarde'
import type { SuiviGardeAssistantModel } from '@/app/types/models/suivi-garde-assistant'
import { AlertCircle, CheckCircle, X } from '@deemlol/next-icons'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface ValidationSuiviModalProps {
  suivi: SuiviGardeAssistantModel
  onClose: () => void
  onSuccess: () => void
}

export default function ValidationSuiviModal({
  suivi,
  onClose,
  onSuccess,
}: ValidationSuiviModalProps) {
  const [loading, setLoading] = useState(false)
  const [arriveeMinutes, setArriveeMinutes] = useState<number | null>(null)
  const [departMinutes, setDepartMinutes] = useState<number | null>(null)
  const [repasFournis, setRepasFournis] = useState(0)
  const [fraisDivers, setFraisDivers] = useState<number | null>(null)
  const [km, setKm] = useState<number | null>(null)
  const [commentaire, setCommentaire] = useState('')

  useEffect(() => {
    // Initialiser avec les valeurs actuelles
    setArriveeMinutes(suivi.arriveeMinutes)
    setDepartMinutes(suivi.departMinutes)
    setRepasFournis(suivi.repasFournis)
    // Convertir Decimal (string) en number
    setFraisDivers(suivi.fraisDivers ? Number(suivi.fraisDivers) : null)
    setKm(suivi.km ? Number(suivi.km) : null)
    setCommentaire(suivi.commentairesParent || '')
  }, [suivi])

  const formatMinutesToTime = (minutes: number | null) => {
    if (minutes === null) return '--:--'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const parseTimeToMinutes = (time: string): number | null => {
    if (!time || time === '--:--') return null
    const [h, m] = time.split(':').map(Number)
    if (isNaN(h) || isNaN(m)) return null
    return h * 60 + m
  }

  const handleValider = async (statut: 'VALIDE' | 'REFUSE') => {
    try {
      setLoading(true)

      const payload: ValiderSuiviGardeDto = {
        statut,
        arriveeMinutes: arriveeMinutes ?? undefined,
        departMinutes: departMinutes ?? undefined,
        repasFournis,
        fraisDivers: fraisDivers ?? undefined,
        km: km ?? undefined,
        commentaireParent: commentaire || undefined,
      }

      await validerSuiviGarde(suivi.id, payload)
      toast.success(statut === 'VALIDE' ? 'Suivi validé avec succès' : 'Suivi refusé')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erreur lors de la validation:', error)
      toast.error('Erreur lors de la validation du suivi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Validation du suivi de garde</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Alerte si déjà validé/refusé */}
          {suivi.statut !== 'EN_ATTENTE' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-900">
                  Suivi déjà {suivi.statut === 'VALIDE' ? 'validé' : 'refusé'}
                </h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Ce suivi a déjà été {suivi.statut === 'VALIDE' ? 'validé' : 'refusé'} et ne peut
                  plus être modifié.
                </p>
              </div>
            </div>
          )}

          {/* Infos contrat */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Informations du contrat</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Enfant:</span>{' '}
                <span className="font-medium">
                  {suivi.contrat?.enfant?.prenom} {suivi.contrat?.enfant?.nom}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Assistante:</span>{' '}
                <span className="font-medium">
                  {suivi.contrat?.assistant?.utilisateur?.prenom}{' '}
                  {suivi.contrat?.assistant?.utilisateur?.nom}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Date:</span>{' '}
                <span className="font-medium">
                  {new Date(suivi.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>
          </div>

          {/* Formulaire de validation */}
          <div className="space-y-4">
            {/* Horaires */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure d'arrivée
                </label>
                <input
                  type="time"
                  value={formatMinutesToTime(arriveeMinutes)}
                  onChange={(e) => setArriveeMinutes(parseTimeToMinutes(e.target.value))}
                  disabled={suivi.statut !== 'EN_ATTENTE'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de départ
                </label>
                <input
                  type="time"
                  value={formatMinutesToTime(departMinutes)}
                  onChange={(e) => setDepartMinutes(parseTimeToMinutes(e.target.value))}
                  disabled={suivi.statut !== 'EN_ATTENTE'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Repas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de repas fournis
              </label>
              <input
                type="number"
                min="0"
                value={repasFournis}
                onChange={(e) => setRepasFournis(parseInt(e.target.value) || 0)}
                disabled={suivi.statut !== 'EN_ATTENTE'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {/* Frais divers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais divers (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fraisDivers ?? ''}
                onChange={(e) => setFraisDivers(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="0.00"
                disabled={suivi.statut !== 'EN_ATTENTE'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {/* Kilomètres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kilomètres parcourus
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={km ?? ''}
                onChange={(e) => setKm(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="0"
                disabled={suivi.statut !== 'EN_ATTENTE'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaire (optionnel)
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={3}
                placeholder="Ajouter un commentaire..."
                disabled={suivi.statut !== 'EN_ATTENTE'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Commentaire parent existant */}
          {suivi.commentairesParent && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Commentaire précédent</h4>
              <p className="text-sm text-blue-800">{suivi.commentairesParent}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            type="gray"
            text="Annuler"
            onClick={onClose}
            icon={<X size={16} />}
            disabled={loading}
          />
          <Button
            type="red"
            text="Refuser"
            icon={<X size={16} />}
            onClick={() => handleValider('REFUSE')}
            disabled={loading || suivi.statut !== 'EN_ATTENTE'}
          />
          <Button
            type="primary"
            icon={<CheckCircle size={16} />}
            text={loading ? 'Validation...' : 'Valider'}
            onClick={() => handleValider('VALIDE')}
            disabled={loading || suivi.statut !== 'EN_ATTENTE'}
          />
        </div>
      </div>
    </div>
  )
}
