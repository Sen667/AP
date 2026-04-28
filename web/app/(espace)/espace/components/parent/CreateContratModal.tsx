'use client'

import Button from '@/app/components/ui/Button'
import { createContratGarde, getEnfantsGardesParAssistant } from '@/app/lib/api/contratGarde'
import { getParentEnfants } from '@/app/lib/api/enfant'
import {
  CreateContratGardeSchema,
  type CreateContratGardeData,
} from '@/app/schemas/modal/contrat-garde.schema'
import type { EnfantModel } from '@/app/types/models/enfant'
import type { UtilisateurModel } from '@/app/types/models/utilisateur'
import { Check, XCircle } from '@deemlol/next-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

interface CreateContratModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  assistante: UtilisateurModel
  enfantId?: number // Enfant pré-sélectionné (optionnel)
}

export default function CreateContratModal({
  isOpen,
  onClose,
  onSuccess,
  assistante,
  enfantId: preSelectedEnfantId,
}: CreateContratModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enfants, setEnfants] = useState<EnfantModel[]>([])
  const [enfantsGardes, setEnfantsGardes] = useState<EnfantModel[]>([])
  const [loadingEnfants, setLoadingEnfants] = useState(true)
  const [loadingEnfantsGardes, setLoadingEnfantsGardes] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateContratGardeSchema),
    mode: 'onChange',
    defaultValues: {
      enfantId: preSelectedEnfantId ? preSelectedEnfantId : 0,
      assistantId: assistante.assistantProfil!.id,
      dateDebut: '',
      dateFin: '',
    },
  } as const)

  useEffect(() => {
    if (isOpen) {
      if (!preSelectedEnfantId) {
        loadEnfants()
      } else {
        setLoadingEnfants(false)
      }
      loadEnfantsGardes()
    }
  }, [isOpen, preSelectedEnfantId])

  const loadEnfants = async () => {
    try {
      setLoadingEnfants(true)
      const data = await getParentEnfants()
      setEnfants(data)
    } catch (error: any) {
      toast.error('Erreur lors du chargement des enfants')
    } finally {
      setLoadingEnfants(false)
    }
  }

  const loadEnfantsGardes = async () => {
    try {
      setLoadingEnfantsGardes(true)
      const data = await getEnfantsGardesParAssistant(assistante.assistantProfil!.id)
      setEnfantsGardes(data)
    } catch (error: any) {
      console.error('Erreur lors du chargement des enfants gardés', error)
      setEnfantsGardes([])
    } finally {
      setLoadingEnfantsGardes(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  const onSubmit = async (values: CreateContratGardeData) => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        enfantId: values.enfantId,
        assistantId: assistante.assistantProfil!.id,
        dateDebut: values.dateDebut,
        dateFin: values.dateFin || undefined,
        tarifHoraireBrut: values.tarifHoraireBrut,
        nombreHeuresSemaine: values.nombreHeuresSemaine,
        indemniteEntretien: values.indemniteEntretien,
        indemniteRepas: values.indemniteRepas,
        indemniteKm: values.indemniteKm || undefined,
      }

      await createContratGarde(payload)
      onSuccess()
      handleClose()
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erreur lors de la création du contrat'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Nouveau contrat de garde</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Avec {assistante.prenom} {assistante.nom}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={24} className="cursor-pointer" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              {/* Champ caché pour l'assistantId */}
              <input type="hidden" {...register('assistantId')} />

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                  <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {loadingEnfants ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement des enfants...</p>
                </div>
              ) : !preSelectedEnfantId && enfants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Vous devez d&apos;abord ajouter un enfant avant de créer un contrat.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sélection de l'enfant - seulement si pas pré-sélectionné */}
                  {preSelectedEnfantId ? (
                    <input type="hidden" {...register('enfantId')} />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enfant <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('enfantId', { valueAsNumber: true })}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.enfantId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionnez un enfant</option>
                        {enfants.map((enfant) => (
                          <option key={enfant.id} value={enfant.id}>
                            {enfant.prenom} {enfant.nom}
                          </option>
                        ))}
                      </select>
                      {errors.enfantId && (
                        <p className="text-sm text-red-500 mt-1">{errors.enfantId.message}</p>
                      )}
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de début <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register('dateDebut')}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.dateDebut ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.dateDebut && (
                        <p className="text-sm text-red-500 mt-1">{errors.dateDebut.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin (optionnelle)
                      </label>
                      <input
                        type="date"
                        {...register('dateFin')}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.dateFin ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.dateFin && (
                        <p className="text-sm text-red-500 mt-1">{errors.dateFin.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Tarif et heures */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tarif horaire brut (€) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register('tarifHoraireBrut', {
                          valueAsNumber: true,
                        })}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.tarifHoraireBrut ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="3.50"
                      />
                      {errors.tarifHoraireBrut && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.tarifHoraireBrut.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heures par semaine <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        {...register('nombreHeuresSemaine', {
                          valueAsNumber: true,
                        })}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.nombreHeuresSemaine ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="40"
                      />
                      {errors.nombreHeuresSemaine && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.nombreHeuresSemaine.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Indemnités */}
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Indemnités</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Entretien (€) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register('indemniteEntretien', {
                            valueAsNumber: true,
                          })}
                          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.indemniteEntretien ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="3.50"
                        />
                        {errors.indemniteEntretien && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.indemniteEntretien.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Repas (€) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register('indemniteRepas', {
                            valueAsNumber: true,
                          })}
                          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.indemniteRepas ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="4.00"
                        />
                        {errors.indemniteRepas && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.indemniteRepas.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kilométrique (€) - Optionnelle
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register('indemniteKm', {
                            valueAsNumber: true,
                          })}
                          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.indemniteKm ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.50"
                        />
                        {errors.indemniteKm && (
                          <p className="text-sm text-red-500 mt-1">{errors.indemniteKm.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  type="gray"
                  text="Annuler"
                  icon={<XCircle size={18} />}
                  onClick={handleClose}
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  type="primary"
                  text={loading ? 'Création...' : 'Créer le contrat'}
                  icon={<Check size={18} />}
                  onClick={handleSubmit(onSubmit)}
                  className="flex-1"
                  disabled={
                    loading || loadingEnfants || (!preSelectedEnfantId && enfants.length === 0)
                  }
                />
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
