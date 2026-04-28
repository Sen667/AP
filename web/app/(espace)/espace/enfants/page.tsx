import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import ChildClient from "../components/parent/ChildClient";

export const metadata: Metadata = {
  title: "Mes enfants",
};

export default async function Child() {
  const user = await getServerUser();

  return <ChildClient user={user} />;
}
