"use client";

import { ContratBadge } from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import {
  accepterContrat,
  demanderRevocation,
  getContratsAssistant,
  refuserContrat,
} from "@/app/lib/api/contratGarde";
import type { ContratGardeModel } from "@/app/types/models/contrat-garde";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  XCircle,
} from "@deemlol/next-icons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ContratsAssistantList() {
  const [contrats, setContrats] = useState<ContratGardeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showRevocationModal, setShowRevocationModal] = useState(false);
  const [selectedContrat, setSelectedContrat] =
    useState<ContratGardeModel | null>(null);
  const [motifRevocation, setMotifRevocation] = useState("");

  const fetchContrats = async () => {
    try {
      setLoading(true);
      const data = await getContratsAssistant();
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

  const handleAccepter = async (id: number) => {
    try {
      setActionLoading(id);
      await accepterContrat(id);
      toast.success("Contrat accepté avec succès");
      await fetchContrats();
    } catch (error) {
      console.error("Erreur lors de l'acceptation du contrat:", error);
      toast.error("Erreur lors de l'acceptation du contrat");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefuser = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir refuser ce contrat ?")) {
      return;
    }

    try {
      setActionLoading(id);
      await refuserContrat(id);
      toast.success("Contrat refusé");
      await fetchContrats();
    } catch (error) {
      console.error("Erreur lors du refus du contrat:", error);
      toast.error("Erreur lors du refus du contrat");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemanderRevocation = (contrat: ContratGardeModel) => {
    setSelectedContrat(contrat);
    setMotifRevocation("");
    setShowRevocationModal(true);
  };

  const handleSubmitRevocation = async () => {
    if (!selectedContrat || !motifRevocation.trim()) {
      toast.error("Veuillez saisir un motif de révocation");
      return;
    }

    try {
      setActionLoading(selectedContrat.id);
      await demanderRevocation(selectedContrat.id, motifRevocation);
      toast.success("Demande de révocation envoyée au parent");
      setShowRevocationModal(false);
      setSelectedContrat(null);
      setMotifRevocation("");
      await fetchContrats();
    } catch (error: any) {
      console.error("Erreur lors de la demande de révocation:", error);
      const message =
        error.response?.data?.message ||
        "Erreur lors de la demande de révocation";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseRevocationModal = () => {
    setShowRevocationModal(false);
    setSelectedContrat(null);
    setMotifRevocation("");
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

  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-sm">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des contrats...</p>
          </div>
        </div>
      </div>
    );
  }

  if (contrats.length === 0) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-sm">
        <div className="text-center py-12">
          <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">
            Aucun contrat de garde pour le moment.
          </p>
        </div>
      </div>
    );
  }

  const contratsEnAttente = contrats.filter(
    (c) => c.statut === "EN_ATTENTE_VALIDATION",
  );
  const contratsActifs = contrats.filter((c) => c.statut === "ACTIF");
  const autresContrats = contrats.filter(
    (c) => c.statut !== "EN_ATTENTE_VALIDATION" && c.statut !== "ACTIF",
  );

  return (
    <div className="space-y-6">
      {/* Contrats en attente de validation */}
      {contratsEnAttente.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Contrats en attente de validation
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {contratsEnAttente.length} contrat
              {contratsEnAttente.length > 1 ? "s" : ""} à traiter
            </p>
          </div>
          <div className="space-y-4">
            {contratsEnAttente.map((contrat) => (
              <div
                key={contrat.id}
                className="border border-gray-200 rounded-sm p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {contrat.enfant?.prenom} {contrat.enfant?.nom}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Parent: {contrat.parent?.utilisateur?.prenom}{" "}
                        {contrat.parent?.utilisateur?.nom}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Tél: {contrat.parent?.utilisateur?.telephone}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatutBadge(contrat.statut)}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar
                      size={14}
                      className="shrink-0 text-gray-400 mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Date début</p>
                      <p className="text-xs font-medium text-gray-900">
                        {new Date(contrat.dateDebut).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock
                      size={14}
                      className="shrink-0 text-gray-400 mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Heures/semaine</p>
                      <p className="text-xs font-medium text-gray-900">
                        {contrat.nombreHeuresSemaine}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign
                      size={14}
                      className="shrink-0 text-gray-400 mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Tarif horaire</p>
                      <p className="text-xs font-medium text-gray-900">
                        {contrat.tarifHoraireBrut}€/h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign
                      size={14}
                      className="shrink-0 text-gray-400 mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Indemnités</p>
                      <p className="text-xs font-medium text-gray-900">
                        Entretien: {contrat.indemniteEntretien}€<br />
                        Repas: {contrat.indemniteRepas}€
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    type="primary"
                    text="Accepter"
                    icon={<CheckCircle size={14} />}
                    onClick={() => handleAccepter(contrat.id)}
                    disabled={actionLoading === contrat.id}
                    className="flex-1 justify-center text-sm"
                  />
                  <Button
                    type="red"
                    text="Refuser"
                    icon={<XCircle size={14} />}
                    onClick={() => handleRefuser(contrat.id)}
                    disabled={actionLoading === contrat.id}
                    className="flex-1 justify-center text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrats actifs */}
      {contratsActifs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Contrats actifs
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {contratsActifs.length} contrat
              {contratsActifs.length > 1 ? "s" : ""} en cours
            </p>
          </div>
          <div className="space-y-4">
            {contratsActifs.map((contrat) => (
              <div
                key={contrat.id}
                className="border border-gray-200 rounded-sm p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {contrat.enfant?.prenom} {contrat.enfant?.nom}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Parent: {contrat.parent?.utilisateur?.prenom}{" "}
                        {contrat.parent?.utilisateur?.nom}
                      </p>
                      {contrat.revocationStatut === "EN_ATTENTE" && (
                        <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded max-w-fit">
                          <AlertCircle size={12} />
                          <span>Demande de révocation en attente</span>
                        </div>
                      )}
                      {contrat.revocationStatut === "REFUSE" && (
                        <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded max-w-fit">
                          <XCircle size={12} />
                          <span>Révocation refusée par le parent</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatutBadge(contrat.statut)}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <Calendar size={14} className="shrink-0 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Début:</span>{" "}
                      <span className="font-medium">
                        {new Date(contrat.dateDebut).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <Clock size={14} className="shrink-0 text-gray-400" />
                    <span className="font-medium">
                      {contrat.nombreHeuresSemaine}h/semaine
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <DollarSign size={14} className="shrink-0 text-gray-400" />
                    <span className="font-medium">
                      {contrat.tarifHoraireBrut}€/h
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <DollarSign size={14} className="shrink-0 text-gray-400" />
                    <span className="text-gray-500">
                      Entretien: {contrat.indemniteEntretien}€ | Repas:{" "}
                      {contrat.indemniteRepas}€
                    </span>
                  </div>
                </div>

                {/* Bouton pour demander la révocation si pas de demande en cours */}
                {!contrat.revocationStatut && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      type="red"
                      text="Demander la révocation"
                      icon={<AlertCircle size={14} />}
                      onClick={() => handleDemanderRevocation(contrat)}
                      disabled={actionLoading === contrat.id}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrats terminés */}
      {autresContrats.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Contrats terminés
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {autresContrats.length} contrat
              {autresContrats.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="space-y-4">
            {autresContrats.map((contrat) => (
              <div
                key={contrat.id}
                className="border border-gray-200 rounded-sm p-4 bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-700">
                        {contrat.enfant?.prenom} {contrat.enfant?.nom}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Parent: {contrat.parent?.utilisateur?.prenom}{" "}
                        {contrat.parent?.utilisateur?.nom}
                      </p>
                      {contrat.revocationStatut === "VALIDE" && (
                        <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded max-w-fit">
                          <CheckCircle size={12} />
                          <span>Terminé par révocation</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatutBadge(contrat.statut)}
                  </div>
                </div>

                {/* Informations du contrat */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar size={14} className="shrink-0 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Début:</span>{" "}
                      <span className="font-medium">
                        {new Date(contrat.dateDebut).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                  </div>
                  {contrat.dateFin && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar size={14} className="shrink-0 text-gray-400" />
                      <div>
                        <span className="text-gray-500">Fin:</span>{" "}
                        <span className="font-medium">
                          {new Date(contrat.dateFin).toLocaleDateString(
                            "fr-FR",
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock size={14} className="shrink-0 text-gray-400" />
                    <span className="font-medium">
                      {contrat.nombreHeuresSemaine}h/semaine
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <DollarSign size={14} className="shrink-0 text-gray-400" />
                    <span className="font-medium">
                      {contrat.tarifHoraireBrut}€/h
                    </span>
                  </div>
                </div>

                {/* Motif de révocation si demandé par l'assistante */}
                {contrat.revocationStatut === "VALIDE" &&
                  contrat.revocationMotif &&
                  contrat.revocationDemandeePar === "ASSISTANT" && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          size={14}
                          className="shrink-0 text-blue-600 mt-0.5"
                        />
                        <div className="flex-1">
                          <h5 className="text-xs font-semibold text-blue-900 mb-1">
                            Votre demande de révocation
                          </h5>
                          <p className="text-xs text-blue-800">
                            {contrat.revocationMotif}
                          </p>
                          {contrat.revocationDateValidation && (
                            <p className="text-xs text-blue-600 mt-1">
                              Acceptée le{" "}
                              {new Date(
                                contrat.revocationDateValidation,
                              ).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                          {contrat.revocationCommentaireParent && (
                            <div className="mt-2 pt-2 border-t border-blue-200">
                              <p className="text-xs font-semibold text-blue-900">
                                Commentaire du parent :
                              </p>
                              <p className="text-xs text-blue-800 mt-1">
                                {contrat.revocationCommentaireParent}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Message */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic text-center">
                    Ce contrat est terminé
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de demande de révocation */}
      {showRevocationModal && selectedContrat && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Demander la révocation du contrat
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Contrat avec {selectedContrat.enfant?.prenom}{" "}
              {selectedContrat.enfant?.nom}
            </p>

            <div className="mb-4">
              <label
                htmlFor="motif"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Motif de la révocation<span className="text-red-500">*</span>
              </label>
              <textarea
                id="motif"
                value={motifRevocation}
                onChange={(e) => setMotifRevocation(e.target.value)}
                placeholder="Expliquez pourquoi vous souhaitez révoquer ce contrat..."
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {motifRevocation.length}/1000 caractères
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="primary"
                text="Envoyer la demande"
                icon={<AlertCircle size={14} />}
                onClick={handleSubmitRevocation}
                disabled={
                  !motifRevocation.trim() ||
                  actionLoading === selectedContrat.id
                }
                className="flex-1 justify-center"
              />
              <Button
                type="gray"
                text="Annuler"
                icon={<XCircle size={14} />}
                onClick={handleCloseRevocationModal}
                disabled={actionLoading === selectedContrat.id}
                className="flex-1 justify-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
