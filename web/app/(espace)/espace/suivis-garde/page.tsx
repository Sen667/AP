import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SuivisGardeParentList from "../components/parent/SuivisGardeParentList";

export default async function SuivisGardePage() {
  const session = await getServerSession(authOptions);

  // Rediriger les non-parents
  if (session?.user.role !== "PARENT") {
    redirect("/espace");
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2 max-sm:text-xs">
        Suivis de garde - Fripouilles
      </p>
      <h1 className="text-primary font-semibold text-xl mb-6 max-sm:text-lg">
        Suivis de garde des assistantes
      </h1>
      <SuivisGardeParentList />
    </div>
  );
}
