import getServerUser from "@/app/lib/api/getServerUser";
import type { Metadata } from "next";
import EspacePageClient from "./components/shared/EspacePageClient";

export const metadata: Metadata = {
  title: "Mon espace",
};

export default async function EspacePage() {
  const user = await getServerUser();

  return <EspacePageClient user={user} />;
}
