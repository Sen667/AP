"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SuiviJournalierNounou from "../components/suivi-journalier/SuiviJournalierNounou";
import SuiviJournalierParent from "../components/suivi-journalier/SuiviJournalierParent";
import SuiviJournalierSemaine from "../components/suivi-journalier/SuiviJournalierSemaine";
import SuiviJournalierSemaineParent from "../components/suivi-journalier/SuiviJournalierSemaineParent";

export default function SuiviJournalierPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<"jour" | "semaine">("jour");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">
        Suivi journalier - Fripouilles
      </p>
      <h1 className="text-primary font-semibold text-xl mb-6 max-sm:text-lg">
        Suivi journalier des enfants
      </h1>

      {(userRole === "ASSISTANT" || userRole === "PARENT") && (
        <div className="mb-6">
          <div className="flex gap-2 bg-white border border-gray-200 rounded-sm p-1 w-fit">
            <button
              onClick={() => setMode("jour")}
              className={`px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer ${
                mode === "jour"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              Vue Journalière
            </button>
            <button
              onClick={() => setMode("semaine")}
              className={`px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer ${
                mode === "semaine"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              Vue Hebdomadaire
            </button>
          </div>
        </div>
      )}

      {userRole === "ASSISTANT" ? (
        mode === "jour" ? (
          <SuiviJournalierNounou />
        ) : (
          <SuiviJournalierSemaine />
        )
      ) : userRole === "PARENT" ? (
        mode === "jour" ? (
          <SuiviJournalierParent />
        ) : (
          <SuiviJournalierSemaineParent />
        )
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
          <p className="text-lg text-gray-900">Accès non autorisé</p>
        </div>
      )}
    </div>
  );
}
