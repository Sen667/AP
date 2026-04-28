"use client";

import { getParentEnfants } from "@/app/lib/api/enfant";
import { getSuivisByEnfant } from "@/app/lib/api/suivi-journalier";
import { calculateAgeDetailed } from "@/app/lib/utils";
import { ArrowLeft } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Enfant {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
}

interface SuiviJournalier {
  id: number;
  date: string;
  temperature?: number;
  pleurs?: string;
  besoins?: string;
  repasHoraires?: string;
  repasAliments?: string;
  dodoDeb?: string;
  dodoFin?: string;
  humeur?: string;
  activites?: string;
  promenadeHoraires?: string;
  remarques?: string;
  assistant?: {
    utilisateur: {
      prenom: string;
      nom: string;
    };
  };
}

export default function SuiviJournalierParent() {
  const { data: session } = useSession();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [selectedEnfant, setSelectedEnfant] = useState<number | null>(null);
  const [suivis, setSuivis] = useState<SuiviJournalier[]>([]);
  const [selectedSuivi, setSelectedSuivi] = useState<SuiviJournalier | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  useEffect(() => {
    fetchEnfants();
  }, []);

  useEffect(() => {
    if (selectedEnfant) {
      fetchSuivis();
    }
  }, [selectedEnfant]);

  const fetchEnfants = async () => {
    try {
      const data = await getParentEnfants();
      setEnfants(data);
      if (data.length > 0) {
        setSelectedEnfant(data[0].id);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des enfants:", error);
      toast.error("Impossible de charger la liste des enfants");
    }
  };

  const fetchSuivis = async () => {
    if (!selectedEnfant) return;

    setLoading(true);
    try {
      const data = await getSuivisByEnfant(selectedEnfant);
      setSuivis(data);
    } catch (error) {
      console.error("Erreur lors du chargement des suivis:", error);
      toast.error("Impossible de charger les suivis");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (suivi: SuiviJournalier) => {
    setSelectedSuivi(suivi);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedSuivi(null);
  };

  const selectedEnfantData = enfants.find((e) => e.id === selectedEnfant);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getHumeurEmojis = (humeur?: string) => {
    if (!humeur) return [];
    const humeurMap: { [key: string]: string } = {
      joyeux: "😊",
      calme: "😌",
      triste: "😢",
      fatigue: "😴",
      excite: "🤩",
      grognon: "😠",
    };
    return humeur.split(",").map((h) => humeurMap[h.trim()] || h);
  };

  if (viewMode === "detail" && selectedSuivi) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-sm hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            Détail du suivi
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-sm p-6"
        >
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {formatDate(selectedSuivi.date)}
            </h3>
            {selectedSuivi.assistant && (
              <p className="text-sm text-gray-600">
                Par {selectedSuivi.assistant.utilisateur.prenom}{" "}
                {selectedSuivi.assistant.utilisateur.nom}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {/* Santé */}
            {(selectedSuivi.temperature ||
              selectedSuivi.pleurs ||
              selectedSuivi.besoins) && (
              <div className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🏥</span>
                  Santé
                </h4>
                <div className="mt-3 space-y-2">
                  {selectedSuivi.temperature && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Température:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedSuivi.temperature}°C
                      </span>
                    </div>
                  )}
                  {selectedSuivi.pleurs && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Pleurs:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedSuivi.pleurs}
                      </span>
                    </div>
                  )}
                  {selectedSuivi.besoins && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Besoins:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedSuivi.besoins}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Repas */}
            {(selectedSuivi.repasHoraires || selectedSuivi.repasAliments) && (
              <div className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🍎</span>
                  Repas
                </h4>
                <div className="mt-3 space-y-2">
                  {selectedSuivi.repasHoraires && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Horaires:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedSuivi.repasHoraires}
                      </span>
                    </div>
                  )}
                  {selectedSuivi.repasAliments && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Aliments:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedSuivi.repasAliments}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dodo */}
            {(selectedSuivi.dodoDeb || selectedSuivi.dodoFin) && (
              <div className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">😴</span>
                  Sieste / Dodo
                </h4>
                <div className="mt-3 space-y-2">
                  {selectedSuivi.dodoDeb && selectedSuivi.dodoFin && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Horaires:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedSuivi.dodoDeb} - {selectedSuivi.dodoFin}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Humeur */}
            {selectedSuivi.humeur && (
              <div className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">💛</span>
                  Humeur
                </h4>
                <div className="mt-3 space-y-2">
                  <div className="flex gap-3">
                    {getHumeurEmojis(selectedSuivi.humeur).map(
                      (emoji, index) => (
                        <span key={index} className="text-sm">
                          {emoji}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Activités */}
            {selectedSuivi.activites && (
              <div className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  Activités
                </h4>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-900">
                    {selectedSuivi.activites}
                  </p>
                </div>
              </div>
            )}

            {/* Promenades */}
            {selectedSuivi.promenadeHoraires && (
              <div className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">😶</span>
                  Promenades
                </h4>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Horaires:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedSuivi.promenadeHoraires}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Remarques */}
            {selectedSuivi.remarques && (
              <div className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  Remarques
                </h4>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-900">
                    {selectedSuivi.remarques}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélection enfant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col gap-2">
          <label htmlFor="enfant-select">Enfant</label>
          <select
            id="enfant-select"
            value={selectedEnfant || ""}
            onChange={(e) => setSelectedEnfant(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
          >
            {enfants.map((enfant) => (
              <option key={enfant.id} value={enfant.id}>
                {enfant.prenom} {enfant.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedEnfantData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-sm p-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-semibold">
              {selectedEnfantData.prenom.charAt(0)}
            </div>
            <div>
              <h3>
                {selectedEnfantData.prenom} {selectedEnfantData.nom}
              </h3>
              <p className="text-sm text-gray-600">
                {calculateAgeDetailed(selectedEnfantData.dateNaissance)}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p>Chargement des suivis...</p>
        </div>
      ) : suivis.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-12"
        >
          <span className="empty-icon">📭</span>
          <h3>Aucun suivi disponible</h3>
          <p>
            Les suivis journaliers apparaîtront ici une fois renseignés par
            l'assistante maternelle.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {suivis.map((suivi, index) => (
              <motion.div
                key={suivi.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-sm p-6  transition-colors cursor-pointer"
                onClick={() => handleViewDetail(suivi)}
              >
                <div className="mb-4">
                  <h3>{formatDate(suivi.date)}</h3>
                  {suivi.assistant && (
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      {suivi.assistant.utilisateur.prenom}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {suivi.humeur && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500">
                        Humeur:
                      </span>
                      <div className="flex gap-2">
                        {getHumeurEmojis(suivi.humeur)
                          .slice(0, 3)
                          .map((emoji, i) => (
                            <span key={i}>{emoji}</span>
                          ))}
                      </div>
                    </div>
                  )}
                  {suivi.temperature && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500">
                        Température:
                      </span>
                      <span className="text-sm text-gray-900">
                        {suivi.temperature}°C
                      </span>
                    </div>
                  )}
                  {suivi.dodoDeb && suivi.dodoFin && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500">
                        Sieste:
                      </span>
                      <span className="text-sm text-gray-900">
                        {suivi.dodoDeb} - {suivi.dodoFin}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-primary hover:underline text-sm font-medium">
                    Voir les détails →
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
