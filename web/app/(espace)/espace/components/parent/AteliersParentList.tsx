"use client";

import {
  desinscrireAtelier,
  getAteliers,
  getMesInscriptions,
  inscrireAtelier,
} from "@/app/lib/api/ateliers";
import { getParentEnfants } from "@/app/lib/api/enfant";
import type { AtelierModel } from "@/app/types/models/atelier";
import type { EnfantModel } from "@/app/types/models/enfant";
import type { InscriptionAtelierModel } from "@/app/types/models/inscription-atelier";
import { Edit3, X } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}h${m}`;
};

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));

const typePublicLabel: Record<string, string> = {
  ENFANT: "Avec enfants",
  PARENT_UNIQUEMENT: "Parents uniquement",
  ASSISTANT_UNIQUEMENT: "Assistantes uniquement",
  MIXTE: "Mixte",
};

const typePublicColor: Record<string, string> = {
  ENFANT: "bg-blue-100 text-blue-800",
  PARENT_UNIQUEMENT: "bg-purple-100 text-purple-800",
  ASSISTANT_UNIQUEMENT: "bg-orange-100 text-orange-800",
  MIXTE: "bg-teal-100 text-teal-800",
};

function InscriptionModal({
  atelier,
  enfants,
  inscriptions,
  onClose,
  onSuccess,
}: {
  atelier: AtelierModel;
  enfants: EnfantModel[];
  inscriptions: InscriptionAtelierModel[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedEnfant, setSelectedEnfant] = useState<number | undefined>(
    enfants[0]?.id,
  );
  const [loading, setLoading] = useState(false);

  const needsEnfant = ["ENFANT", "MIXTE"].includes(atelier.typePublic);
  const placesRestantes =
    atelier.nombrePlaces - (atelier.inscriptions?.length ?? 0);

  const isInscrit = inscriptions.some((i) => i.atelierId === atelier.id);

  const handleInscrire = async () => {
    setLoading(true);
    try {
      await inscrireAtelier(
        atelier.id,
        needsEnfant ? selectedEnfant : undefined,
      );
      toast.success("Inscription réalisée avec succès !");
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Erreur lors de l'inscription";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDesinscrire = async () => {
    setLoading(true);
    try {
      await desinscrireAtelier(atelier.id);
      toast.success("Désinscription effectuée");
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Erreur lors de la désinscription";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-sm p-6 max-w-md w-full shadow-xl"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {atelier.nom}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{formatDate(atelier.date)}</p>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Horaire</span>
            <span className="font-medium">
              {minutesToTime(atelier.debutMinutes)} –{" "}
              {minutesToTime(atelier.finMinutes)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Lieu</span>
            <span className="font-medium">{atelier.lieu}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Places restantes</span>
            <span
              className={`font-medium ${placesRestantes === 0 ? "text-red-600" : "text-green-700"}`}
            >
              {placesRestantes}/{atelier.nombrePlaces}
            </span>
          </div>
        </div>

        {needsEnfant && !isInscrit && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionner un enfant
            </label>
            <select
              value={selectedEnfant ?? ""}
              onChange={(e) => setSelectedEnfant(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {enfants.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.prenom} {e.nom}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-sm text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X size={16} className="inline-block mr-1" />
            Annuler
          </button>
          {isInscrit ? (
            <button
              onClick={handleDesinscrire}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-sm text-sm hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Edit3 size={16} color="#FFFFFF" />
              {loading ? "..." : "Se désinscrire"}
            </button>
          ) : (
            <button
              onClick={handleInscrire}
              disabled={loading || placesRestantes === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-sm text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Edit3 size={16} color="#FFFFFF" />
              {loading ? "..." : "S'inscrire"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function AtelierCard({
  atelier,
  isInscrit,
  onActionClick,
}: {
  atelier: AtelierModel;
  isInscrit: boolean;
  onActionClick: () => void;
}) {
  const placesRestantes =
    atelier.nombrePlaces - (atelier.inscriptions?.length ?? 0);
  const complet = placesRestantes === 0;
  const dateLimitePassee = new Date() > new Date(atelier.dateLimiteInscription);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-sm p-5 flex flex-col h-full cursor-pointer transition"
      onClick={onActionClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-semibold text-gray-900">
              {atelier.nom}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${typePublicColor[atelier.typePublic] ?? "bg-gray-100 text-gray-700"}`}
            >
              {typePublicLabel[atelier.typePublic] ?? atelier.typePublic}
            </span>
          </div>
          <p className="text-sm text-gray-500 capitalize">
            {formatDate(atelier.date)} · {minutesToTime(atelier.debutMinutes)} –{" "}
            {minutesToTime(atelier.finMinutes)}
          </p>
        </div>
        {isInscrit && (
          <span className="shrink-0 text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Inscrit ✓
          </span>
        )}
      </div>

      <div className="flex-1 space-y-3">
        {atelier.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {atelier.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">📍 {atelier.lieu}</span>
          <span
            className={`font-medium ${complet ? "text-red-600" : "text-gray-700"}`}
          >
            {complet
              ? "Complet"
              : `${placesRestantes} place${placesRestantes > 1 ? "s" : ""} restante${placesRestantes > 1 ? "s" : ""}`}
          </span>
        </div>

        {(atelier.ageMinMois || atelier.ageMaxMois) && (
          <p className="text-xs text-gray-400">
            Âge :{" "}
            {atelier.ageMinMois
              ? `${atelier.ageMinMois} mois`
              : "dès la naissance"}{" "}
            →{" "}
            {atelier.ageMaxMois ? `${atelier.ageMaxMois} mois` : "sans limite"}
          </p>
        )}

        {atelier.animateur && (
          <p className="text-xs text-gray-400">
            Animatrice :{" "}
            <span className="font-medium text-gray-600">
              {atelier.animateur.utilisateur?.prenom}{" "}
              {atelier.animateur.utilisateur?.nom}
            </span>
          </p>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-gray-100">
        {dateLimitePassee && !isInscrit ? (
          <p className="text-xs text-red-500">
            Date limite d&apos;inscription dépassée
          </p>
        ) : (
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-medium ${
                complet ? "text-red-600" : "text-green-700"
              }`}
            >
              {complet
                ? "Complet"
                : `${placesRestantes} place${placesRestantes > 1 ? "s" : ""} disponible${placesRestantes > 1 ? "s" : ""}`}
            </span>
            <span className="text-xs font-medium text-primary">
              {isInscrit ? "Gérer ›" : complet ? "" : "S'inscrire ›"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AteliersParentList() {
  const [ateliers, setAteliers] = useState<AtelierModel[]>([]);
  const [inscriptions, setInscriptions] = useState<InscriptionAtelierModel[]>(
    [],
  );
  const [enfants, setEnfants] = useState<EnfantModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAtelier, setSelectedAtelier] = useState<AtelierModel | null>(
    null,
  );
  const [view, setView] = useState<"disponibles" | "mes-inscriptions">(
    "disponibles",
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [a, i, e] = await Promise.all([
        getAteliers(), // Get all ateliers first
        getMesInscriptions(),
        getParentEnfants(),
      ]);
      // Filter ateliers for parents: exclude ASSISTANT_UNIQUEMENT
      const parentAteliers = a.filter(
        (atelier) => atelier.typePublic !== "ASSISTANT_UNIQUEMENT",
      );
      setAteliers(parentAteliers);
      setInscriptions(i);
      setEnfants(e);
    } catch {
      toast.error("Erreur lors du chargement des ateliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isInscritAtelier = (id: number) =>
    inscriptions.some((i) => i.atelierId === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayedAteliers =
    view === "mes-inscriptions"
      ? ateliers.filter((a) => isInscritAtelier(a.id))
      : ateliers;

  return (
    <>
      {/* Onglets */}
      <div className="mb-6 flex gap-2 bg-white border border-gray-200 rounded-sm p-1 w-fit">
        {(["disponibles", "mes-inscriptions"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
              view === v
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            {v === "disponibles"
              ? "Ateliers disponibles"
              : `Mes inscriptions (${inscriptions.length})`}
          </button>
        ))}
      </div>

      {displayedAteliers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-4xl mb-3">🎨</p>
          <p className="text-gray-500 text-sm">
            {view === "mes-inscriptions"
              ? "Vous n'êtes inscrit à aucun atelier."
              : "Aucun atelier à venir pour le moment."}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {displayedAteliers.map((atelier) => (
              <AtelierCard
                key={atelier.id}
                atelier={atelier}
                isInscrit={isInscritAtelier(atelier.id)}
                onActionClick={() => setSelectedAtelier(atelier)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedAtelier && (
          <InscriptionModal
            atelier={selectedAtelier}
            enfants={enfants}
            inscriptions={inscriptions}
            onClose={() => setSelectedAtelier(null)}
            onSuccess={fetchData}
          />
        )}
      </AnimatePresence>
    </>
  );
}
