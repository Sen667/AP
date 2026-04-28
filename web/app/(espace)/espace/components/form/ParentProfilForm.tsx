'use client'

import { updateParentProfile } from '@/app/lib/api/user'
import { ParentUpdateSchema, type ParentUpdateData } from '@/app/schemas/profil/parent.schema'
import type { ParentProfilModel } from '@/app/types/models/parent-profil'
import type { UtilisateurModel } from '@/app/types/models/utilisateur'
import { Save } from '@deemlol/next-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

interface ParentProfilFormProps {
  user: UtilisateurModel
  parentProfil?: ParentProfilModel
}

export default function ParentProfilForm({ user, parentProfil }: ParentProfilFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValues: ParentUpdateData = {
    nom: user.nom,
    prenom: user.prenom,
    telephone: user.telephone,
    dateNaissance: user.dateNaissance,
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
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParentUpdateData>({
    resolver: zodResolver(ParentUpdateSchema),
    defaultValues,
  })

  const onSubmit = async (values: ParentUpdateData) => {
    setLoading(true)
    setError(null)

    try {
      await updateParentProfile(values)
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
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.prenom.message}</p>
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

        {/* --- Adresse --- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Adresse</h4>
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
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.adresse.message}</p>
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
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.codePostal.message}</p>
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
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.ville.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* --- Situation professionnelle --- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Situation professionnelle</h4>
            <hr className="border-gray-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="profession" className="block text-xs font-medium text-gray-600 mb-1">
                Profession
              </label>
              <input
                id="profession"
                type="text"
                {...register('profession')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.profession ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.profession && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.profession.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="employeur" className="block text-xs font-medium text-gray-600 mb-1">
                Employeur
              </label>
              <input
                id="employeur"
                type="text"
                {...register('employeur')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.employeur ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.employeur && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.employeur.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="situationFamiliale"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Situation familiale <span className="text-red-500">*</span>
            </label>
            <input
              id="situationFamiliale"
              type="text"
              {...register('situationFamiliale')}
              className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.situationFamiliale ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.situationFamiliale && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.situationFamiliale.message}
              </p>
            )}
          </div>
        </div>

        {/* --- CAF et contact d'urgence --- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">CAF et contact d&apos;urgence</h4>
            <hr className="border-gray-300" />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="beneficiaireCAF"
              type="checkbox"
              {...register('beneficiaireCAF')}
              className="h-4 w-4 text-primary border-gray-300 rounded-sm focus:ring-primary"
            />
            <label htmlFor="beneficiaireCAF" className="text-xs text-gray-600 font-medium">
              Bénéficiaire CAF
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="numeroAllocataire"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Numéro allocataire
              </label>
              <input
                id="numeroAllocataire"
                type="text"
                {...register('numeroAllocataire')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.numeroAllocataire ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.numeroAllocataire && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.numeroAllocataire.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="contactUrgenceNom"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Contact d&apos;urgence - Nom <span className="text-red-500">*</span>
              </label>
              <input
                id="contactUrgenceNom"
                type="text"
                {...register('contactUrgenceNom')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.contactUrgenceNom ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contactUrgenceNom && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.contactUrgenceNom.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contactUrgenceTel"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Contact d&apos;urgence - Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                id="contactUrgenceTel"
                type="tel"
                {...register('contactUrgenceTel')}
                className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.contactUrgenceTel ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contactUrgenceTel && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.contactUrgenceTel.message}
                </p>
              )}
            </div>
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
          className="mt-5 w-full bg-primary text-white max-sm:py-2 py-2 rounded-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer font-medium max-sm:text-sm text-sm flex items-center gap-2 justify-center"
        >
          <Save size={16} />
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
