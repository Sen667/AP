"use client";

import Card from "@/app/components/ui/Card";
import type { UtilisateurModel } from "@/app/types/models/utilisateur";
import { toast } from "react-hot-toast";
import AssistantProfilModal from "../modal/AssistantProfil";
import ParentProfilModal from "../modal/ParentProfil";

interface Props {
  user: UtilisateurModel;
}

export default function EspacePageClient({ user }: Props) {
  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  return (
    <>
      {user.role === "PARENT" && (
        <ParentProfilModal user={user} onSuccess={handleSuccess} />
      )}

      {user.role === "ASSISTANT" && (
        <AssistantProfilModal user={user} onSuccess={handleSuccess} />
      )}

      <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">
        Mon espace - Fripouilles
      </p>
      <h1 className="text-primary font-semibold text-xl mb-6 max-sm:text-lg">
        Bienvenue dans votre espace personnel !
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {user.role === "PARENT" && (
          <>
            <Card
              title="Mes enfants"
              description="Gérer les informations de vos enfants."
              linkText="Accéder"
              linkPath="/espace/enfants"
            />
            <Card
              title="Mes contrats de garde"
              description="Gérer vos contrats avec les assistantes."
              linkText="Accéder"
              linkPath="/espace/contrats"
            />
          </>
        )}

        {user.role === "ASSISTANT" && (
          <>
            <Card
              title="Mes contrats"
              description="Voir et gérer vos contrats de garde."
              linkText="Accéder"
              linkPath="/espace/contrats"
            />
          </>
        )}
      </div>
    </>
  );
}
