"use client";

import { ContratBadge } from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import { updateContratGarde } from "@/app/lib/api/contratGarde";
import type { ContratGardeModel } from "@/app/types/models/contrat-garde";
import { ArrowLeft, Save } from "@deemlol/next-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  contrat: ContratGardeModel;
}

export default function AdminContratEditClient({ contrat }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dateDebut: new Date(contrat.dateDebut).toISOString().split("T")[0],
    dateFin: contrat.dateFin
      ? new Date(contrat.dateFin).toISOString().split("T")[0]
      : "",
    statut: contrat.statut,
    tarifHoraireBrut: Number(contrat.tarifHoraireBrut),
    nombreHeuresSemaine: Number(contrat.nombreHeuresSemaine),
    indemniteEntretien: Number(contrat.indemniteEntretien),
    indemniteRepas: Number(contrat.indemniteRepas),
    indemniteKm: contrat.indemniteKm ? Number(contrat.indemniteKm) : 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !confirm(
        "Êtes-vous sûr de vouloir modifier ce contrat ? Les modifications seront appliquées immédiatement."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await updateContratGarde(contrat.id, {
        ...formData,
        dateFin: formData.dateFin || null,
      });
      toast.success("Contrat mis à jour avec succès");
      router.push("/espace/admin/contrats");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Erreur lors de la mise à jour du contrat";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "dateDebut" || name === "dateFin" || name === "statut"
          ? value
          : Number(value),
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/espace/admin/contrats"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Retour aux contrats</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary">
              Éditer le contrat #{contrat.id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enfant: {contrat.enfant?.prenom} {contrat.enfant?.nom}
            </p>
          </div>
          <ContratBadge
            status={
              formData.statut as
                | "ACTIF"
                | "SUSPENDU"
                | "TERMINE"
                | "EN_ATTENTE_VALIDATION"
            }
          />
        </div>
      </div>

      {/* Informations non modifiables */}
      <div className="bg-gray-50 border border-gray-200 rounded-sm p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">Informations du contrat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Parent</p>
            <p className="font-medium">
              {contrat.parent?.utilisateur?.prenom}{" "}
              {contrat.parent?.utilisateur?.nom}
            </p>
            <p className="text-xs text-gray-500">
              {contrat.parent?.utilisateur?.email}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Assistante</p>
            <p className="font-medium">
              {contrat.assistant?.utilisateur?.prenom}{" "}
              {contrat.assistant?.utilisateur?.nom}
            </p>
            <p className="text-xs text-gray-500">
              {contrat.assistant?.utilisateur?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire d'édition */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-sm p-5">
          <h2 className="text-sm font-semibold mb-4">Détails du contrat</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début *
              </label>
              <input
                type="date"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Date fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin (optionnel)
              </label>
              <input
                type="date"
                name="dateFin"
                value={formData.dateFin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut *
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="EN_ATTENTE_VALIDATION">En attente</option>
                <option value="ACTIF">Actif</option>
                <option value="SUSPENDU">Suspendu</option>
                <option value="TERMINE">Terminé</option>
              </select>
            </div>

            {/* Heures par semaine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heures par semaine *
              </label>
              <input
                type="number"
                name="nombreHeuresSemaine"
                value={formData.nombreHeuresSemaine}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="45"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Tarif horaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarif horaire brut (€) *
              </label>
              <input
                type="number"
                name="tarifHoraireBrut"
                value={formData.tarifHoraireBrut}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Indemnité entretien */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indemnité entretien (€) *
              </label>
              <input
                type="number"
                name="indemniteEntretien"
                value={formData.indemniteEntretien}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Indemnité repas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indemnité repas (€) *
              </label>
              <input
                type="number"
                name="indemniteRepas"
                value={formData.indemniteRepas}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Indemnité km */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indemnité km (€)
              </label>
              <input
                type="number"
                name="indemniteKm"
                value={formData.indemniteKm}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <Button
            type="primary"
            text="Enregistrer"
            icon={<Save size={16} />}
            disabled={loading}
            className="px-6"
          />
          <Button
            type="gray"
            text="Annuler"
            onClick={() => router.push("/espace/admin/contrats")}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}
