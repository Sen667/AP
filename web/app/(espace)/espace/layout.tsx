import LogoutButton from "@/app/components/ui/LogoutButton";
import MobileMenu from "@/app/components/ui/MobileMenu";
import Sidebar from "@/app/components/ui/Sidebar";
import getServerUser from "../../lib/api/getServerUser";

export default async function EspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="max-sm:h-14 h-17 sticky top-0 z-50 flex items-center justify-between md:justify-end bg-white border-b border-gray-200 max-sm:px-3 px-4 md:px-10 max-sm:gap-2 gap-4">
          <MobileMenu user={user} />
          <div className="md:ml-auto">
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 max-sm:px-2 sm:px-3 md:p-8 max-sm:py-3 sm:py-4 md:py-8 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
