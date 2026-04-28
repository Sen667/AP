'use client'

import type { UtilisateurModel } from '@/app/types/models/utilisateur'
import { ArrowLeft } from '@deemlol/next-icons'
import Link from 'next/link'

interface Props {
  parent: UtilisateurModel
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-FR') : '-'

export default function AdminParentDetailClient({ parent }: Props) {
  const profil = parent.parentProfil

  return (
    <div>
      {/* Header avec retour */}
      <div className="mb-6">
        <Link
          href="/espace/admin/parents"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Retour aux parents</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-gray-700 bg-blue-200">
            {`${parent.prenom[0] || ''}${parent.nom[0] || ''}`.toUpperCase()}
          </div>
          <div>
            <h1 className="max-sm:text-lg text-xl font-semibold text-primary">
              {parent.prenom} {parent.nom}
            </h1>
            <p className="text-sm text-gray-500">{parent.email}</p>
          </div>
        </div>
      </div>

      {/* Affichage des informations */}
      <div className="space-y-5">
        {/* --- Informations utilisateur --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Informations utilisateur</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Email</dt>
              <dd className="text-left sm:text-right">{parent.email || '-'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Téléphone</dt>
              <dd className="text-left sm:text-right">{parent.telephone || '-'}</dd>
            </div>
          </dl>
        </section>

        {/* --- Adresse --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Adresse</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Adresse</dt>
              <dd className="text-left sm:text-right">{profil?.adresse || '-'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Code postal</dt>
              <dd className="text-left sm:text-right">{profil?.codePostal || '-'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Ville</dt>
              <dd className="text-left sm:text-right">{profil?.ville || '-'}</dd>
            </div>
          </dl>
        </section>

        {/* --- Informations personnelles --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Informations personnelles</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Situation familiale</dt>
              <dd className="text-left sm:text-right">{profil?.situationFamiliale || '-'}</dd>
            </div>
          </dl>
        </section>

        {/* --- Informations professionnelles --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Informations professionnelles</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Profession</dt>
              <dd className="text-left sm:text-right">{profil?.profession || '-'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Employeur</dt>
              <dd className="text-left sm:text-right">{profil?.employeur || '-'}</dd>
            </div>
          </dl>
        </section>

        {/* --- Informations CAF --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Informations CAF</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Allocataire CAF</dt>
              <dd className="text-left sm:text-right">{profil?.beneficiaireCAF ? 'Oui' : 'Non'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Numéro allocataire</dt>
              <dd className="text-left sm:text-right">{profil?.numeroAllocataire || '-'}</dd>
            </div>
          </dl>
        </section>

        {/* --- Contact d'urgence --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Contact d'urgence</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Nom</dt>
              <dd className="text-left sm:text-right">{profil?.contactUrgenceNom || '-'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Téléphone</dt>
              <dd className="text-left sm:text-right">{profil?.contactUrgenceTel || '-'}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  )
}
