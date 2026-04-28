'use client'

import { createAssistantProfile } from '@/app/lib/api/user'
import { AssistantModalSchema, type AssistantModalData } from '@/app/schemas/modal/assistant.schema'
import type { UtilisateurModel } from '@/app/types/models/utilisateur'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  user: UtilisateurModel
  onSuccess: (message: string) => void
}

export default function AssistantProfilModal({ user, onSuccess }: Props) {
  type AssistantModalInput = z.input<typeof AssistantModalSchema>

  const [modalOpen, setModalOpen] = useState(!user.assistantProfil)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assistantProfil = user.assistantProfil

  const defaultValues: Partial<AssistantModalData> = {
    numeroAgrement: assistantProfil?.numeroAgrement ?? '',
    adresse: assistantProfil?.adresse ?? '',
    codePostal: assistantProfil?.codePostal ?? '',
    ville: assistantProfil?.ville ?? '',
    dateObtentionAgrement: assistantProfil?.dateObtentionAgrement ?? '',
    dateFinAgrement: assistantProfil?.dateFinAgrement ?? null,
    capaciteAccueil: assistantProfil?.capaciteAccueil ? Number(assistantProfil.capaciteAccueil) : 1,
    experience: assistantProfil?.experience ? Number(assistantProfil.experience) : 0,
    disponibilites: assistantProfil?.disponibilites ?? '',
  }

  const {
    register: rhf,
    handleSubmit,
    formState: { errors },
  } = useForm<AssistantModalInput, undefined, AssistantModalData>({
    resolver: zodResolver(AssistantModalSchema),
    defaultValues,
  })

  const onSubmit = async (values: AssistantModalData) => {
    setLoading(true)
    setError(null)

    try {
      await createAssistantProfile(values)
      setModalOpen(false)
      onSuccess('Bienvenue dans votre espace assistant !')
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
            <h2 className="text-lg font-semibold mb-2">Compl&eacute;tez votre profil</h2>
            <p className="text-sm text-gray-500 mb-4">
              Ces informations sont n&eacute;cessaires pour acc&eacute;der &agrave; votre espace
              personnel.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Numéro d&apos;agrément */}
              <div className="space-y-3">
                <label htmlFor="numeroAgrement" className="text-xs font-medium text-gray-600">
                  Numéro d&apos;agrément <span className="text-red-500">*</span>
                </label>
                <input
                  id="numeroAgrement"
                  placeholder="Numéro d'agrément"
                  {...rhf('numeroAgrement')}
                  className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                    errors.numeroAgrement ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.numeroAgrement && (
                  <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                    {errors.numeroAgrement.message}
                  </p>
                )}
              </div>

              {/* Adresse */}
              <div className="space-y-3">
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
              <div className="grid grid-cols-2 gap-3">
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

              {/* Dates & validité d&apos;agrément */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label
                    htmlFor="dateObtentionAgrement"
                    className="text-xs font-medium text-gray-600"
                  >
                    Date obtention agr&eacute;ment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateObtentionAgrement"
                    {...rhf('dateObtentionAgrement')}
                    className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.dateObtentionAgrement ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input id="agrementValide" type="checkbox" {...rhf('agrementValide')} />
                  <label htmlFor="agrementValide" className="text-xs font-medium text-gray-600">
                    Agrément valide
                  </label>
                </div>
              </div>

              {/* Date fin d&apos;agrément */}
              <div className="space-y-3">
                <label htmlFor="dateFinAgrement" className="text-xs font-medium text-gray-600">
                  Date fin agr&eacute;ment (optionnel)
                </label>
                <input
                  type="date"
                  id="dateFinAgrement"
                  {...rhf('dateFinAgrement')}
                  className="w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary border-gray-300"
                />
              </div>

              {/* Capacité / Expérience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label htmlFor="capaciteAccueil" className="text-xs font-medium text-gray-600">
                    Capacit&eacute; d&apos;accueil <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="capaciteAccueil"
                    placeholder="Capacit&eacute; d'accueil"
                    {...rhf('capaciteAccueil')}
                    className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.capaciteAccueil ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.capaciteAccueil && (
                    <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                      {errors.capaciteAccueil.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label htmlFor="experience" className="text-xs font-medium text-gray-600">
                    Exp&eacute;rience (ann&eacute;es) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="experience"
                    placeholder="Exp&eacute;rience (ann&eacute;es)"
                    {...rhf('experience')}
                    className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.experience && (
                    <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                      {errors.experience.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Disponibilit&eacute;s */}
              <div className="space-y-3">
                <label htmlFor="disponibilites" className="text-xs font-medium text-gray-600">
                  Disponibilit&eacute;s (optionnel)
                </label>
                <textarea
                  id="disponibilites"
                  placeholder="Disponibilit&eacute;s (optionnel)"
                  {...rhf('disponibilites')}
                  className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                    errors.disponibilites ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.disponibilites && (
                  <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm">
                    {errors.disponibilites.message}
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
