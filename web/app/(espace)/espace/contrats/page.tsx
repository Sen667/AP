import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ContratsAssistantList from "../components/assistant/ContratsAssistantList";

export default async function ContratsPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "ADMIN") {
    redirect("/espace");
  }

  // Parents: redirect to enfants page where contract management is done in the "assistantes" tab
  if (session?.user.role === "PARENT") {
    redirect("/espace/enfants");
  }

  return (
    <div className="">
      {session?.user.role === "ASSISTANT" && (
        <div>
          <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">
            Mes contrats - Fripouilles
          </p>
          <h1 className="text-primary font-semibold text-xl mb-6 max-sm:text-lg">
            Mes contrats de garde
          </h1>
          <ContratsAssistantList />
        </div>
      )}
    </div>
  );
}
