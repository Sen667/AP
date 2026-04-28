"use client";

import Button from "@/app/components/ui/Button";
import { downloadAutorisationPdf } from "@/app/lib/api/pdf";
import type { PersonneAutoriseeModel } from "@/app/types/models/personne-autorisee";
import { FileText, XCircle } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

interface GeneratePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  personnes: PersonneAutoriseeModel[];
  enfantPrenom: string;
}

export default function GeneratePdfModal({
  isOpen,
  onClose,
  personnes,
  enfantPrenom,
}: GeneratePdfModalProps) {
  const [loading, setLoading] = useState(false);
  const [parentsNom, setParentsNom] = useState("");
  const [parent1Nom, setParent1Nom] = useState("");
  const [parent2Nom, setParent2Nom] = useState("");
  const [faitA, setFaitA] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const handleGeneratePdf = async () => {
    if (!parentsNom.trim()) {
      toast.error("Veuillez saisir le nom des parents");
      return;
    }

    if (!faitA.trim()) {
      toast.error("Veuillez saisir le lieu de signature");
      return;
    }

    if (personnes.length === 0) {
      toast.error("Aucune personne autorisée à inclure dans le document");
      return;
    }

    try {
      setLoading(true);

      const personne1 = personnes[0];
      const personne2 = personnes.length > 1 ? personnes[1] : null;

      await downloadAutorisationPdf(
        {
          parentsNom: parentsNom.trim(),
          parent1Nom: parent1Nom.trim() || undefined,
          parent2Nom: parent2Nom.trim() || undefined,
          personne1Nom: `${personne1.prenom} ${personne1.nom}`,
          personne1Adresse: personne1.lien || "",
          personne2Nom: personne2 ? `${personne2.prenom} ${personne2.nom}` : "",
          personne2Adresse: personne2?.lien || "",
          personne2Ville: "",
          faitA: faitA.trim(),
          date: new Date().toLocaleDateString("fr-FR"),
        },
        `autorisation-${enfantPrenom.toLowerCase()}-${Date.now()}.pdf`,
      );

      toast.success("PDF généré avec succès");
      onClose();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="generate-pdf-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md rounded-md p-6 shadow-lg relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
              type="button"
              disabled={loading}
            >
              <XCircle size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Générer l'autorisation PDF
                </h2>
                <p className="text-xs text-gray-500">Pour {enfantPrenom}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nom des parents <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="M. et Mme Dupont"
                  value={parentsNom}
                  onChange={(e) => setParentsNom(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-primary transition"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Signature parent 1
                  </label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    value={parent1Nom}
                    onChange={(e) => setParent1Nom(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-primary transition"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Signature parent 2
                  </label>
                  <input
                    type="text"
                    placeholder="Marie Dupont"
                    value={parent2Nom}
                    onChange={(e) => setParent2Nom(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-primary transition"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Fait à <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Paris"
                  value={faitA}
                  onChange={(e) => setFaitA(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:ring-1 focus:ring-primary transition"
                  disabled={loading}
                />
              </div>

              {personnes.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-sm">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Personnes autorisées incluses :
                  </p>
                  <ul className="space-y-1">
                    {personnes.slice(0, 2).map((p) => (
                      <li key={p.id} className="text-xs text-gray-700">
                        • {p.prenom} {p.nom}
                      </li>
                    ))}
                  </ul>
                  {personnes.length > 2 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Note : Seules les 2 premières personnes seront incluses
                      dans le document
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="gray"
                text="Annuler"
                icon={<XCircle size={14} />}
                onClick={onClose}
                disabled={loading}
                className="flex-1 justify-center"
              />
              <Button
                type="primary"
                icon={<FileText size={16} />}
                text={loading ? "Génération..." : "Générer"}
                onClick={handleGeneratePdf}
                disabled={loading}
                className="flex-1 justify-center"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
