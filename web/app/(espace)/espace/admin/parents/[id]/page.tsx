import { getAdminParentById } from "@/app/lib/api/admin";
import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminParentDetailClient from "../../../components/admin/AdminParentDetailClient";

export const metadata: Metadata = {
  title: "Detail parent - Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminParentDetailPage({ params }: Props) {
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
    const parent = await getAdminParentById(id);
    return <AdminParentDetailClient parent={parent} />;
  } catch (error) {
    notFound();
  }
}
