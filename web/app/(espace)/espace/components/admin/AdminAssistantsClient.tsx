"use client";

import Button from "@/app/components/ui/Button";
import type { UtilisateurModel } from "@/app/types/models/utilisateur";
import { Eye } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import type { ChangeEvent } from "react";
import { useState } from "react";

interface AdminAssistantsClientProps {
  user: UtilisateurModel;
  assistants: UtilisateurModel[];
}

export default function AdminAssistantsClient({
  assistants,
}: AdminAssistantsClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    global: {
      value: null as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

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
        <h1 className="text-primary font-semibold text-base sm:text-xl">
          Gestion des assistants
        </h1>
      </div>

      <div className="overflow-x-auto -mx-3 max-sm:-mx-4 md:mx-0">
        <h1 className="text-sm text-gray-500 max-sm:text-xs mb-4">
          Nombre d&apos;assistants : {assistants.length}{" "}
          {assistants.length > 1 ? "assistants" : "assistant"}
        </h1>
        <div className="max-sm:px-2">
          <DataTable
            value={assistants}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage="Aucun assistant trouvé"
            filters={filters}
            globalFilterFields={["nom", "prenom", "email", "telephone"]}
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
              field="nom"
              header="Nom"
              style={{ textAlign: "center", minWidth: "55px" }}
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
              field="telephone"
              header="Tél"
              style={{ textAlign: "center", minWidth: "65px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              field="assistantProfil.numeroAgrement"
              header="N° Agr."
              body={(rowData) => rowData.assistantProfil?.numeroAgrement || "-"}
              style={{ textAlign: "center", minWidth: "65px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              field="assistantProfil.capaciteAccueil"
              header="Cap."
              body={(rowData) =>
                rowData.assistantProfil?.capaciteAccueil || "-"
              }
              style={{ textAlign: "center", minWidth: "50px" }}
              headerStyle={{ textAlign: "center" }}
              className="text-center"
            />
            <Column
              field="assistantProfil.experience"
              header="Exp."
              body={(rowData) =>
                `${rowData.assistantProfil?.experience || "-"} a`
              }
              style={{ textAlign: "center", minWidth: "50px" }}
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
                      router.push(`/espace/admin/assistants/${rowData.id}`)
                    }
                    className="px-1.5 py-0.5 text-xs"
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
