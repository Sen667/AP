"use client";

import { UtilisateurModel } from "@/app/types/models/utilisateur";
import {
  CheckCircle,
  Clipboard,
  Layout,
  Map,
  Settings,
  Users as UserIcon,
} from "@deemlol/next-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  label: string;
  icon: React.ReactNode;
  href: string;
  children?: NavLink[];
}

export default function Sidebar({ user }: { user: UtilisateurModel | null }) {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon }: NavLink) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-sm transition-colors duration-200 hover:bg-primary/90 hover:text-white ml-1 pl-4 ${
          isActive
            ? "bg-primary text-white border-primary"
            : "text-black border-gray-300"
        }`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </Link>
    );
  };

  const NavSection = ({ label, icon, href, children }: NavSection) => {
    const isActive = pathname === href;

    return (
      <li>
        <Link
          href={href}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-sm transition-colors duration-200 hover:bg-primary/90 hover:text-white ${
            isActive ? "bg-primary text-white" : "text-black"
          }`}
        >
          <span className="mr-5">{icon}</span>
          {label}
        </Link>
        {children && (
          <ul className="space-y-5 mt-3 ml-2 border-l-2 border-gray-300">
            {children.map((link) => (
              <li key={link.href}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  const getNavSections = (): NavSection[] => {
    if (user?.role === "PARENT") {
      return [
        {
          label: "Mon espace",
          icon: <Layout size={16} />,
          href: "/espace",
          children: [
            {
              href: "/espace/enfants",
              label: "Mes enfants",
              icon: <UserIcon size={16} />,
            },
            {
              href: "/espace/suivis-garde",
              label: "Suivis de garde",
              icon: <CheckCircle size={16} />,
            },
            {
              href: "/espace/suivi-journalier",
              label: "Suivi journalier",
              icon: <Clipboard size={16} />,
            },
            {
              href: "/espace/ateliers",
              label: "Ateliers",
              icon: <Map size={16} />,
            },
            {
              href: "/espace/profil",
              label: "Mon profil",
              icon: <Settings size={16} />,
            },
          ],
        },
      ];
    }

    if (user?.role === "ASSISTANT") {
      return [
        {
          label: "Mon espace",
          icon: <Layout size={16} />,
          href: "/espace",
          children: [
            {
              href: "/espace/contrats",
              label: "Mes contrats",
              icon: <Clipboard size={16} />,
            },
            {
              href: "/espace/suivi-journalier",
              label: "Suivi journalier",
              icon: <Clipboard size={16} />,
            },
            {
              href: "/espace/ateliers",
              label: "Ateliers",
              icon: <Map size={16} />,
            },
            {
              href: "/espace/profil",
              label: "Mon profil",
              icon: <Settings size={16} />,
            },
          ],
        },
      ];
    }

    if (user?.role === "ADMIN") {
      return [
        {
          label: "Administration",
          icon: <Layout size={16} />,
          href: "/espace/admin",
          children: [
            {
              href: "/espace/admin/enfants",
              label: "Enfants",
              icon: <UserIcon size={16} />,
            },
            {
              href: "/espace/admin/parents",
              label: "Parents",
              icon: <UserIcon size={16} />,
            },
            {
              href: "/espace/admin/assistants",
              label: "Assistants",
              icon: <Clipboard size={16} />,
            },
            {
              href: "/espace/admin/contrats",
              label: "Contrats",
              icon: <Clipboard size={16} />,
            },
          ],
        },
      ];
    }

    return [];
  };

  const navSections = getNavSections();

  return (
    <aside className="min-h-full w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-center border-b border-gray-200 h-17 shrink-0">
          <Link href="/espace">
            <Image
              src="/fripouilles.png"
              alt="Logo"
              width={50}
              height={50}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </Link>
        </div>

        <div className="p-4 pt-6 flex flex-col flex-1">
          <h6 className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Navigation
          </h6>
          <ul className="space-y-1">
            {navSections.map((section) => (
              <NavSection key={section.href} {...section} />
            ))}
          </ul>
        </div>
      </div>

      {user && (
        <div className="p-4 border-t border-gray-200 flex items-center gap-3 shrink-0">
          <div
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold select-none shrink-0"
            aria-hidden
          >
            {`${user.prenom[0]}${user.nom[0]}`.toUpperCase()}
          </div>

          <div className="min-w-0 text-sm space-y-0.5">
            <p className="font-medium text-gray-900 truncate">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.role === "ADMIN"
                ? "Administrateur"
                : user.role === "ASSISTANT"
                  ? user.sexe === "FEMININ"
                    ? "Assistante"
                    : "Assistant"
                  : "Parent"}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
