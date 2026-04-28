"use client";

import {
  desinscrireAtelierAssistant,
  getMesInscriptionsAssistant,
  getUpcomingAteliers,
  inscrireAtelierAssistant,
} from "@/app/lib/api/ateliers";
import type { AtelierModel } from "@/app/types/models/atelier";
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
  inscriptions,
  onClose,
  onSuccess,
}: {
  atelier: AtelierModel;
  inscriptions: InscriptionAtelierModel[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const placesRestantes =
    atelier.nombrePlaces - (atelier.inscriptions?.length ?? 0);
  const isInscrit = inscriptions.some((i) => i.atelierId === atelier.id);

  const handleInscrire = async () => {
    setLoading(true);
    try {
      await inscrireAtelierAssistant(atelier.id);
      toast.success("Inscription réalisée avec succès !");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erreur lors de l'inscription";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDesinscrire = async () => {
    setLoading(true);
    try {
      await desinscrireAtelierAssistant(atelier.id);
      toast.success("Désinscription effectuée");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erreur lors de la désinscription";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const dateLimitePassee = new Date() > new Date(atelier.dateLimiteInscription);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {atelier.nom}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(atelier.date)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          <span
            className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-4 ${typePublicColor[atelier.typePublic] ?? "bg-gray-100 text-gray-700"}`}
          >
            {typePublicLabel[atelier.typePublic] ?? atelier.typePublic}
          </span>

          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Horaire</span>
              <span className="font-medium text-gray-900">
                {minutesToTime(atelier.debutMinutes)} –{" "}
                {minutesToTime(atelier.finMinutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lieu</span>
              <span className="font-medium text-gray-900">{atelier.lieu}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Places</span>
              <span
                className={`font-medium ${placesRestantes === 0 ? "text-red-600" : "text-green-700"}`}
              >
                {placesRestantes === 0
                  ? "Complet"
                  : `${placesRestantes}/${atelier.nombrePlaces}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Inscription avant</span>
              <span
                className={`font-medium ${dateLimitePassee ? "text-red-600" : "text-gray-900"}`}
              >
                {new Intl.DateTimeFormat("fr-FR").format(
                  new Date(atelier.dateLimiteInscription),
                )}
                {dateLimitePassee && " (dépassée)"}
              </span>
            </div>
          </div>

          {atelier.description && (
            <p className="text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
              {atelier.description}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              <X size={16} className="inline-block mr-1" />
              Annuler
            </button>
            {isInscrit ? (
              <button
                onClick={handleDesinscrire}
                disabled={loading || dateLimitePassee}
                className="flex-1 flex items-center gap-2 justify-center px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
              >
                <Edit3 size={16} color="#FFFFFF" />
                {loading ? "..." : "Se désinscrire"}
              </button>
            ) : (
              <button
                onClick={handleInscrire}
                disabled={loading || placesRestantes === 0 || dateLimitePassee}
                className="flex-1 flex items-center gap-2 justify-center px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition cursor-pointer"
              >
                <Edit3 size={16} color="#FFFFFF" />
                {loading ? "..." : "S'inscrire"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AtelierCard({
  atelier,
  isInscrit,
  onClick,
}: {
  atelier: AtelierModel;
  isInscrit: boolean;
  onClick: () => void;
}) {
  const placesRestantes =
    atelier.nombrePlaces - (atelier.inscriptions?.length ?? 0);
  const complet = placesRestantes === 0;
  const dateLimitePassee = new Date() > new Date(atelier.dateLimiteInscription);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-sm p-5 cursor-pointer transition flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="font-semibold text-gray-900 text-base truncate">
            {atelier.nom}
          </h3>
          <span
            className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${typePublicColor[atelier.typePublic] ?? "bg-gray-100 text-gray-700"}`}
          >
            {typePublicLabel[atelier.typePublic] ?? atelier.typePublic}
          </span>
        </div>
        {isInscrit && (
          <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800">
            ✓ Inscrit
          </span>
        )}
      </div>

      <div className="flex-1 space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="text-base">📅</span>
          <span>
            {formatDate(atelier.date)} · {minutesToTime(atelier.debutMinutes)} –{" "}
            {minutesToTime(atelier.finMinutes)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base">📍</span>
          <span>{atelier.lieu}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`text-sm font-medium ${complet ? "text-red-600" : "text-green-700"}`}
        >
          {complet
            ? "Complet"
            : `${placesRestantes} place${placesRestantes > 1 ? "s" : ""} restante${placesRestantes > 1 ? "s" : ""}`}
        </span>
        {dateLimitePassee ? (
          <span className="text-xs text-red-500">Inscription fermée</span>
        ) : (
          <span className="text-xs font-medium text-primary">
            {isInscrit ? "Gérer ›" : complet ? "" : "S'inscrire ›"}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function AteliersAssistantList() {
  const [ateliers, setAteliers] = useState<AtelierModel[]>([]);
  const [inscriptions, setInscriptions] = useState<InscriptionAtelierModel[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [selectedAtelier, setSelectedAtelier] = useState<AtelierModel | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"disponibles" | "inscrits">(
    "disponibles",
  );

  const load = async () => {
    try {
      const [ateliersData, inscriptionsData] = await Promise.all([
        getUpcomingAteliers(),
        getMesInscriptionsAssistant(),
      ]);
      // Filtrer : assistants voient seulement les ateliers qui les concernent
      const filtered = ateliersData.filter((a) =>
        ["ASSISTANT_UNIQUEMENT", "MIXTE"].includes(a.typePublic),
      );
      setAteliers(filtered);
      setInscriptions(inscriptionsData);
    } catch {
      toast.error("Erreur lors du chargement des ateliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const displayed =
    activeTab === "disponibles"
      ? ateliers
      : ateliers.filter((a) => inscriptions.some((i) => i.atelierId === a.id));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Onglets */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(
          [
            { key: "disponibles", label: "Ateliers disponibles" },
            {
              key: "inscrits",
              label: `Mes inscriptions (${inscriptions.length})`,
            },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px cursor-pointer ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-4">🎨</span>
          <p className="text-sm">
            {activeTab === "inscrits"
              ? "Aucune inscription pour le moment"
              : "Aucun atelier disponible"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayed.map((atelier) => (
            <AtelierCard
              key={atelier.id}
              atelier={atelier}
              isInscrit={inscriptions.some((i) => i.atelierId === atelier.id)}
              onClick={() => setSelectedAtelier(atelier)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedAtelier && (
          <InscriptionModal
            atelier={selectedAtelier}
            inscriptions={inscriptions}
            onClose={() => setSelectedAtelier(null)}
            onSuccess={load}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
