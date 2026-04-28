"use client";

import Button from "@/app/components/ui/Button";
import { deleteEnfant } from "@/app/lib/api/enfant";
import { calculateAge } from "@/app/lib/utils";
import type { EnfantModel } from "@/app/types/models/enfant";
import { ArrowLeft, Mail, Phone, Trash, User } from "@deemlol/next-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  enfant: EnfantModel;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : "-";

export default function AdminEnfantDetailClient({ enfant }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const ageEnfant = calculateAge(enfant.dateNaissance);

  const handleDelete = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer ${enfant.prenom} ${enfant.nom} ? Cette action est irréversible.`,
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteEnfant(enfant.id);
      toast.success("Enfant supprimé avec succès");
      router.push("/espace/admin/enfants");
    } catch (error: any) {
      const message =
        error?.message || "Erreur lors de la suppression de l'enfant";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Header avec retour */}
      <div className="mb-6">
        <Link
          href="/espace/admin/enfants"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Retour aux enfants</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-gray-700 ${
                enfant.sexe === "MASCULIN"
                  ? "bg-yellow-200"
                  : enfant.sexe === "FEMININ"
                    ? "bg-pink-200"
                    : "bg-gray-200"
              }`}
            >
              {`${enfant.prenom[0] || ""}${enfant.nom[0] || ""}`.toUpperCase()}
            </div>
            <div>
              <h1 className="max-sm:text-lg text-xl font-semibold text-primary">
                {enfant.prenom} {enfant.nom}
              </h1>
              <p className="text-sm text-gray-500">
                {ageEnfant} ans •{" "}
                {enfant.sexe === "MASCULIN" ? "Garçon" : "Fille"}
              </p>
            </div>
          </div>

          {/* Bouton suppression */}
          <Button
            type="red"
            text="Supprimer"
            icon={<Trash size={16} />}
            onClick={handleDelete}
            disabled={isDeleting}
            className="max-sm:text-xs"
          />
        </div>
      </div>

      {/* Affichage des informations */}
      <div className="space-y-5">
        {/* --- Informations personnelles --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">
            Informations personnelles
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Nom</dt>
              <dd className="text-left sm:text-right">{enfant.nom || "-"}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Prénom</dt>
              <dd className="text-left sm:text-right">
                {enfant.prenom || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Date de naissance</dt>
              <dd className="text-left sm:text-right">
                {formatDate(enfant.dateNaissance)}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Sexe</dt>
              <dd className="text-left sm:text-right">
                {enfant.sexe === "MASCULIN" ? "Garçon" : "Fille"}
              </dd>
            </div>
          </dl>
        </section>

        {/* --- Informations médicales --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Informations médicales</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Allergies</dt>
              <dd className="text-left sm:text-right">
                {enfant.allergies || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Remarques médicales</dt>
              <dd className="text-left sm:text-right">
                {enfant.remarquesMedicales || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">Médecin traitant</dt>
              <dd className="text-left sm:text-right">
                {enfant.medecinTraitant || "-"}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <dt className="text-gray-600 font-medium">
                Téléphone du médecin
              </dt>
              <dd className="text-left sm:text-right">
                {enfant.medecinTraitantTel || "-"}
              </dd>
            </div>
          </dl>
        </section>

        {/* --- Parents --- */}
        <section className="p-5 bg-white border border-gray-200 rounded-sm">
          <h2 className="text-sm font-semibold mb-4">Parents</h2>
          {enfant.parents && enfant.parents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enfant.parents.map((lien) => {
                const parent = lien.parent;
                const utilisateur = parent?.utilisateur;

                if (!parent || !utilisateur) return null;

                return (
                  <div
                    key={`${parent.id}-${enfant.id}`}
                    className="p-4 border border-gray-200 rounded-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">
                          {utilisateur.prenom} {utilisateur.nom}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {parent.profession || "Profession non renseignée"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{utilisateur.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} className="shrink-0" />
                        <span>{utilisateur.telephone}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-100">
                        <p className="text-gray-600">
                          <span className="font-medium">Adresse:</span>{" "}
                          {parent.adresse}, {parent.codePostal} {parent.ville}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Aucun parent associé à cet enfant.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
