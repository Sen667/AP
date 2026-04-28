import { getContratGardeById } from "@/app/lib/api/contratGarde";
import { redirect } from "next/navigation";
import AdminContratEditClient from "../../../components/admin/AdminContratEditClient";

export default async function AdminContratEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const contrat = await getContratGardeById(Number(id));
    return <AdminContratEditClient contrat={contrat} />;
  } catch (error) {
    console.error("Erreur lors de la récupération du contrat:", error);
    redirect("/espace/admin/contrats");
  }
}
