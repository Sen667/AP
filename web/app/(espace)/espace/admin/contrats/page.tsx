import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminContratsClient from "../../components/admin/AdminContratsClient";

export default async function AdminContratsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/espace");
  }

  return <AdminContratsClient />;
}
