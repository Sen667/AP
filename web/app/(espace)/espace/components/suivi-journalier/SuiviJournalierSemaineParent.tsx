"use client";

import { getParentEnfants } from "@/app/lib/api/enfant";
import {
  getSuiviByEnfantAndDate,
  type Enfant,
} from "@/app/lib/api/suivi-journalier";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface SuiviJour {
  date: string;
  temperature?: number;
  pleurs?: string;
  besoins?: string;
  repasHoraires?: string;
  repasAliments?: string;
  dodoDeb?: string;
  dodoFin?: string;
  humeur?: string[]; // Array of strings for emojis/moods
  activites?: string;
  promenadeHoraires?: string;
  remarques?: string;
}

interface SuiviSemaine {
  [key: string]: SuiviJour;
}

const JOURS_SEMAINE = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export default function SuiviJournalierSemaineParent() {
  const { data: session } = useSession();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [selectedEnfant, setSelectedEnfant] = useState<number | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date()),
  );
  const [suiviSemaine, setSuiviSemaine] = useState<SuiviSemaine>({});
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const humeurMap: { [key: string]: string } = {
    joyeux: "😊",
    calme: "😌",
    triste: "😢",
    fatigue: "😴",
    excite: "🤩",
    grognon: "😠",
  };

  useEffect(() => {
    fetchEnfants();
  }, []);

  useEffect(() => {
    if (selectedEnfant) {
      fetchSuivisSemaine();
    }
  }, [selectedEnfant, currentWeekStart]);

  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekDates(): Date[] {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

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

  const fetchSuivisSemaine = async () => {
    if (!selectedEnfant) return;

    setLoading(true);
    try {
      const weekDates = getWeekDates();
      const suivis: SuiviSemaine = {};

      for (const date of weekDates) {
        const dateStr = date.toISOString().split("T")[0];
        try {
          const data = await getSuiviByEnfantAndDate(selectedEnfant, dateStr);

          if (data) {
            suivis[dateStr] = {
              ...data,
              date: dateStr,
              humeur: data.humeur ? data.humeur.split(",") : [],
            };
          } else {
            suivis[dateStr] = { date: dateStr, humeur: [] };
          }
        } catch (error: any) {
          suivis[dateStr] = { date: dateStr, humeur: [] };
        }
      }

      setSuiviSemaine(suivis);
    } catch (error) {
      console.error("Erreur lors du chargement des suivis:", error);
      toast.error("Impossible de charger les suivis de la semaine");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  const formatWeekRange = () => {
    const weekDates = getWeekDates();
    const start = formatDate(weekDates[0]);
    const end = formatDate(weekDates[6]);
    return `${start} - ${end}`;
  };

  const getHumeurEmoji = (humeurKey: string) => {
    return humeurMap[humeurKey] || humeurKey;
  };

  const selectedEnfantData = enfants.find((e) => e.id === selectedEnfant);
  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label
            htmlFor="enfant-select"
            className="text-sm font-medium text-gray-700"
          >
            Enfant
          </label>
          <select
            id="enfant-select"
            value={selectedEnfant || ""}
            onChange={(e) => setSelectedEnfant(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none bg-white min-w-50 cursor-pointer"
          >
            {enfants.map((enfant) => (
              <option key={enfant.id} value={enfant.id}>
                {enfant.prenom} {enfant.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handlePreviousWeek}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors cursor-pointer"
          >
            ← Semaine précédente
          </button>
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {formatWeekRange()}
          </span>
          <button
            onClick={handleNextWeek}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors cursor-pointer"
          >
            Semaine suivante →
          </button>
        </div>
      </div>

      {selectedEnfantData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-sm p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
              {selectedEnfantData.prenom.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedEnfantData.prenom} {selectedEnfantData.nom}
              </h3>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement de la semaine...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {weekDates.map((date, index) => {
            const dateStr = date.toISOString().split("T")[0];
            const suivi = suiviSemaine[dateStr];
            const isEmpty =
              !suivi ||
              (!suivi.temperature &&
                !suivi.pleurs &&
                !suivi.besoins &&
                !suivi.repasHoraires &&
                !suivi.repasAliments &&
                !suivi.dodoDeb &&
                !suivi.activites &&
                (!suivi.humeur || suivi.humeur.length === 0) &&
                !suivi.remarques);

            const isExpanded = expandedDay === dateStr;

            return (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white border rounded-sm overflow-hidden transition-all ${
                  isExpanded ? "border-primary shadow-md" : "border-gray-200"
                } ${isEmpty ? "opacity-75" : ""}`}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
                  onClick={() => setExpandedDay(isExpanded ? null : dateStr)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">
                      {JOURS_SEMAINE[index]}
                    </h3>
                    {isEmpty && (
                      <span className="text-xs opacity-75">(Vide)</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(date)}</p>
                  <span className="text-primary">{isExpanded ? "▼" : "▶"}</span>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-0 bg-gray-50 space-y-4">
                    {isEmpty ? (
                      <div className="col-span-full text-center py-4 text-gray-500 italic">
                        Aucune donnée saisie pour ce jour.
                      </div>
                    ) : (
                      <>
                        {/* Santé */}
                        {(suivi.temperature ||
                          suivi.pleurs ||
                          suivi.besoins) && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                              <span>🏥</span> Santé
                            </h4>
                            <div className="space-y-1 text-sm">
                              {suivi.temperature && (
                                <div className="flex gap-2">
                                  <span className="font-medium text-gray-600">
                                    Temp:
                                  </span>
                                  <span className="text-gray-800">
                                    {suivi.temperature}°C
                                  </span>
                                </div>
                              )}
                              {suivi.pleurs && (
                                <div className="flex gap-2">
                                  <span className="font-medium text-gray-600">
                                    Pleurs:
                                  </span>
                                  <span className="text-gray-800">
                                    {suivi.pleurs}
                                  </span>
                                </div>
                              )}
                              {suivi.besoins && (
                                <div className="flex gap-2">
                                  <span className="font-medium text-gray-600">
                                    Besoins:
                                  </span>
                                  <span className="text-gray-800">
                                    {suivi.besoins}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Repas */}
                        {(suivi.repasHoraires || suivi.repasAliments) && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                              <span>🍎</span> Repas
                            </h4>
                            <div className="space-y-1 text-sm">
                              {suivi.repasHoraires && (
                                <div className="flex gap-2">
                                  <span className="font-medium text-gray-600">
                                    Heures:
                                  </span>
                                  <span className="text-gray-800">
                                    {suivi.repasHoraires}
                                  </span>
                                </div>
                              )}
                              {suivi.repasAliments && (
                                <div className="flex gap-2">
                                  <span className="font-medium text-gray-600">
                                    Aliments:
                                  </span>
                                  <span className="text-gray-800">
                                    {suivi.repasAliments}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Dodo */}
                        {(suivi.dodoDeb || suivi.dodoFin) && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                              <span>😴</span> Dodo
                            </h4>
                            <div className="flex gap-2 text-sm">
                              <span className="font-medium text-gray-600">
                                Horaires:
                              </span>
                              <span className="text-gray-800">
                                {suivi.dodoDeb || "?"} - {suivi.dodoFin || "?"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Humeur */}
                        {suivi.humeur && suivi.humeur.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                              <span>💛</span> Humeur
                            </h4>
                            <div className="flex gap-2 text-lg">
                              {suivi.humeur.map((h, i) => (
                                <span key={i} title={h}>
                                  {getHumeurEmoji(h)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Activités */}
                        {suivi.activites && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                              <span>🎨</span> Activités
                            </h4>
                            <p className="text-sm text-gray-800">
                              {suivi.activites}
                            </p>
                          </div>
                        )}

                        {/* Promenades */}
                        {suivi.promenadeHoraires && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                              <span>🚶</span> Promenades
                            </h4>
                            <div className="flex gap-2 text-sm">
                              <span className="font-medium text-gray-600">
                                Horaires:
                              </span>
                              <span className="text-gray-800">
                                {suivi.promenadeHoraires}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Remarques */}
                        {suivi.remarques && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                              <span>📝</span> Remarques
                            </h4>
                            <p className="text-sm text-gray-800">
                              {suivi.remarques}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
