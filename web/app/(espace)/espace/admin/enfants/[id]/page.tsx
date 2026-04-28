import { getAdminEnfantById } from "@/app/lib/api/admin";
import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminEnfantDetailClient from "../../../components/admin/AdminEnfantDetailClient";

export const metadata: Metadata = {
  title: "Detail enfant - Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEnfantDetailPage({ params }: Props) {
  const { id: idStr } = await params;
  const user = await getServerUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/espace");
  }

  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    notFound();
  }

  try {
    const enfant = await getAdminEnfantById(id);
    return <AdminEnfantDetailClient enfant={enfant} />;
  } catch (error) {
    notFound();
  }
}
