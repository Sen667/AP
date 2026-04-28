'use client'

import Button from '@/app/components/ui/Button'
import ChildCard from '@/app/components/ui/ChildCard'
import { createEnfantSlug } from '@/app/lib/utils/slugify'
import type { UtilisateurModel } from '@/app/types/models/utilisateur'
import { Plus } from '@deemlol/next-icons'
import { useState } from 'react'
import AddEnfantModal from '../modal/AddEnfantModal'
import type { EnfantModel } from '@/app/types/models/enfant'

interface Props {
  user: UtilisateurModel
}

export default function ChildClient({ user }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [enfants, setEnfants] = useState<EnfantModel[]>(
    (user.parentProfil?.enfants as unknown as EnfantModel[]) || [],
  )

  return (
    <>
      {/* Header */}
      <div className="flex flex-col max-sm:gap-3 sm:flex-row sm:justify-between max-sm:mb-4 mb-6 sm:items-center">
        <div>
          <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">Mes enfants - Fripouilles</p>
          <h1 className="text-primary font-semibold text-xl max-sm:text-lg">
            Ajoutez et gérez vos enfants ici
          </h1>
        </div>

        <Button
          type="primary"
          text="Ajouter un enfant"
          icon={<Plus width={16} />}
          onClick={() => setModalOpen(true)}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <AddEnfantModal
          user={user}
          onSuccess={() => {
            setModalOpen(false)
            window.location.reload()
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Enfants cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-sm:gap-3 sm:gap-4 md:gap-4 lg:gap-4">
        {enfants.length === 0 ? (
          <p className="max-sm:text-xs text-gray-500 text-center col-span-full">
            Vous n&apos;avez pas encore ajouté d&apos;enfant.
          </p>
        ) : (
          (enfants as unknown as EnfantModel[]).map((enfant, index) => (
            <ChildCard
              key={`enfant-${enfant.id}`}
              id={enfant.id}
              prenom={enfant.prenom}
              nom={enfant.nom}
              dateNaissance={enfant.dateNaissance}
              sexe={enfant.sexe}
              linkPath={`/espace/enfants/${createEnfantSlug(enfant.prenom, enfant.nom)}`}
            />
          ))
        )}
      </div>
    </>
  )
}
