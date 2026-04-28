import Card from "@/app/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord Admin",
};

export default async function AdminPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">
          Administration - Fripouilles
        </p>
        <h1 className="text-primary font-semibold max-sm:text-xl text-2xl">
          Tableau de bord administrateur
        </h1>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Enfants"
          description="Consultez la liste de tous les enfants inscrits au RAM"
          linkText="Voir les enfants"
          linkPath="/espace/admin/enfants"
        />
        <Card
          title="Parents"
          description="Consultez la liste de tous les parents inscrits au RAM"
          linkText="Voir les parents"
          linkPath="/espace/admin/parents"
        />
        <Card
          title="Assistants"
          description="Consultez la liste de tous les assistants maternels du RAM"
          linkText="Voir les assistants"
          linkPath="/espace/admin/assistants"
        />
        <Card
          title="Contrats"
          description="Consultez tous les contrats de garde du RAM"
          linkText="Voir les contrats"
          linkPath="/espace/admin/contrats"
        />
      </div>
    </>
  );
}
