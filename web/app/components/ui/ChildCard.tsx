"use client";

import { calculateAge } from "@/app/lib/utils";
import { Trash } from "@deemlol/next-icons";
import Link from "next/link";
import { useState } from "react";

type ChildCardProps = {
  id: number;
  prenom: string;
  nom: string;
  dateNaissance: string | Date;
  sexe?: string;
  linkPath?: string;
  onDelete?: (id: number) => Promise<void>;
};

export default function ChildCard({
  id,
  prenom,
  nom,
  dateNaissance,
  sexe,
  linkPath = "#",
  onDelete,
}: ChildCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const age = calculateAge(dateNaissance);
  const sexeLabel =
    sexe === "MASCULIN" ? "Garçon" : sexe === "FEMININ" ? "Fille" : "";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onDelete) return;

    if (!confirm(`Supprimer ${prenom} ${nom} ?`)) return;

    try {
      setIsDeleting(true);
      await onDelete(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link href={linkPath} className="block h-full relative group">
      <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg p-5 hover:scale-102 transition cursor-pointer">
        {/* Bouton suppression */}
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="max-sm:opacity-100 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-red-500 hover:bg-red-600 disabled:bg-gray-400 hover:opacity-90 text-white p-2 rounded-sm cursor-pointer font-medium flex items-center gap-2"
            aria-label="Supprimer"
            type="button"
          >
            <Trash size={16} />
          </button>
        )}

        {/* Avatar circulaire avec initiales */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 text-lg font-bold text-gray-700 self-center ${
            sexeLabel === "Garçon"
              ? "bg-yellow-200"
              : sexeLabel === "Fille"
                ? "bg-pink-100"
                : "bg-gray-200"
          }`}
        >
          {`${prenom[0] || ""}${nom[0] || ""}`.toUpperCase()}
        </div>

        {/* Infos principales */}
        <div className="text-center flex items-center flex-col mt-2">
          <h3 className="text-base font-semibold text-gray-800">
            {prenom} {nom}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {age} ans • {sexeLabel}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Né(e) le {new Date(dateNaissance).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>
    </Link>
  );
}
