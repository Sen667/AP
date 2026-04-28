'use client'

import { createEnfant } from '@/app/lib/api/enfant'
import { CreateEnfantSchema, type CreateEnfantData } from '@/app/schemas/enfant/add-enfant'
import type { UtilisateurModel } from '@/app/types/models/utilisateur'
import { Plus, XCircle } from '@deemlol/next-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

interface Props {
  user: UtilisateurModel
  onSuccess: () => void
  onClose?: () => void
}

export default function AddEnfantModal({ user, onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register: rhf,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEnfantData>({
    resolver: zodResolver(CreateEnfantSchema),
  })

  const onSubmit = async (values: CreateEnfantData) => {
    setLoading(true)
    setError(null)

    try {
      await createEnfant(values)
      toast.success(`L'enfant ${values.prenom} ${values.nom} a été ajouté !`)
      onSuccess()
      if (onClose) onClose()
    } catch (err: any) {
      const message = err?.response?.data?.message || "Erreur lors de l'ajout"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-full max-w-lg max-sm:max-w-full rounded-md max-sm:p-4 p-6 shadow-lg relative max-h-[90vh] overflow-y-auto"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Bouton pour fermer */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 font-bold text-2xl cursor-pointer"
          >
            <XCircle size={20} color="black" />
          </button>

          <h2 className="max-sm:text-base text-lg font-semibold max-sm:mb-2 mb-2">
            Ajouter un enfant
          </h2>
          <p className="max-sm:text-xs text-sm text-gray-500 max-sm:mb-3 mb-4">
            Remplissez les informations de l&apos;enfant.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nom */}
            <div>
              <label htmlFor="nom" className="text-xs font-medium text-gray-600">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                id="nom"
                placeholder="Nom"
                {...rhf('nom')}
                className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nom && (
                <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm mt-1">
                  {errors.nom.message}
                </p>
              )}
            </div>

            {/* Prénom */}
            <div>
              <label htmlFor="prenom" className="text-xs font-medium text-gray-600">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                id="prenom"
                placeholder="Prénom"
                {...rhf('prenom')}
                className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                  errors.prenom ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.prenom && (
                <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm mt-1">
                  {errors.prenom.message}
                </p>
              )}
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="dateNaissance" className="text-xs font-medium text-gray-600">
                Date de naissance <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dateNaissance"
                placeholder="Date de naissance"
                {...rhf('dateNaissance')}
                className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                  errors.dateNaissance ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateNaissance && (
                <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm mt-1">
                  {errors.dateNaissance.message}
                </p>
              )}
            </div>

            {/* Sexe */}
            <div>
              <label htmlFor="sexe" className="text-xs font-medium text-gray-600">
                Sexe <span className="text-red-500">*</span>
              </label>
              <select
                id="sexe"
                {...rhf('sexe')}
                className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                  errors.sexe ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez le sexe</option>
                <option value="MASCULIN">Masculin</option>
                <option value="FEMININ">Féminin</option>
              </select>
              {errors.sexe && (
                <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm mt-1">
                  {errors.sexe.message}
                </p>
              )}
            </div>

            {/* Allergies */}
            <div>
              <label htmlFor="allergies" className="text-xs font-medium text-gray-600">
                Allergies (optionnel)
              </label>
              <input
                id="allergies"
                placeholder="Allergies (optionnel)"
                {...rhf('allergies')}
                className="w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary border-gray-300"
              />
            </div>

            {/* Remarques médicales */}
            <div>
              <label htmlFor="remarquesMedicales" className="text-xs font-medium text-gray-600">
                Remarques médicales (optionnel)
              </label>
              <input
                id="remarquesMedicales"
                placeholder="Remarques médicales (optionnel)"
                {...rhf('remarquesMedicales')}
                className="w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary border-gray-300"
              />
            </div>

            {/* Médecin traitant */}
            <div>
              <label htmlFor="medecinTraitant" className="text-xs font-medium text-gray-600">
                Médecin traitant <span className="text-red-500">*</span>
              </label>
              <input
                id="medecinTraitant"
                placeholder="Médecin traitant"
                {...rhf('medecinTraitant')}
                className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                  errors.medecinTraitant ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.medecinTraitant && (
                <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm mt-1">
                  {errors.medecinTraitant.message}
                </p>
              )}
            </div>

            {/* Téléphone médecin */}
            <div>
              <label htmlFor="medecinTraitantTel" className="text-xs font-medium text-gray-600">
                Téléphone du médecin <span className="text-red-500">*</span>
              </label>
              <input
                id="medecinTraitantTel"
                placeholder="Téléphone du médecin"
                {...rhf('medecinTraitantTel')}
                className={`w-full px-3 py-1.5 border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                  errors.medecinTraitantTel ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.medecinTraitantTel && (
                <p className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-sm mt-1">
                  {errors.medecinTraitantTel.message}
                </p>
              )}
            </div>

            {/* Erreur globale */}
            {error && (
              <p className="text-xs text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white max-sm:py-2 py-2 rounded-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer font-medium max-sm:text-sm text-sm flex items-center gap-2 justify-center"
            >
              <Plus size={16} />
              {loading ? 'Ajout en cours...' : "Ajouter l'enfant"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
