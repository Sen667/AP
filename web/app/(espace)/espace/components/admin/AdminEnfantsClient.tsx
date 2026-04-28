"use client";

import Button from "@/app/components/ui/Button";
import type { EnfantModel } from "@/app/types/models/enfant";
import type { UtilisateurModel } from "@/app/types/models/utilisateur";
import { Eye } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

interface AdminEnfantsClientProps {
  user: UtilisateurModel;
  enfants: EnfantModel[];
}

export default function AdminEnfantsClient({
  enfants,
}: AdminEnfantsClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    global: {
      value: null as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  type EnfantRow = EnfantModel & { parentsDisplay: string };

  const buildParentsLabel = (rowData: EnfantModel) => {
    const parents = rowData.parents
      ?.map((lien) => {
        const user = lien.parent?.utilisateur;
        return user ? `${user.prenom} ${user.nom}` : null;
      })
      .filter((value): value is string => Boolean(value));

    return parents && parents.length > 0 ? parents.join(", ") : "-";
  };

  const enfantsWithParents = useMemo<EnfantRow[]>(
    () =>
      enfants.map((enfant) => ({
        ...enfant,
        parentsDisplay: buildParentsLabel(enfant),
      })),
    [enfants],
  );

  const dateBodyTemplate = (rowData: EnfantRow) => {
    return new Date(rowData.dateNaissance).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const sexeBodyTemplate = (rowData: EnfantRow) => {
    return rowData.sexe === "MASCULIN" ? "Garçon" : "Fille";
  };

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGlobalFilterValue(value);
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value },
    }));
  };

  const header = (
    <div className="flex flex-col sm:flex-row justify-start mb-3 max-sm:px-2">
      <div className="w-full sm:w-56">
        <span className="p-input-icon-left block">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Rechercher"
            className="w-full text-xs py-1"
          />
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Administration - Fripouilles
        </p>
        <h1 className="text-primary font-semibold text-lg sm:text-xl">
          Gestion des enfants
        </h1>
      </div>
      <div></div>
      <h1 className="text-sm text-gray-500 max-sm:text-xs mb-4">
        Nombre d&apos;enfants : {enfants.length}{" "}
        {enfants.length > 1 ? "enfants" : "enfant"}
      </h1>
      <div className="overflow-x-auto -mx-3 max-sm:-mx-4 md:mx-0">
        <div className="max-sm:px-2">
          <DataTable
            value={enfantsWithParents}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage="Aucun enfant trouvé"
            filters={filters}
            globalFilterFields={["nom", "prenom", "sexe", "parentsDisplay"]}
            header={header}
            className="text-[10px] max-sm:text-xs md:text-sm p-datatable-sm"
            stripedRows
            showGridlines
          >
            <Column
              field="id"
              header="ID"
              style={{ textAlign: "center", minWidth: "40px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              field="prenom"
              header="Prénom"
              style={{ textAlign: "center", minWidth: "55px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              field="nom"
              header="Nom"
              style={{ textAlign: "center", minWidth: "55px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              field="dateNaissance"
              header="Naiss."
              body={dateBodyTemplate}
              style={{ textAlign: "center", minWidth: "75px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              field="sexe"
              header="Sexe"
              body={sexeBodyTemplate}
              style={{ textAlign: "center", minWidth: "50px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              field="parentsDisplay"
              header="Parent(s)"
              style={{ textAlign: "center", minWidth: "80px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              header="Act."
              body={(rowData) => (
                <div className="flex justify-center">
                  <Button
                    type="primary"
                    icon={<Eye size={12} />}
                    text=""
                    onClick={() =>
                      router.push(`/espace/admin/enfants/${rowData.id}`)
                    }
                    className="px-2 py-1 max-sm:px-1.5 max-sm:py-0.5 text-xs"
                  />
                </div>
              )}
              style={{ textAlign: "center", minWidth: "45px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
          </DataTable>
        </div>
      </div>
    </>
  );
}
