"use client";

import Badge, { ContratBadge } from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import { getAllAssistants } from "@/app/lib/api/assistant";
import {
  deleteContratGarde,
  getContratsGardeByEnfant,
  getEnfantsGardesParAssistant,
  traiterRevocation,
} from "@/app/lib/api/contratGarde";
import { calculateAge } from "@/app/lib/utils";
import type { ContratGardeModel } from "@/app/types/models/contrat-garde";
import type { EnfantModel } from "@/app/types/models/enfant";
import type { UtilisateurModel } from "@/app/types/models/utilisateur";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  DollarSign,
  Edit,
  MapPin,
  Star,
  Trash,
  UserPlus,
  Users,
  XCircle,
} from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateContratModal from "./CreateContratModal";
import UpdateContratModal from "./UpdateContratModal";

interface ContratsGardeListProps {
  enfantId: number;
  enfantPrenom: string;
}

export default function ContratsGardeList({
  enfantId,
  enfantPrenom,
}: ContratsGardeListProps) {
  const router = useRouter();
  const [contrats, setContrats] = useState<ContratGardeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssistantes, setShowAssistantes] = useState(false);
  const [assistantes, setAssistantes] = useState<UtilisateurModel[]>([]);
  const [loadingAssistantes, setLoadingAssistantes] = useState(false);
  const [selectedAssistante, setSelectedAssistante] =
    useState<UtilisateurModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContrat, setSelectedContrat] =
    useState<ContratGardeModel | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [enfantsParAssistant, setEnfantsParAssistant] = useState<
    Record<number, EnfantModel[]>
  >({});
  const [loadingEnfants, setLoadingEnfants] = useState(false);
  const [showRevocationModal, setShowRevocationModal] = useState(false);
  const [contratRevocation, setContratRevocation] =
    useState<ContratGardeModel | null>(null);
  const [commentaireRevocation, setCommentaireRevocation] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadContrats();
  }, [enfantId]);

  const loadContrats = async () => {
    try {
      setLoading(true);
      const data = await getContratsGardeByEnfant(enfantId);
      setContrats(data);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des contrats");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contrat: ContratGardeModel) => {
    const assistante = contrat.assistant?.utilisateur;
    const confirmed = window.confirm(
      `Supprimer le contrat avec ${assistante?.prenom} ${assistante?.nom} ?`,
    );
    if (!confirmed) return;

    try {
      await deleteContratGarde(contrat.id);
      setContrats((prev) => prev.filter((c) => c.id !== contrat.id));
      toast.success("Contrat supprimé avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAddContrat = async () => {
    setShowAssistantes(true);
    await loadAssistantes();
  };

  const loadAssistantes = async () => {
    try {
      setLoadingAssistantes(true);
      const data = await getAllAssistants();
      // Filtrer uniquement les assistantes qui ont des heures disponibles
      const assistantesDisponibles = data.filter(
        (assistante: UtilisateurModel) => {
          const profil = assistante.assistantProfil;
          return profil !== null && profil !== undefined;
        },
      );
      setAssistantes(assistantesDisponibles);

      // Charger les enfants pour chaque assistante
      await loadEnfantsPourAssistantes(assistantesDisponibles);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des assistantes");
    } finally {
      setLoadingAssistantes(false);
    }
  };

  const loadEnfantsPourAssistantes = async (
    assistantesList: UtilisateurModel[],
  ) => {
    try {
      setLoadingEnfants(true);
      const enfantsData: Record<number, EnfantModel[]> = {};

      // Charger les enfants pour chaque assistante en parallèle
      await Promise.all(
        assistantesList.map(async (assistante) => {
          const assistantId = assistante.assistantProfil?.id;
          if (assistantId) {
            try {
              const enfants = await getEnfantsGardesParAssistant(assistantId);
              enfantsData[assistantId] = enfants;
            } catch (error) {
              enfantsData[assistantId] = [];
            }
          }
        }),
      );

      setEnfantsParAssistant(enfantsData);
    } catch (error: any) {
      console.error("Erreur lors du chargement des enfants:", error);
    } finally {
      setLoadingEnfants(false);
    }
  };

  const handleSelectAssistante = (assistante: UtilisateurModel) => {
    setSelectedAssistante(assistante);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssistante(null);
  };

  const handleContratCreated = () => {
    toast.success("Contrat de garde créé avec succès");
    handleCloseModal();
    setShowAssistantes(false);
    loadContrats();
  };

  const handleBackToContrats = () => {
    setShowAssistantes(false);
  };

  const handleEditContrat = (contrat: ContratGardeModel) => {
    setSelectedContrat(contrat);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedContrat(null);
  };

  const handleContratUpdated = () => {
    toast.success("Contrat mis à jour avec succès");
    handleCloseEditModal();
    loadContrats();
  };

  const handleOpenRevocationModal = (contrat: ContratGardeModel) => {
    setContratRevocation(contrat);
    setCommentaireRevocation("");
    setShowRevocationModal(true);
  };

  const handleCloseRevocationModal = () => {
    setShowRevocationModal(false);
    setContratRevocation(null);
    setCommentaireRevocation("");
  };

  const handleTraiterRevocation = async (accepter: boolean) => {
    if (!contratRevocation) return;

    try {
      setActionLoading(true);
      await traiterRevocation(
        contratRevocation.id,
        accepter,
        commentaireRevocation,
      );

      if (accepter) {
        toast.success("Révocation acceptée, le contrat est maintenant terminé");
      } else {
        toast.success("Révocation refusée, le contrat reste actif");
      }

      handleCloseRevocationModal();
      loadContrats();
    } catch (error: any) {
      console.error("Erreur lors du traitement de la révocation:", error);
      const message =
        error.response?.data?.message ||
        "Erreur lors du traitement de la révocation";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
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
      <div className="p-6 bg-white border border-gray-200 rounded-sm mt-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            Chargement des contrats...
          </p>
        </div>
      </div>
    );
  }

  // Affichage de la liste des assistantes pour choisir
  if (showAssistantes) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-sm mt-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              Choisir une assistante pour {enfantPrenom}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Sélectionnez l'assistante maternelle qui conviendra à votre enfant
            </p>
          </div>

          {contrats.length > 0 && (
            <Button
              type="gray"
              text="Retour aux contrats"
              onClick={handleBackToContrats}
            />
          )}
        </div>

        {/* Liste des assistantes */}
        {loadingAssistantes ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">
              Chargement des assistantes...
            </p>
          </div>
        ) : assistantes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Aucune assistante maternelle disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {assistantes.map((assistante) => {
              const profil = assistante.assistantProfil;
              if (!profil) return null;

              const enfantsGardes = enfantsParAssistant[profil.id] || [];

              return (
                <div
                  key={assistante.id}
                  className="border border-gray-200 rounded-sm p-4 transition-colors flex flex-col"
                >
                  {/* Header de la carte */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {assistante.prenom[0]}
                        {assistante.nom[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {assistante.prenom} {assistante.nom}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                          <MapPin size={12} className="shrink-0" />
                          <span className="truncate">
                            {profil.adresse}, {profil.codePostal} {profil.ville}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Statut agrément */}

                    <div className="flex items-start gap-2 text-xs text-gray-700">
                      <Users size={14} className="shrink-0 text-gray-400" />
                      <span>
                        <strong>Capacité:</strong> {profil.capaciteAccueil}{" "}
                        enfant
                        {profil.capaciteAccueil > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <Briefcase size={14} className="shrink-0 text-gray-400" />
                      <span>
                        <strong>Expérience:</strong> {profil.experience} an
                        {profil.experience && profil.experience > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <Star size={14} className="shrink-0 text-gray-400" />
                      <span>
                        <strong>N° Agrément:</strong> {profil.numeroAgrement}
                      </span>
                    </div>

                    <Badge variant="success" icon={<CheckCircle />} size="sm">
                      <span className="max-sm:hidden">Agréée</span>
                    </Badge>
                  </div>

                  {/* Disponibilités */}
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">
                      Disponibilités
                    </h5>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {profil.disponibilites}
                    </p>
                  </div>

                  {/* Enfants actuellement gardés */}
                  {loadingEnfants ? (
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                        <span>Chargement...</span>
                      </div>
                    </div>
                  ) : enfantsGardes.length > 0 ? (
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <h5 className="text-xs font-semibold text-gray-700 mb-1">
                        Enfants actuellement gardés ({enfantsGardes.length})
                      </h5>
                      <p className="text-xs text-gray-600">
                        {enfantsGardes
                          .map((enfant) => {
                            const age = calculateAge(enfant.dateNaissance);
                            return `${enfant.prenom} (${age} an${age > 1 ? "s" : ""})`;
                          })
                          .join(", ")}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <p className="text-xs text-gray-500 text-center">
                        Aucun enfant gardé actuellement
                      </p>
                    </div>
                  )}

                  {/* Bouton */}
                  <Button
                    type="primary"
                    text="Choisir cette assistante"
                    icon={<CheckCircle size={16} />}
                    onClick={() => handleSelectAssistante(assistante)}
                    className="w-full justify-center text-sm mt-auto"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de création de contrat */}
        {selectedAssistante && (
          <CreateContratModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleContratCreated}
            assistante={selectedAssistante}
            enfantId={enfantId}
          />
        )}

        {/* Modal d'édition de contrat */}
        {selectedContrat && (
          <UpdateContratModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSuccess={handleContratUpdated}
            contrat={selectedContrat}
          />
        )}
      </div>
    );
  }

  // Affichage de la liste des contrats
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-sm mt-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Contrats de garde</h3>
          <p className="text-xs text-gray-500 mt-1">
            Gérez les contrats de garde de {enfantPrenom}
          </p>
        </div>

        <Button
          type="primary"
          icon={<UserPlus size={16} />}
          text="Nouveau contrat"
          onClick={handleAddContrat}
        />
      </div>

      {/* Liste des contrats */}
      {contrats.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Briefcase size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm mb-4">Aucun contrat de garde pour le moment</p>
          <Button
            type="primary"
            text="Choisir une assistante"
            onClick={handleAddContrat}
            className="mx-auto"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Contrats actifs et en attente */}
          {contrats.filter((c) => c.statut !== "TERMINE").length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Contrats actifs
              </h4>
              {contrats
                .filter((c) => c.statut !== "TERMINE")
                .map((contrat) => {
                  const assistante = contrat.assistant?.utilisateur;
                  const profil = contrat.assistant;

                  return (
                    <div
                      key={contrat.id}
                      className="border border-gray-200 rounded-sm p-4"
                    >
                      {/* Header du contrat */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {assistante?.prenom[0]}
                            {assistante?.nom[0]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {assistante?.prenom} {assistante?.nom}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Assistante maternelle
                            </p>
                            {contrat.revocationStatut === "EN_ATTENTE" && (
                              <div className="inline-flex items-center gap-1.5 mt-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded max-w-fit">
                                <AlertCircle size={12} />
                                <span>Demande de révocation en attente</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatutBadge(contrat.statut)}
                        </div>
                      </div>

                      {/* Informations du contrat */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <span>
                            <strong>Début:</strong>{" "}
                            {new Date(contrat.dateDebut).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                        </div>

                        {contrat.dateFin && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar
                              size={16}
                              className="shrink-0 text-gray-400"
                            />
                            <span>
                              <strong>Fin:</strong>{" "}
                              {new Date(contrat.dateFin).toLocaleDateString(
                                "fr-FR",
                              )}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <DollarSign
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <span>
                            <strong>Tarif:</strong> {contrat.tarifHoraireBrut}
                            €/h
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Briefcase
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <span>
                            <strong>Heures:</strong>{" "}
                            {contrat.nombreHeuresSemaine}
                            h/sem
                          </span>
                        </div>
                      </div>

                      {/* Indemnités */}
                      <div className="bg-gray-50 rounded p-3 mb-4">
                        <h5 className="text-xs font-semibold text-gray-700 mb-2">
                          Indemnités
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                          <div>
                            <strong>Entretien:</strong>{" "}
                            {contrat.indemniteEntretien}€
                          </div>
                          <div>
                            <strong>Repas:</strong> {contrat.indemniteRepas}€
                          </div>
                          {contrat.indemniteKm && (
                            <div>
                              <strong>Km:</strong> {contrat.indemniteKm}€
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Motif de révocation si demande en attente */}
                      {contrat.revocationStatut === "EN_ATTENTE" &&
                        contrat.revocationMotif && (
                          <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle
                                size={16}
                                className="shrink-0 text-orange-600 mt-0.5"
                              />
                              <div className="flex-1">
                                <h5 className="text-xs font-semibold text-orange-900 mb-1">
                                  Motif de la demande de révocation
                                </h5>
                                <p className="text-xs text-orange-800">
                                  {contrat.revocationMotif}
                                </p>
                                {contrat.revocationDateDemande && (
                                  <p className="text-xs text-orange-600 mt-1">
                                    Demandée le{" "}
                                    {new Date(
                                      contrat.revocationDateDemande,
                                    ).toLocaleDateString("fr-FR")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Actions */}
                      {contrat.revocationStatut === "EN_ATTENTE" ? (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-700 mb-3">
                            Traiter la demande de révocation :
                          </p>
                          <div className="flex gap-2">
                            <Button
                              type="primary"
                              icon={<CheckCircle size={14} />}
                              text="Accepter la révocation"
                              onClick={() => handleOpenRevocationModal(contrat)}
                              className="flex-1 justify-center text-xs py-2"
                            />
                            <Button
                              type="red"
                              icon={<XCircle size={14} />}
                              text="Refuser"
                              onClick={async () => {
                                if (
                                  confirm(
                                    "Êtes-vous sûr de vouloir refuser cette demande de révocation ?",
                                  )
                                ) {
                                  setContratRevocation(contrat);
                                  await handleTraiterRevocation(false);
                                }
                              }}
                              className="flex-1 justify-center text-xs py-2"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <Button
                            type="primary"
                            icon={<Edit size={14} />}
                            text="Modifier"
                            onClick={() => handleEditContrat(contrat)}
                            className="flex-1 justify-center text-xs py-2"
                          />
                          <Button
                            type="red"
                            icon={<Trash size={14} />}
                            text="Supprimer"
                            onClick={() => handleDelete(contrat)}
                            className="flex-1 justify-center text-xs py-2"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* Contrats terminés */}
          {contrats.filter((c) => c.statut === "TERMINE").length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Contrats terminés
                </h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {contrats.filter((c) => c.statut === "TERMINE").length}
                </span>
              </div>
              {contrats
                .filter((c) => c.statut === "TERMINE")
                .map((contrat) => {
                  const assistante = contrat.assistant?.utilisateur;
                  const profil = contrat.assistant;

                  return (
                    <div
                      key={contrat.id}
                      className="border border-gray-200 rounded-sm p-4 bg-gray-50"
                    >
                      {/* Header du contrat */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                            {assistante?.prenom[0]}
                            {assistante?.nom[0]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700">
                              {assistante?.prenom} {assistante?.nom}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Assistante maternelle
                            </p>
                            {contrat.revocationStatut === "VALIDE" && (
                              <div className="inline-flex items-center gap-1.5 mt-1 text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded max-w-fit">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <span>
                            <strong>Début:</strong>{" "}
                            {new Date(contrat.dateDebut).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                        </div>

                        {contrat.dateFin && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar
                              size={16}
                              className="shrink-0 text-gray-400"
                            />
                            <span>
                              <strong>Fin:</strong>{" "}
                              {new Date(contrat.dateFin).toLocaleDateString(
                                "fr-FR",
                              )}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <span>
                            <strong>Tarif:</strong> {contrat.tarifHoraireBrut}
                            €/h
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <span>
                            <strong>Heures:</strong>{" "}
                            {contrat.nombreHeuresSemaine}
                            h/sem
                          </span>
                        </div>
                      </div>

                      {/* Indemnités */}
                      <div className="bg-gray-100 rounded p-3 mb-4">
                        <h5 className="text-xs font-semibold text-gray-700 mb-2">
                          Indemnités
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                          <div>
                            <strong>Entretien:</strong>{" "}
                            {contrat.indemniteEntretien}€
                          </div>
                          <div>
                            <strong>Repas:</strong> {contrat.indemniteRepas}€
                          </div>
                          {contrat.indemniteKm && (
                            <div>
                              <strong>Km:</strong> {contrat.indemniteKm}€
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Motif de révocation si applicable */}
                      {contrat.revocationStatut === "VALIDE" &&
                        contrat.revocationMotif && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle
                                size={16}
                                className="shrink-0 text-primary mt-0.5"
                              />
                              <div className="flex-1">
                                <h5 className="text-xs font-semibold text-primary mb-1">
                                  Motif de la révocation
                                </h5>
                                <p className="text-xs text-primary">
                                  {contrat.revocationMotif}
                                </p>
                                {contrat.revocationDateValidation && (
                                  <p className="text-xs text-primary mt-1">
                                    Acceptée le{" "}
                                    {new Date(
                                      contrat.revocationDateValidation,
                                    ).toLocaleDateString("fr-FR")}
                                  </p>
                                )}
                                {contrat.revocationCommentaireParent && (
                                  <div className="mt-2 pt-2 border-t border-primary/20">
                                    <p className="text-xs font-semibold text-primary">
                                      Votre commentaire :
                                    </p>
                                    <p className="text-xs text-primary mt-1">
                                      {contrat.revocationCommentaireParent}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Message pour contrat terminé */}
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic text-center">
                          Ce contrat est terminé et ne peut plus être modifié
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Modal de traitement de révocation */}
      {showRevocationModal && contratRevocation && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Accepter la révocation du contrat
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Contrat avec {contratRevocation.assistant?.utilisateur?.prenom}{" "}
              {contratRevocation.assistant?.utilisateur?.nom}
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
              <p className="text-xs font-medium text-orange-900 mb-1">
                Motif de la demande :
              </p>
              <p className="text-xs text-orange-800">
                {contratRevocation.revocationMotif}
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="commentaire"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Commentaire (optionnel)
              </label>
              <textarea
                id="commentaire"
                value={commentaireRevocation}
                onChange={(e) => setCommentaireRevocation(e.target.value)}
                placeholder="Ajoutez un commentaire si nécessaire..."
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                maxLength={1000}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="primary"
                text="Accepter"
                icon={<CheckCircle size={14} />}
                onClick={() => handleTraiterRevocation(true)}
                disabled={actionLoading}
                className="flex-1 justify-center"
              />
              <Button
                type="gray"
                text="Annuler"
                icon={<XCircle size={14} />}
                onClick={handleCloseRevocationModal}
                disabled={actionLoading}
                className="flex-1 justify-center"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de contrat */}
      {selectedAssistante && (
        <CreateContratModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleContratCreated}
          assistante={selectedAssistante}
          enfantId={enfantId}
        />
      )}

      {/* Modal d'édition de contrat */}
      {selectedContrat && (
        <UpdateContratModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleContratUpdated}
          contrat={selectedContrat}
        />
      )}
    </div>
  );
}
