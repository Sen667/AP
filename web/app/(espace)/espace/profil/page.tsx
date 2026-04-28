import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import ProfilPageClient from "../components/shared/ProfilPageClient";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default async function ProfilPage() {
  const user = await getServerUser();

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">
        Mes informations - Fripouilles
      </p>
      <h1 className="text-primary font-semibold text-xl mb-6 max-sm:text-lg">
        Modifiez vos informations personnelles ici.
      </h1>

      <ProfilPageClient user={user} role={user.role} />
    </div>
  );
}
