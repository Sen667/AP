"use client";

import { ContratBadge } from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import {
  deleteContratGarde,
  getAllContratsAdmin,
} from "@/app/lib/api/contratGarde";
import type { ContratGardeModel } from "@/app/types/models/contrat-garde";
import { Edit, Trash } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminContratsClient() {
  const router = useRouter();
  const [contrats, setContrats] = useState<ContratGardeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState<string>("TOUS");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContrats = async () => {
    try {
      setLoading(true);
      const data = await getAllContratsAdmin();
      setContrats(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats:", error);
      toast.error("Erreur lors de la récupération des contrats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContrats();
  }, []);

  const handleDelete = async (contrat: ContratGardeModel) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer le contrat pour ${contrat.enfant?.prenom} ${contrat.enfant?.nom} ? Cette action est irréversible.`,
      )
    ) {
      return;
    }

    try {
      await deleteContratGarde(contrat.id);
      toast.success("Contrat supprimé avec succès");
      fetchContrats();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Erreur lors de la suppression du contrat";
      toast.error(message);
    }
  };

  const handleEdit = (contratId: number) => {
    router.push(`/espace/admin/contrats/${contratId}`);
  };

  const getStatutBadge = (statut: string) => {
    return (
      <ContratBadge
        status={
          statut as "ACTIF" | "SUSPENDU" | "TERMINE" | "EN_ATTENTE_VALIDATION"
        }
      />
    );
  };

  const filteredContrats = contrats.filter((contrat) => {
    const matchesStatut =
      filtreStatut === "TOUS" || contrat.statut === filtreStatut;
    const matchesSearch =
      searchTerm === "" ||
      contrat.enfant?.prenom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contrat.enfant?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrat.parent?.utilisateur?.prenom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contrat.parent?.utilisateur?.nom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contrat.assistant?.utilisateur?.prenom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contrat.assistant?.utilisateur?.nom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatut && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">
        Admin - Fripouilles
      </p>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <h1 className="text-primary font-semibold text-xl max-sm:text-lg">
          Tous les contrats du RAM
        </h1>
        <div className="text-sm text-gray-600">
          {filteredContrats.length} contrat(s) sur {contrats.length}
        </div>
      </div>

      <div className="space-y-6">
        {/* Filtres */}
        <div className="bg-white p-4 rounded-sm border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Enfant, parent ou assistante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut du contrat
              </label>
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="TOUS">Tous</option>
                <option value="ACTIF">Actif</option>
                <option value="EN_ATTENTE_VALIDATION">En attente</option>
                <option value="SUSPENDU">Suspendu</option>
                <option value="TERMINE">Terminé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des contrats */}
        {filteredContrats.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-sm border border-gray-200">
            <p className="text-gray-500">Aucun contrat trouvé.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContrats.map((contrat) => (
              <div
                key={contrat.id}
                className="bg-white border border-gray-200 rounded-sm p-6 transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          Enfant: {contrat.enfant?.prenom} {contrat.enfant?.nom}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                          <p>
                            <span className="font-medium">Parent:</span>{" "}
                            {contrat.parent?.utilisateur?.prenom}{" "}
                            {contrat.parent?.utilisateur?.nom} -{" "}
                            {contrat.parent?.utilisateur?.telephone}
                          </p>
                          <p>
                            <span className="font-medium">Assistante:</span>{" "}
                            {contrat.assistant?.utilisateur?.prenom}{" "}
                            {contrat.assistant?.utilisateur?.nom} -{" "}
                            {contrat.assistant?.utilisateur?.telephone}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {getStatutBadge(contrat.statut)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-gray-500">Date début</p>
                        <p className="font-semibold">
                          {new Date(contrat.dateDebut).toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Heures/semaine</p>
                        <p className="font-semibold">
                          {contrat.nombreHeuresSemaine}h
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tarif horaire</p>
                        <p className="font-semibold">
                          {contrat.tarifHoraireBrut}€/h
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Indemnités</p>
                        <p className="text-xs">
                          Entretien: {contrat.indemniteEntretien}€
                          <br />
                          Repas: {contrat.indemniteRepas}€
                        </p>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button
                        type="primary"
                        text="Éditer"
                        icon={<Edit size={16} />}
                        onClick={() => handleEdit(contrat.id)}
                        className="text-xs"
                      />
                      <Button
                        type="red"
                        text="Supprimer"
                        icon={<Trash size={16} />}
                        onClick={() => handleDelete(contrat)}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
