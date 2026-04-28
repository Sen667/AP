'use client'

import { createParentProfile } from '@/app/lib/api/user'
import { ParentModalSchema, type ParentModalData } from '@/app/schemas/modal/parent.schema'
import type { UtilisateurModel } from '@/app/types/models/utilisateur'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  user: UtilisateurModel
  onSuccess: (message: string) => void
}

export default function ParentProfilModal({ user, onSuccess }: Props) {
  const [modalOpen, setModalOpen] = useState(!user.parentProfil)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parentProfil = user.parentProfil

  const defaultValues: Partial<ParentModalData> = {
    adresse: parentProfil?.adresse ?? '',
    codePostal: parentProfil?.codePostal ?? '',
    ville: parentProfil?.ville ?? '',
    situationFamiliale: parentProfil?.situationFamiliale ?? '',
    profession: parentProfil?.profession ?? null,
    employeur: parentProfil?.employeur ?? null,
    numeroAllocataire: parentProfil?.numeroAllocataire ?? null,
    beneficiaireCAF: parentProfil?.beneficiaireCAF ?? false,
    contactUrgenceNom: parentProfil?.contactUrgenceNom ?? '',
    contactUrgenceTel: parentProfil?.contactUrgenceTel ?? '',
  }

  const {
    register: rhf,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentModalData>({
    resolver: zodResolver(ParentModalSchema),
    defaultValues,
  })

  const onSubmit = async (values: ParentModalData) => {
    setLoading(true)
    setError(null)

    try {
      await createParentProfile(values)
      setModalOpen(false)
      onSuccess('Bienvenue dans votre espace parent !')
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erreur lors de la sauvegarde'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-2xl max-sm:max-w-full rounded-md max-sm:p-4 p-6 shadow-lg relative max-h-[90vh] overflow-y-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h2 className="max-sm:text-base text-lg font-semibold max-sm:mb-2 mb-2">
              Complétez votre profil
            </h2>
            <p className="max-sm:text-xs text-sm text-gray-500 max-sm:mb-3 mb-4">
              Ces informations sont nécessaires pour accéder à votre espace personnel.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="max-sm:space-y-3 space-y-4">
              <div className="space-y-3">
                {/* Adresse */}
                <label htmlFor="adresse" className="text-xs font-medium text-gray-600">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  id="adresse"
                  placeholder="Adresse"
                  {...rhf('adresse')}
                  className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                    errors.adresse ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.adresse && (
                  <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                    {errors.adresse.message}
                  </p>
                )}
              </div>

              {/* Code Postal / Ville */}
              <div className="grid grid-cols-1 max-sm:gap-3 sm:grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label htmlFor="codePostal" className="text-xs font-medium text-gray-600">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="codePostal"
                    placeholder="Code postal"
                    {...rhf('codePostal')}
                    className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.codePostal ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.codePostal && (
                    <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                      {errors.codePostal.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label htmlFor="ville" className="text-xs font-medium text-gray-600">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="ville"
                    placeholder="Ville"
                    {...rhf('ville')}
                    className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.ville ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.ville && (
                    <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                      {errors.ville.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Situation Familiale */}
              <div className="space-y-3">
                <label htmlFor="situationFamiliale" className="text-xs font-medium text-gray-600">
                  Situation familiale <span className="text-red-500">*</span>
                </label>
                <input
                  id="situationFamiliale"
                  placeholder="Situation familiale"
                  {...rhf('situationFamiliale')}
                  className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                    errors.situationFamiliale ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.situationFamiliale && (
                  <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                    {errors.situationFamiliale.message}
                  </p>
                )}
              </div>

              {/* Bénéficiaire CAF */}
              <div className="flex items-center gap-2">
                <input id="beneficiaireCAF" type="checkbox" {...rhf('beneficiaireCAF')} />
                <label htmlFor="beneficiaireCAF" className="text-xs font-medium text-gray-600">
                  Bénéficiaire CAF
                </label>
              </div>

              <div className="space-y-3">
                <label htmlFor="numeroCAF" className="text-xs font-medium text-gray-600">
                  Numéro CAF
                </label>
                <input
                  id="numeroCAF"
                  placeholder="Numéro CAF"
                  {...rhf('numeroCAF')}
                  className="w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary border-gray-300"
                />
              </div>

              {/* Contact urgence */}
              <div className="space-y-3">
                <label htmlFor="contactUrgenceNom" className="text-xs font-medium text-gray-600">
                  Contact urgence - Nom <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactUrgenceNom"
                  placeholder="Contact urgence - Nom"
                  {...rhf('contactUrgenceNom')}
                  className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                    errors.contactUrgenceNom ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactUrgenceNom && (
                  <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                    {errors.contactUrgenceNom.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="contactUrgenceTel" className="text-xs font-medium text-gray-600">
                  Contact urgence - Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactUrgenceTel"
                  placeholder="Contact urgence - Téléphone"
                  {...rhf('contactUrgenceTel')}
                  className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                    errors.contactUrgenceTel ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactUrgenceTel && (
                  <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                    {errors.contactUrgenceTel.message}
                  </p>
                )}
              </div>

              {/* Erreur / succès globale */}
              {error && (
                <p className="text-[0.8rem] text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-sm">
                  {error}
                </p>
              )}

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white max-sm:py-2 py-2 rounded-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer font-medium max-sm:text-sm text-sm flex items-center justify-center gap-2"
              >
                {loading ? 'Enregistrement...' : 'Valider'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
