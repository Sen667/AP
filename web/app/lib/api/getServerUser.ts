import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { axios } from "@/app/lib/axios.instance";
import { getServerSession } from "next-auth/next";
import type { UtilisateurModel } from "../../types/models/utilisateur";

export default async function getServerUser(): Promise<UtilisateurModel> {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    throw new Error("Utilisateur non connecté");
  }

  const res = await axios.get("/user/me");

  return res.data.user as UtilisateurModel;
}
