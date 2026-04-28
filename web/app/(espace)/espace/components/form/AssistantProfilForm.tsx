'use client'

import { updateAssistantProfile } from '@/app/lib/api/user'
import {
  AssistantUpdateSchema,
  type AssistantUpdateData,
} from '@/app/schemas/profil/assistant.schema'
import type { AssistantProfilModel } from '@/app/types/models/assistant-profil'
import type { UtilisateurModel } from '@/app/types/models/utilisateur'
import { Check } from '@deemlol/next-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import type { z } from 'zod'

interface AssistantProfilFormProps {
  user: UtilisateurModel
  assistantProfil?: AssistantProfilModel
}

export default function AssistantProfilForm({ user, assistantProfil }: AssistantProfilFormProps) {
  type AssistantUpdateInput = z.input<typeof AssistantUpdateSchema>

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValues: AssistantUpdateInput = {
    nom: user.nom,
    prenom: user.prenom,
    telephone: user.telephone,
    dateNaissance: user.dateNaissance,
    adresse: assistantProfil?.adresse ?? '',
    codePostal: assistantProfil?.codePostal ?? '',
    ville: assistantProfil?.ville ?? '',
    numeroAgrement: assistantProfil?.numeroAgrement ?? '',
    dateObtentionAgrement: assistantProfil?.dateObtentionAgrement ?? '',
    dateFinAgrement: assistantProfil?.dateFinAgrement ?? null,
    capaciteAccueil: assistantProfil?.capaciteAccueil ?? 1,
    experience: assistantProfil?.experience ?? 0,
    disponibilites: assistantProfil?.disponibilites ?? '',
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssistantUpdateInput, undefined, AssistantUpdateData>({
    resolver: zodResolver(AssistantUpdateSchema),
    defaultValues,
  })

  const onSubmit = async (values: AssistantUpdateData) => {
    setLoading(true)
    setError(null)

    try {
      await updateAssistantProfile(values)
      reset(values)
      toast.success('Profil mis à jour avec succès')
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erreur lors de la sauvegarde'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-sm:p-4 p-6 bg-white border border-gray-200 rounded-sm">
      <p className="text-xs text-gray-500 mb-4">
        <span className="text-red-500">*</span> Champ obligatoire
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* --- Informations personnelles --- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Informations personnelles</h4>
            <hr className="border-gray-300" />
          </div>
          {/* Nom et prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="nom" className="block text-xs font-medium text-gray-600 mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                id="nom"
                type="text"
                {...register('nom')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nom && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.nom.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="prenom" className="block text-xs font-medium text-gray-600 mb-1">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                id="prenom"
                type="text"
                {...register('prenom')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.prenom ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.prenom && (
                <p className="text-xs text-red-500 mt-2 font-medium">{errors.prenom.message}</p>
              )}
            </div>
          </div>

          {/* Téléphone et date de naissance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="telephone" className="block text-xs font-medium text-gray-600 mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                id="telephone"
                type="tel"
                {...register('telephone')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.telephone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.telephone && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.telephone.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="dateNaissance"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Date de naissance <span className="text-red-500">*</span>
              </label>
              <input
                id="dateNaissance"
                type="date"
                {...register('dateNaissance')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.dateNaissance ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.dateNaissance && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.dateNaissance.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- Agrément --- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Agrément</h4>
            <hr className="border-gray-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="numeroAgrement"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Numéro d&apos;agrément <span className="text-red-500">*</span>
              </label>
              <input
                id="numeroAgrement"
                type="text"
                {...register('numeroAgrement')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.numeroAgrement ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.numeroAgrement && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  {errors.numeroAgrement.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dateObtentionAgrement"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Date obtention <span className="text-red-500">*</span>
              </label>
              <input
                id="dateObtentionAgrement"
                type="date"
                {...register('dateObtentionAgrement')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.dateObtentionAgrement ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.dateObtentionAgrement && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  {errors.dateObtentionAgrement.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- Adresse et capacité --- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Adresse & capacité</h4>
            <hr className="border-gray-300" />
          </div>
          <div>
            <label htmlFor="adresse" className="block text-xs font-medium text-gray-600 mb-1">
              Adresse <span className="text-red-500">*</span>
            </label>
            <input
              id="adresse"
              type="text"
              {...register('adresse')}
              className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.adresse ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.adresse && (
              <p className="text-xs text-red-500 mt-2 font-medium">{errors.adresse.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="codePostal" className="block text-xs font-medium text-gray-600 mb-1">
                Code postal <span className="text-red-500">*</span>
              </label>
              <input
                id="codePostal"
                type="text"
                {...register('codePostal')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.codePostal ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.codePostal && (
                <p className="text-xs text-red-500 mt-2 font-medium">{errors.codePostal.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="ville" className="block text-xs font-medium text-gray-600 mb-1">
                Ville <span className="text-red-500">*</span>
              </label>
              <input
                id="ville"
                type="text"
                {...register('ville')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.ville ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ville && (
                <p className="text-xs text-red-500 mt-2 font-medium">{errors.ville.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="capaciteAccueil"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Capacité d&apos;accueil <span className="text-red-500">*</span>
            </label>
            <input
              id="capaciteAccueil"
              type="number"
              {...register('capaciteAccueil', { valueAsNumber: true })}
              className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.capaciteAccueil ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.capaciteAccueil && (
              <p className="text-xs text-red-500 mt-2 font-medium">
                {errors.capaciteAccueil.message}
              </p>
            )}
          </div>
        </div>

        {/* --- Expérience et disponibilités --- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Expérience & disponibilités</h4>
            <hr className="border-gray-300" />
          </div>
          <div>
            <label htmlFor="experience" className="block text-xs font-medium text-gray-600 mb-1">
              Expérience (années) <span className="text-red-500">*</span>
            </label>
            <input
              id="experience"
              type="number"
              {...register('experience', { valueAsNumber: true })}
              className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.experience && (
              <p className="text-xs text-red-500 mt-2 font-medium">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="disponibilites"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Disponibilités
            </label>
            <textarea
              id="disponibilites"
              {...register('disponibilites')}
              className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.disponibilites ? 'border-red-500' : 'border-gray-300'}`}
              rows={4}
            />
            {errors.disponibilites && (
              <p className="text-xs text-red-500 mt-2 font-medium">
                {errors.disponibilites.message}
              </p>
            )}
          </div>
        </div>

        {/* --- Message d'erreur API --- */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-xs text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* --- Bouton --- */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full bg-primary text-white max-sm:py-2 py-2 rounded-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer font-medium max-sm:text-sm text-sm flex items-center justify-center gap-2"
        >
          <Check size={16} />
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
