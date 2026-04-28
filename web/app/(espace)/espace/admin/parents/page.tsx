import { getAdminParents } from "@/app/lib/api/admin";
import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import AdminParentsClient from "../../components/admin/AdminParentsClient";

export const metadata: Metadata = {
  title: "Gestion des parents - Admin",
};

export default async function AdminParentsPage() {
  const user = await getServerUser();
  const parents = await getAdminParents();

  return <AdminParentsClient user={user} parents={parents} />;
}
