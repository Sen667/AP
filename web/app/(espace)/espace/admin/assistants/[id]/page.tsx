import { getAdminAssistantById } from "@/app/lib/api/admin";
import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminAssistantDetailClient from "../../../components/admin/AdminAssistantDetailClient";

export const metadata: Metadata = {
  title: "Detail assistant - Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminAssistantDetailPage({ params }: Props) {
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
    const assistant = await getAdminAssistantById(id);
    return <AdminAssistantDetailClient assistant={assistant} />;
  } catch (error) {
    notFound();
  }
}
