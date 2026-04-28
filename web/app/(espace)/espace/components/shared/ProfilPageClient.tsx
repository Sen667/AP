"use client";

import { Role } from "@/app/types/enums";
import type { UtilisateurModel } from "@/app/types/models/utilisateur";
import AssistantProfilForm from "../form/AssistantProfilForm";
import ParentProfilForm from "../form/ParentProfilForm";

interface Props {
  user: UtilisateurModel;
  role: Role;
}

export default function ProfilPageClient({ user, role }: Props) {
  return (
    <div>
      {role === Role.PARENT && (
        <>
          <ParentProfilForm user={user} parentProfil={user.parentProfil} />
        </>
      )}
      {role === Role.ASSISTANT && (
        <>
          <AssistantProfilForm
            user={user}
            assistantProfil={user.assistantProfil}
          />
        </>
      )}
    </div>
  );
}
