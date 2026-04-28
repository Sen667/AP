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

interface SuiviData extends Omit<SuiviJournalierData, "humeur"> {
  humeur?: string[];
}

export default function SuiviJournalierNounou() {
  const { data: session } = useSession();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [selectedEnfant, setSelectedEnfant] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);
  const [suiviData, setSuiviData] = useState<SuiviData>({
    enfantId: 0,
    date: currentDate,
    humeur: [],
  });

  const humeurOptions = [
    { value: "joyeux", label: "😊 Joyeux", emoji: "😊" },
    { value: "calme", label: "😌 Calme", emoji: "😌" },
    { value: "triste", label: "😢 Triste", emoji: "😢" },
    { value: "fatigue", label: "😴 Fatigué", emoji: "😴" },
    { value: "excite", label: "🤩 Excité", emoji: "🤩" },
    { value: "grognon", label: "😠 Grognon", emoji: "😠" },
  ];

  useEffect(() => {
    fetchEnfants();
  }, []);

  useEffect(() => {
    if (selectedEnfant) {
      fetchSuiviExistant();
    }
  }, [selectedEnfant, currentDate]);

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

  const fetchSuiviExistant = async () => {
    if (!selectedEnfant) return;

    try {
      const data = await getSuiviByEnfantAndDate(selectedEnfant, currentDate);
      if (data) {
        setSuiviData({
          ...data,
          enfantId: selectedEnfant,
          date: currentDate,
          humeur: data.humeur ? data.humeur.split(",") : [],
        });
      } else {
        resetForm();
      }
    } catch (error) {
      console.error("Erreur lors du chargement du suivi:", error);
      resetForm();
    }
  };

  const resetForm = () => {
    setSuiviData({
      enfantId: selectedEnfant || 0,
      date: currentDate,
      humeur: [],
    });
  };

  const handleHumeurToggle = (value: string) => {
    setSuiviData((prev) => ({
      ...prev,
      humeur: prev.humeur?.includes(value)
        ? prev.humeur.filter((h) => h !== value)
        : [...(prev.humeur || []), value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnfant) {
      toast.error("Veuillez sélectionner un enfant");
      return;
    }

    setLoading(true);
    try {
      const dataToSend: SuiviJournalierData = {
        enfantId: selectedEnfant,
        date: currentDate,
        humeur: suiviData.humeur?.join(","),
        temperature: suiviData.temperature,
        pleurs: suiviData.pleurs,
        besoins: suiviData.besoins,
        repasHoraires: suiviData.repasHoraires,
        repasAliments: suiviData.repasAliments,
        dodoDeb: suiviData.dodoDeb,
        dodoFin: suiviData.dodoFin,
        activites: suiviData.activites,
        promenadeHoraires: suiviData.promenadeHoraires,
        remarques: suiviData.remarques,
      };

      await createOrUpdateSuivi(dataToSend);
      toast.success("Suivi enregistré avec succès ! ✅");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement du suivi");
    } finally {
      setLoading(false);
    }
  };

  const selectedEnfantData = enfants.find((e) => e.id === selectedEnfant);

  return (
    <div className="space-y-6">
      {/* Sélection enfant et date */}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
          >
            {enfants.map((enfant) => (
              <option key={enfant.id} value={enfant.id}>
                {enfant.prenom} {enfant.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col gap-2">
          <label
            htmlFor="date-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <input
            id="date-select"
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
            max={new Date().toISOString().split("T")[0]}
          />
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Santé */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🏥</span>
            Santé
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Température (°C)
              </label>
              <input
                id="temperature"
                type="number"
                step="0.1"
                min="35"
                max="42"
                value={suiviData.temperature || ""}
                onChange={(e) =>
                  setSuiviData({
                    ...suiviData,
                    temperature: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="37.0"
              />
            </div>
            <div>
              <label
                htmlFor="pleurs"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pleurs
              </label>
              <input
                id="pleurs"
                type="text"
                value={suiviData.pleurs || ""}
                onChange={(e) =>
                  setSuiviData({ ...suiviData, pleurs: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Occasionnels, fréquents..."
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="besoins"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Besoins
              </label>
              <textarea
                id="besoins"
                value={suiviData.besoins || ""}
                onChange={(e) =>
                  setSuiviData({ ...suiviData, besoins: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Couches, soins particuliers..."
                rows={2}
              />
            </div>
          </div>
        </motion.div>

        {/* Section Repas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🍎</span>
            Repas
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="repas-horaires"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Horaires
              </label>
              <input
                id="repas-horaires"
                type="text"
                value={suiviData.repasHoraires || ""}
                onChange={(e) =>
                  setSuiviData({ ...suiviData, repasHoraires: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="8h30, 12h, 16h..."
              />
            </div>
            <div>
              <label
                htmlFor="repas-aliments"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Aliments
              </label>
              <textarea
                id="repas-aliments"
                value={suiviData.repasAliments || ""}
                onChange={(e) =>
                  setSuiviData({ ...suiviData, repasAliments: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Purée de carottes, compote de pommes..."
                rows={2}
              />
            </div>
          </div>
        </motion.div>

        {/* Section Dodo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>😴</span>
            Sieste / Dodo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dodo-debut"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Début
              </label>
              <input
                id="dodo-debut"
                type="time"
                value={suiviData.dodoDeb || ""}
                onChange={(e) =>
                  setSuiviData({ ...suiviData, dodoDeb: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="dodo-fin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fin
              </label>
              <input
                id="dodo-fin"
                type="time"
                value={suiviData.dodoFin || ""}
                onChange={(e) =>
                  setSuiviData({ ...suiviData, dodoFin: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Section Humeur */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>💛</span>
            Humeur
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {humeurOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleHumeurToggle(option.value)}
                className={`flex flex-col items-center justify-center p-4 border rounded-sm transition-all ${
                  suiviData.humeur?.includes(option.value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 "
                }`}
              >
                <span className="text-3xl mb-1">{option.emoji}</span>
                <span className="text-sm font-medium">
                  {option.label.split(" ")[1]}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Section Activités */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🎨</span>
            Activités
          </h2>
          <div>
            <textarea
              id="activites"
              value={suiviData.activites || ""}
              onChange={(e) =>
                setSuiviData({ ...suiviData, activites: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Jeux, dessins, lecture, éveil musical..."
              rows={3}
            />
          </div>
        </motion.div>

        {/* Section Promenades */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border border-gray-200 rounded-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🚶</span>
            Promenades
          </h2>
          <div>
            <label
              htmlFor="promenade-horaires"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Horaires
            </label>
            <input
              id="promenade-horaires"
              type="text"
              value={suiviData.promenadeHoraires || ""}
              onChange={(e) =>
                setSuiviData({
                  ...suiviData,
                  promenadeHoraires: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="10h-11h, 15h-16h..."
            />
          </div>
        </motion.div>

        {/* Section Remarques */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white border border-gray-200 rounded-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📝</span>
            Remarques
          </h2>
          <div>
            <textarea
              id="remarques"
              value={suiviData.remarques || ""}
              onChange={(e) =>
                setSuiviData({ ...suiviData, remarques: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Commentaires, observations particulières..."
              rows={4}
            />
          </div>
        </motion.div>

        {/* Bouton de soumission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Enregistrement...
              </>
            ) : (
              <>
                <span>💾</span>
                Enregistrer le suivi
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
