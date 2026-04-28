import getServerUser from '@/app/lib/api/getServerUser'
import { createEnfantSlug } from '@/app/lib/utils/slugify'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EnfantDetailClient from '../../components/parent/EnfantDetailClient'

export const metadata: Metadata = {
  title: 'Détail enfant',
}

interface Props {
  params: { id: string }
}

export default async function EnfantDetailPage({ params }: Props) {
  const { id: slug } = await params
  const user = await getServerUser()

  const enfantsData = (user.parentProfil?.enfants || []) as any[]

  // Adapter pour les deux structures possibles (LienParentEnfant ou Enfant direct)
  let enfant = null

  for (const item of enfantsData) {
    const e = item.enfant || item
    if (e && createEnfantSlug(e.prenom, e.nom) === slug) {
      enfant = e
      break
    }
  }

  if (!enfant) {
    notFound()
  }

  return <EnfantDetailClient enfant={enfant} />
}
