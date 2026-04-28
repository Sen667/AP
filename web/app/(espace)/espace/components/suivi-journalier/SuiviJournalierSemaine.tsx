"use client";

import {
  createOrUpdateSuivi,
  getMesEnfants,
  getSuiviByEnfantAndDate,
  type Enfant,
  type SuiviJournalierData,
} from "@/app/lib/api/suivi-journalier";
import { calculateAgeDetailed } from "@/app/lib/utils";
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
  humeur?: string[];
  activites?: string;
  promenadeHoraires?: string;
  remarques?: string;
}

interface SuiviSemaine {
  [key: string]: SuiviJour; // key = date ISO (YYYY-MM-DD)
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

export default function SuiviJournalierSemaine() {
  const { data: session } = useSession();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [selectedEnfant, setSelectedEnfant] = useState<number | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date()),
  );
  const [suiviSemaine, setSuiviSemaine] = useState<SuiviSemaine>({});
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const humeurOptions = [
    { value: "joyeux", emoji: "😊" },
    { value: "calme", emoji: "😌" },
    { value: "triste", emoji: "😢" },
    { value: "fatigue", emoji: "😴" },
    { value: "excite", emoji: "🤩" },
    { value: "grognon", emoji: "😠" },
  ];

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
      const data = await getMesEnfants();
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

      // Charger les suivis pour chaque jour de la semaine
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

  const handleSaveDaySuivi = async (dateStr: string) => {
    if (!selectedEnfant) return;

    setLoading(true);
    try {
      const currentSuivi = suiviSemaine[dateStr];

      const dataToSend: SuiviJournalierData = {
        enfantId: selectedEnfant,
        date: dateStr,
        temperature: currentSuivi.temperature,
        pleurs: currentSuivi.pleurs,
        besoins: currentSuivi.besoins,
        repasHoraires: currentSuivi.repasHoraires,
        repasAliments: currentSuivi.repasAliments,
        dodoDeb: currentSuivi.dodoDeb,
        dodoFin: currentSuivi.dodoFin,
        humeur: currentSuivi.humeur?.join(","),
        activites: currentSuivi.activites,
        promenadeHoraires: currentSuivi.promenadeHoraires,
        remarques: currentSuivi.remarques,
      };

      await createOrUpdateSuivi(dataToSend);

      toast.success(
        `Suivi du ${formatDate(new Date(dateStr))} enregistré ! ✅`,
      );
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement du suivi");
    } finally {
      setLoading(false);
    }
  };

  const updateSuiviDay = (
    dateStr: string,
    field: keyof SuiviJour,
    value: any,
  ) => {
    setSuiviSemaine((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [field]: value,
      },
    }));
  };

  const handleHumeurToggle = (dateStr: string, value: string) => {
    setSuiviSemaine((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        humeur: prev[dateStr].humeur?.includes(value)
          ? prev[dateStr].humeur.filter((h) => h !== value)
          : [...(prev[dateStr].humeur || []), value],
      },
    }));
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

  const selectedEnfantData = enfants.find((e) => e.id === selectedEnfant);
  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      {/* Sélection enfant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col gap-2">
          <label
            htmlFor="enfant-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enfant
          </label>
          <select
            id="enfant-select"
            value={selectedEnfant || ""}
            onChange={(e) => setSelectedEnfant(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
          >
            {enfants.map((enfant) => (
              <option key={enfant.id} value={enfant.id}>
                {enfant.prenom} {enfant.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation semaine */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 flex items-center justify-between">
          <button
            onClick={handlePreviousWeek}
            className="px-3 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors text-sm cursor-pointer"
          >
            ← Précédente
          </button>
          <span className="font-medium text-sm whitespace-nowrap">
            {formatWeekRange()}
          </span>
          <button
            onClick={handleNextWeek}
            className="px-3 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors text-sm cursor-pointer"
          >
            Suivante →
          </button>
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
              <h3 className="font-semibold text-lg">
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
          <p className="ml-3">Chargement de la semaine...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weekDates.map((date, index) => {
            const dateStr = date.toISOString().split("T")[0];
            const suivi = suiviSemaine[dateStr] || {
              date: dateStr,
              humeur: [],
            };
            const isExpanded = expandedDay === dateStr;

            return (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-sm overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                  onClick={() => setExpandedDay(isExpanded ? null : dateStr)}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {JOURS_SEMAINE[index]}
                    </h3>
                    <p className="text-xs text-gray-500">{formatDate(date)}</p>
                  </div>
                  <span className="text-gray-400">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-0 space-y-4 border-t border-gray-200">
                    {/* Santé */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <span>🏥</span> Santé
                      </h4>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Temp. °C"
                        value={suivi.temperature || ""}
                        onChange={(e) =>
                          updateSuiviDay(
                            dateStr,
                            "temperature",
                            parseFloat(e.target.value),
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Pleurs"
                        value={suivi.pleurs || ""}
                        onChange={(e) =>
                          updateSuiviDay(dateStr, "pleurs", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                      <textarea
                        placeholder="Besoins"
                        value={suivi.besoins || ""}
                        onChange={(e) =>
                          updateSuiviDay(dateStr, "besoins", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        rows={2}
                      />
                    </div>

                    {/* Repas */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <span>🍎</span> Repas
                      </h4>
                      <input
                        type="text"
                        placeholder="Horaires"
                        value={suivi.repasHoraires || ""}
                        onChange={(e) =>
                          updateSuiviDay(
                            dateStr,
                            "repasHoraires",
                            e.target.value,
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                      <textarea
                        placeholder="Aliments"
                        value={suivi.repasAliments || ""}
                        onChange={(e) =>
                          updateSuiviDay(
                            dateStr,
                            "repasAliments",
                            e.target.value,
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        rows={2}
                      />
                    </div>

                    {/* Dodo */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <span>😴</span> Dodo
                      </h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={suivi.dodoDeb || ""}
                          onChange={(e) =>
                            updateSuiviDay(dateStr, "dodoDeb", e.target.value)
                          }
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={suivi.dodoFin || ""}
                          onChange={(e) =>
                            updateSuiviDay(dateStr, "dodoFin", e.target.value)
                          }
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Humeur */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <span>💛</span> Humeur
                      </h4>
                      <div className="grid grid-cols-3 gap-1">
                        {humeurOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              handleHumeurToggle(dateStr, option.value)
                            }
                            className={`p-2 text-xl border rounded-sm transition-all ${
                              suivi.humeur?.includes(option.value)
                                ? "border-primary bg-primary/10"
                                : "border-gray-300 "
                            }`}
                          >
                            {option.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Activités */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <span>🎨</span> Activités
                      </h4>
                      <textarea
                        placeholder="Activités du jour"
                        value={suivi.activites || ""}
                        onChange={(e) =>
                          updateSuiviDay(dateStr, "activites", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        rows={2}
                      />
                    </div>

                    {/* Promenades */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <span>🚶</span> Promenades
                      </h4>
                      <input
                        type="text"
                        placeholder="Horaires"
                        value={suivi.promenadeHoraires || ""}
                        onChange={(e) =>
                          updateSuiviDay(
                            dateStr,
                            "promenadeHoraires",
                            e.target.value,
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    {/* Remarques */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <span>📝</span> Remarques
                      </h4>
                      <textarea
                        placeholder="Remarques"
                        value={suivi.remarques || ""}
                        onChange={(e) =>
                          updateSuiviDay(dateStr, "remarques", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        rows={3}
                      />
                    </div>

                    <button
                      onClick={() => handleSaveDaySuivi(dateStr)}
                      disabled={loading}
                      className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      💾 Enregistrer ce jour
                    </button>
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
