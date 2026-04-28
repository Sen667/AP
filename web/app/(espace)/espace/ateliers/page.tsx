import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AteliersAssistantList from "../components/assistant/AteliersAssistantList";
import AteliersParentList from "../components/parent/AteliersParentList";

export default async function AteliersPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "PARENT" && session?.user.role !== "ASSISTANT") {
    redirect("/espace");
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">
        Ateliers - Fripouilles
      </p>
      <h1 className="text-primary font-semibold text-xl mb-6 max-sm:text-lg">
        Ateliers d&apos;éveil
      </h1>
      {session.user.role === "PARENT" ? (
        <AteliersParentList />
      ) : (
        <AteliersAssistantList />
      )}
    </div>
  );
}
