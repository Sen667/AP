"use client";

import Button from "@/app/components/ui/Button";
import { deletePersonneAutorisee } from "@/app/lib/api/personneAutorisee";
import type { PersonneAutoriseeModel } from "@/app/types/models/personne-autorisee";
import {
  Edit,
  FileText,
  Heart,
  Phone,
  Trash,
  User,
  UserPlus,
} from "@deemlol/next-icons";
import { useState } from "react";
import toast from "react-hot-toast";
import GeneratePdfModal from "../modal/GeneratePdfModal";
import PersonneAutoriseeModal from "../modal/PersonneAutoriseeModal";

interface PersonnesAutoriseeListProps {
  enfantId: number;
  enfantPrenom: string;
  initialPersonnes: PersonneAutoriseeModel[];
}

export default function PersonnesAutoriseesList({
  enfantId,
  enfantPrenom,
  initialPersonnes,
}: PersonnesAutoriseeListProps) {
  const [personnes, setPersonnes] =
    useState<PersonneAutoriseeModel[]>(initialPersonnes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [personneToEdit, setPersonneToEdit] =
    useState<PersonneAutoriseeModel | null>(null);

  const openCreate = () => {
    setPersonneToEdit(null);
    setIsModalOpen(true);
  };

  const openEdit = (personne: PersonneAutoriseeModel) => {
    setPersonneToEdit(personne);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPersonneToEdit(null);
  };

  const handleModalSuccess = (message: string) => {
    // Rafraîchir la liste
    window.location.reload();
  };

  const handleDelete = async (personne: PersonneAutoriseeModel) => {
    const confirmed = window.confirm(
      `Supprimer ${personne.prenom} ${personne.nom} ?`,
    );
    if (!confirmed) return;

    try {
      await deletePersonneAutorisee(personne.id);
      setPersonnes((prev) => prev.filter((p) => p.id !== personne.id));
      toast.success("Personne autorisée supprimée");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-sm mt-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Personnes autorisées</h3>
          <p className="text-xs text-gray-500 mt-1">
            Gérez les personnes autorisées à chercher {enfantPrenom}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {personnes.length > 0 && (
            <Button
              type="gray"
              icon={<FileText size={16} />}
              text="Générer l'autorisation PDF"
              onClick={() => setIsPdfModalOpen(true)}
            />
          )}
          <Button
            type="primary"
            icon={<UserPlus size={16} />}
            text="Ajouter une personne"
            onClick={openCreate}
          />
        </div>
      </div>

      {/* Modals */}
      <PersonneAutoriseeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        enfantId={enfantId}
        enfantPrenom={enfantPrenom}
        personneToEdit={personneToEdit}
      />

      <GeneratePdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        personnes={personnes}
        enfantPrenom={enfantPrenom}
      />

      {/* Liste des personnes */}
      {personnes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucune personne autorisée pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personnes.map((personne) => (
            <div
              key={personne.id}
              className="p-4 border border-gray-200 rounded-sm"
            >
              {/* Header de la carte */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      {personne.prenom} {personne.nom}
                    </h4>
                    <p className="text-xs text-gray-500">{personne.email}</p>
                  </div>
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={14} className="shrink-0" />
                  <span>{personne.telephone}</span>
                </div>
                {personne.lien && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Heart size={14} className="shrink-0" />
                    <span>{personne.lien}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button
                  type="primary"
                  icon={<Edit size={14} />}
                  text="Modifier"
                  onClick={() => openEdit(personne)}
                  className="flex-1 justify-center text-xs py-2"
                />
                <Button
                  type="red"
                  icon={<Trash size={14} />}
                  text="Supprimer"
                  onClick={() => handleDelete(personne)}
                  className="flex-1 justify-center text-xs py-2"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
