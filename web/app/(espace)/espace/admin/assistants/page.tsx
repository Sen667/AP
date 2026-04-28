import { getAdminAssistants } from "@/app/lib/api/admin";
import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import AdminAssistantsClient from "../../components/admin/AdminAssistantsClient";

export const metadata: Metadata = {
  title: "Gestion des assistants - Admin",
};

export default async function AdminAssistantsPage() {
  const user = await getServerUser();
  const assistants = await getAdminAssistants();

  return <AdminAssistantsClient user={user} assistants={assistants} />;
}
