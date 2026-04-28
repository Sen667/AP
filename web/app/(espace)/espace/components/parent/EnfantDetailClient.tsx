"use client";

import { updateEnfant } from "@/app/lib/api/enfant";
import { calculateAge } from "@/app/lib/utils";
import {
  EditEnfantSchema,
  type EditEnfantData,
} from "@/app/schemas/enfant/edit-enfant";
import { Sexe } from "@/app/types/enums";
import type { EnfantModel } from "@/app/types/models/enfant";
import { ArrowLeft, Save } from "@deemlol/next-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ContratsGardeList from "./ContratsGardeList";
import PersonnesAutoriseesList from "./PersonnesAutoriseesList";

interface Props {
  enfant: EnfantModel;
}

export default function EnfantDetailClient({ enfant }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "infos" | "personnes" | "assistantes"
  >("infos");

  // Initialiser l'onglet actif depuis les query params
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "infos" || tab === "personnes" || tab === "assistantes") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fonction pour changer d'onglet et mettre à jour l'URL
  const handleTabChange = (tab: "infos" | "personnes" | "assistantes") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const defaultValues: EditEnfantData = {
    nom: enfant.nom,
    prenom: enfant.prenom,
    dateNaissance: formatDateForInput(enfant.dateNaissance),
    sexe: enfant.sexe as Sexe,
    allergies: enfant.allergies ?? "",
    remarquesMedicales: enfant.remarquesMedicales ?? "",
    medecinTraitant: enfant.medecinTraitant,
    medecinTraitantTel: enfant.medecinTraitantTel,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditEnfantData>({
    resolver: zodResolver(EditEnfantSchema),
    defaultValues,
  });

  const onSubmit = async (values: EditEnfantData) => {
    setLoading(true);
    setError(null);

    try {
      await updateEnfant(enfant.id, values);
      reset(values);
      toast.success("Informations de l'enfant mises à jour avec succès");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erreur lors de la sauvegarde";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const ageEnfant = calculateAge(enfant.dateNaissance);

  return (
    <div>
      {/* Header avec retour */}
      <div className="max-sm:mb-4 mb-6">
        <Link
          href="/espace/enfants"
          className="inline-flex items-center gap-2 text-primary hover:underline max-sm:mb-3 mb-4"
        >
          <ArrowLeft size={16} />
          <span className="max-sm:text-xs text-sm font-medium">
            Retour à mes enfants
          </span>
        </Link>

        <div className="flex items-center gap-3 max-sm:gap-2">
          {/* Avatar */}
          <div
            className={`max-sm:w-14 max-sm:h-14 w-16 h-16 rounded-full flex items-center justify-center max-sm:text-lg text-xl font-bold text-gray-700 ${enfant.sexe === "MASCULIN" ? "bg-yellow-200" : enfant.sexe === "FEMININ" ? "bg-pink-200" : "bg-gray-200"}`}
          >
            {`${enfant.prenom[0] || ""}${enfant.nom[0] || ""}`.toUpperCase()}
          </div>
          <div>
            <h1 className="max-sm:text-lg text-xl font-semibold text-primary">
              {enfant.prenom} {enfant.nom}
            </h1>
            <p className="max-sm:text-xs text-sm text-gray-500">
              {ageEnfant} ans •{" "}
              {enfant.sexe === "MASCULIN" ? "Garçon" : "Fille"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4 sm:gap-8">
          <button
            onClick={() => handleTabChange("infos")}
            className={`pb-3 px-1 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "infos"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => handleTabChange("personnes")}
            className={`pb-3 px-1 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "personnes"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Personnes autorisées
          </button>
          <button
            onClick={() => handleTabChange("assistantes")}
            className={`pb-3 px-1 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "assistantes"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Assistantes
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "infos" && (
        <div className="max-sm:p-3 sm:p-4 md:p-6 bg-white border border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-4">
            <span className="text-red-500">*</span> Champ obligatoire
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* --- Informations personnelles --- */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">
                  Informations personnelles
                </h4>
                <hr className="border-gray-300" />
              </div>

              {/* Nom et prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nom"
                    type="text"
                    {...register("nom")}
                    className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.nom ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.nom && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      {errors.nom.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="prenom"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="prenom"
                    type="text"
                    {...register("prenom")}
                    className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.prenom ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.prenom && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      {errors.prenom.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Date de naissance et sexe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dateNaissance"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dateNaissance"
                    type="date"
                    {...register("dateNaissance")}
                    className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.dateNaissance
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.dateNaissance && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      {errors.dateNaissance.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="sexe"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Sexe <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="sexe"
                    {...register("sexe")}
                    className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.sexe ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Sélectionnez le sexe</option>
                    <option value="MASCULIN">Masculin</option>
                    <option value="FEMININ">Féminin</option>
                  </select>
                  {errors.sexe && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      {errors.sexe.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Informations médicales --- */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">
                  Informations médicales
                </h4>
                <hr className="border-gray-300" />
              </div>

              {/* Allergies et remarques médicales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="allergies"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Allergies (optionnel)
                  </label>
                  <input
                    id="allergies"
                    type="text"
                    {...register("allergies")}
                    className="w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary border-gray-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="remarquesMedicales"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Remarques médicales (optionnel)
                  </label>
                  <input
                    id="remarquesMedicales"
                    type="text"
                    {...register("remarquesMedicales")}
                    className="w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary border-gray-300"
                  />
                </div>
              </div>

              {/* Médecin traitant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="medecinTraitant"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Médecin traitant <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="medecinTraitant"
                    type="text"
                    {...register("medecinTraitant")}
                    className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.medecinTraitant
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.medecinTraitant && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      {errors.medecinTraitant.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="medecinTraitantTel"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Téléphone du médecin <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="medecinTraitantTel"
                    type="tel"
                    {...register("medecinTraitantTel")}
                    className={`w-full px-3 py-1.5 text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${
                      errors.medecinTraitantTel
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.medecinTraitantTel && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      {errors.medecinTraitantTel.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Messages d'erreur --- */}
            {error && (
              <p className="text-[0.8rem] text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-sm">
                {error}
              </p>
            )}

            {/* --- Bouton --- */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center cursor-pointer items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-sm hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "personnes" && (
        <PersonnesAutoriseesList
          enfantId={enfant.id}
          enfantPrenom={enfant.prenom}
          initialPersonnes={enfant.personnesAutorisees || []}
        />
      )}

      {activeTab === "assistantes" && (
        <ContratsGardeList enfantId={enfant.id} enfantPrenom={enfant.prenom} />
      )}
    </div>
  );
}
