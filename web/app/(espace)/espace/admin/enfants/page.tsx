import { getAdminEnfants } from "@/app/lib/api/admin";
import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import AdminEnfantsClient from "../../components/admin/AdminEnfantsClient";

export const metadata: Metadata = {
  title: "Gestion des enfants - Admin",
};

export default async function AdminEnfantsPage() {
  const user = await getServerUser();
  const enfants = await getAdminEnfants();

  return <AdminEnfantsClient user={user} enfants={enfants} />;
}
