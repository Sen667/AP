'use client'

import Button from '@/app/components/ui/Button'
import { updateContratGarde } from '@/app/lib/api/contratGarde'
import {
  UpdateContratGardeSchema,
  type UpdateContratGardeData,
} from '@/app/schemas/modal/contrat-garde.schema'
import { StatutContrat } from '@/app/types/enums'
import type { ContratGardeModel } from '@/app/types/models/contrat-garde'
import { Check, XCircle } from '@deemlol/next-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

interface UpdateContratModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  contrat: ContratGardeModel
}

export default function UpdateContratModal({
  isOpen,
  onClose,
  onSuccess,
  contrat,
}: UpdateContratModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateContratGardeData>({
    resolver: zodResolver(UpdateContratGardeSchema) as any,
    mode: 'onChange',
    defaultValues: {
      dateDebut: '',
      dateFin: '',
      statut: StatutContrat.ACTIF,
      tarifHoraireBrut: 0,
      nombreHeuresSemaine: 0,
      indemniteEntretien: 0,
      indemniteRepas: 0,
      indemniteKm: 0,
    },
  })

  useEffect(() => {
    if (isOpen && contrat) {
      const dateDebut = new Date(contrat.dateDebut)
      const dateFin = contrat.dateFin ? new Date(contrat.dateFin) : null

      reset({
        dateDebut: dateDebut.toISOString().split('T')[0],
        dateFin: dateFin ? dateFin.toISOString().split('T')[0] : '',
        statut: contrat.statut as StatutContrat,
        tarifHoraireBrut: contrat.tarifHoraireBrut,
        nombreHeuresSemaine: contrat.nombreHeuresSemaine,
        indemniteEntretien: contrat.indemniteEntretien,
        indemniteRepas: contrat.indemniteRepas,
        indemniteKm: contrat.indemniteKm || 0,
      })
    }
  }, [isOpen, contrat, reset])

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  const onSubmit = async (values: UpdateContratGardeData) => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        dateDebut: values.dateDebut,
        dateFin: values.dateFin || undefined,
        statut: values.statut,
        tarifHoraireBrut: values.tarifHoraireBrut,
        nombreHeuresSemaine: values.nombreHeuresSemaine,
        indemniteEntretien: values.indemniteEntretien,
        indemniteRepas: values.indemniteRepas,
        indemniteKm: values.indemniteKm || undefined,
      }

      await updateContratGarde(contrat.id, payload)
      onSuccess()
      handleClose()
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erreur lors de la mise à jour du contrat'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const assistante = contrat.assistant?.utilisateur

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
                <h2 className="text-xl font-semibold text-gray-900">
                  Modifier le contrat de garde
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Avec {assistante?.prenom} {assistante?.nom}
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
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                  <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Statut de validation info */}
              <div className="mb-6">
                {contrat.statut === 'EN_ATTENTE_VALIDATION' && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">⏳</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-900 text-sm">
                          En attente de validation
                        </h3>
                        <p className="text-sm text-orange-800 mt-1">
                          L&apos;assistante maternelle doit valider ce contrat avant qu&apos;il ne
                          devienne actif.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {contrat.statut === 'ACTIF' && (
                  <div className="bg-gray-200 border-l-4 border-primary p-4 rounded">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">✓</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary text-sm">Contrat actif</h3>
                        <p className="text-sm text-primary mt-1">
                          Ce contrat a été validé et est actuellement actif.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {contrat.statut === 'TERMINE' && (
                  <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">✗</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">Contrat terminé</h3>
                        <p className="text-sm text-gray-800 mt-1">Ce contrat est terminé.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Statut du contrat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut du contrat <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('statut')}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.statut ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value={StatutContrat.EN_ATTENTE_VALIDATION}>En attente</option>
                    <option value={StatutContrat.ACTIF}>Actif</option>
                    <option value={StatutContrat.SUSPENDU}>Suspendu</option>
                    <option value={StatutContrat.TERMINE}>Terminé</option>
                  </select>
                  {errors.statut && (
                    <p className="text-sm text-red-500 mt-1">{errors.statut.message}</p>
                  )}
                </div>

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
                      <p className="text-sm text-red-500 mt-1">{errors.tarifHoraireBrut.message}</p>
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
                        <p className="text-sm text-red-500 mt-1">{errors.indemniteRepas.message}</p>
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
                  text={loading ? 'Mise à jour...' : 'Mettre à jour'}
                  icon={<Check size={18} />}
                  onClick={() => handleSubmit(onSubmit)()}
                  className="flex-1"
                  disabled={loading}
                />
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
