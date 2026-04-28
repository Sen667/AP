"use client";

import type { UtilisateurModel } from "@/app/types/models/utilisateur";
import { ArrowLeft } from "@deemlol/next-icons";
import Link from "next/link";

interface Props {
  assistant: UtilisateurModel;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : "-";

export default function AdminAssistantDetailClient({ assistant }: Props) {
  const profil = assistant.assistantProfil;

  return (
    <div>
      {/* Header avec retour */}
      <div className="mb-6">
        <Link
          href="/espace/admin/assistants"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Retour aux assistants</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-gray-700 bg-purple-200">
            {`${assistant.prenom[0] || ""}${assistant.nom[0] || ""}`.toUpperCase()}
          </div>
          <div>
            <h1 className="max-sm:text-lg text-xl font-semibold text-primary">
              {assistant.prenom} {assistant.nom}
            </h1>
            <p className="text-sm text-gray-500">{assistant.email}</p>
          </div>
        </div>
      </div>

      {/* Affichage des informations */}
      <div className="space-y-5">
        {/* --- Informations utilisateur --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">
            Informations utilisateur
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Email</dt>
              <dd className="text-left sm:text-right">
                {assistant.email || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Téléphone</dt>
              <dd className="text-left sm:text-right">
                {assistant.telephone || "-"}
              </dd>
            </div>
          </dl>
        </section>

        {/* --- Agrément --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Agrément</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Numéro d'agrément</dt>
              <dd className="text-left sm:text-right">
                {profil?.numeroAgrement || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Date d'obtention</dt>
              <dd className="text-left sm:text-right">
                {formatDate(profil?.dateObtentionAgrement)}
              </dd>
            </div>
            {profil?.dateFinAgrement && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <dt className="text-gray-600 font-medium">Date de fin</dt>
                <dd className="text-left sm:text-right">
                  {formatDate(profil.dateFinAgrement)}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* --- Adresse --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Adresse</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Adresse</dt>
              <dd className="text-left sm:text-right">
                {profil?.adresse || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Code postal</dt>
              <dd className="text-left sm:text-right">
                {profil?.codePostal || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Ville</dt>
              <dd className="text-left sm:text-right">
                {profil?.ville || "-"}
              </dd>
            </div>
          </dl>
        </section>

        {/* --- Capacité et Expérience --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Capacité et Expérience</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Capacité d'accueil</dt>
              <dd className="text-left sm:text-right">
                {profil?.capaciteAccueil || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Expérience (années)</dt>
              <dd className="text-left sm:text-right">
                {profil?.experience || "-"}
              </dd>
            </div>
            {profil?.disponibilites && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <dt className="text-gray-600 font-medium">Disponibilités</dt>
                <dd className="text-left sm:text-right">
                  {profil.disponibilites}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </div>
  );
}
