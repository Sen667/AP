'use client'

import Button from '@/app/components/ui/Button'
import { toastConfig } from '@/app/config/toast.config'
import { createPersonneAutorisee, updatePersonneAutorisee } from '@/app/lib/api/personneAutorisee'
import {
  CreatePersonneAutoriseeSchema,
  type CreatePersonneAutoriseeData,
} from '@/app/schemas/personne-autorisee/create.schema'
import type { PersonneAutoriseeModel } from '@/app/types/models/personne-autorisee'
import { Check, X, XCircle } from '@deemlol/next-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

interface PersonneAutoriseeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
  enfantId: number
  enfantPrenom: string
  personneToEdit?: PersonneAutoriseeModel | null
}

export default function PersonneAutoriseeModal({
  isOpen,
  onClose,
  onSuccess,
  enfantId,
  enfantPrenom,
  personneToEdit,
}: PersonneAutoriseeModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePersonneAutoriseeData>({
    resolver: zodResolver(CreatePersonneAutoriseeSchema),
    defaultValues: {
      enfantId,
      prenom: '',
      nom: '',
      telephone: '',
      email: '',
      lien: '',
    },
  })

  // Remplir les champs quand personneToEdit change
  useEffect(() => {
    if (personneToEdit) {
      reset({
        enfantId,
        prenom: personneToEdit.prenom,
        nom: personneToEdit.nom,
        telephone: personneToEdit.telephone,
        email: personneToEdit.email,
        lien: personneToEdit.lien || '',
      })
    } else {
      reset({
        enfantId,
        prenom: '',
        nom: '',
        telephone: '',
        email: '',
        lien: '',
      })
    }
  }, [personneToEdit, enfantId, reset])

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  const onSubmit = async (values: CreatePersonneAutoriseeData) => {
    try {
      setLoading(true)
      setError(null)

      if (personneToEdit) {
        // Mode édition
        await updatePersonneAutorisee(personneToEdit.id, {
          enfantId,
          prenom: values.prenom,
          nom: values.nom,
          telephone: values.telephone,
          email: values.email,
          lien: values.lien,
        })
        toast.success('Personne autorisée mise à jour', toastConfig)
      } else {
        // Mode création
        await createPersonneAutorisee({
          enfantId,
          prenom: values.prenom,
          nom: values.nom,
          telephone: values.telephone,
          email: values.email,
          lien: values.lien,
        })
        toast.success('Personne autorisée ajoutée', toastConfig)
      }

      onSuccess(personneToEdit ? 'Personne autorisée mise à jour' : 'Personne autorisée ajoutée')
      handleClose()
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue'
      setError(errorMessage)
      toast.error(errorMessage, toastConfig)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="personne-autorisee-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-lg rounded-md max-sm:p-4 p-6 shadow-lg relative max-h-[90vh] overflow-y-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Bouton pour fermer */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 font-bold text-2xl cursor-pointer"
              type="button"
              disabled={loading}
            >
              <XCircle size={20} color="black" />
            </button>

            <h2 className="max-sm:text-base text-lg font-semibold mb-2">
              {personneToEdit
                ? 'Modifier une personne autorisée'
                : 'Ajouter une personne autorisée'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Gérez les personnes autorisées à chercher {enfantPrenom}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Prénom"
                  {...register('prenom')}
                  className={`w-full px-3 py-2 text-sm border rounded-sm outline-none focus:ring-1 focus:ring-primary transition ${
                    errors.prenom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.prenom && (
                  <p className="text-xs text-red-500 mt-1">{errors.prenom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nom"
                  {...register('nom')}
                  className={`w-full px-3 py-2 text-sm border rounded-sm outline-none focus:ring-1 focus:ring-primary transition ${
                    errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Téléphone"
                  {...register('telephone')}
                  className={`w-full px-3 py-2 text-sm border rounded-sm outline-none focus:ring-1 focus:ring-primary transition ${
                    errors.telephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.telephone && (
                  <p className="text-xs text-red-500 mt-1">{errors.telephone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="email@exemple.fr"
                  {...register('email')}
                  className={`w-full px-3 py-2 text-sm border rounded-sm outline-none focus:ring-1 focus:ring-primary transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Lien avec l&apos;enfant
                </label>
                <input
                  type="text"
                  placeholder="Ex: Grand-mère, Oncle, Tante..."
                  {...register('lien')}
                  className={`w-full px-3 py-2 text-sm border rounded-sm outline-none focus:ring-1 focus:ring-primary transition ${
                    errors.lien ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.lien && <p className="text-xs text-red-500 mt-1">{errors.lien.message}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="gray"
                  icon={<X size={16} />}
                  text="Annuler"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 text-sm bg-primary text-white rounded-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer font-medium flex items-center gap-2 justify-center"
                >
                  <Check size={16} />
                  {loading
                    ? personneToEdit
                      ? 'Modification en cours...'
                      : 'Ajout en cours...'
                    : personneToEdit
                      ? 'Modifier'
                      : 'Ajouter'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
