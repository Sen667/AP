"use client";

import { UtilisateurModel } from "@/app/types/models/utilisateur";
import {
  CheckCircle,
  Clipboard,
  Layout,
  Menu,
  Settings,
  User as UserIcon,
  X,
} from "@deemlol/next-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

export default function MobileMenu({
  user,
}: {
  user: UtilisateurModel | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, label, icon }: NavLink) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-sm transition-colors duration-200 ${
          isActive ? "bg-primary text-white" : "text-black hover:bg-gray-100"
        }`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </Link>
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
              icon: <span className="text-base">🎨</span>,
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
              href: "/espace/ateliers",
              label: "Ateliers",
              icon: <span className="text-base">🎨</span>,
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
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-1 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <div
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold select-none shrink-0"
              aria-hidden
            >
              {user ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : ""}
            </div>
            <div className="min-w-0 text-sm">
              <p className="font-medium text-gray-900 truncate">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === "ADMIN"
                  ? "Administrateur"
                  : user?.role === "ASSISTANT"
                    ? user?.sexe === "FEMININ"
                      ? "Assistante"
                      : "Assistant"
                    : "Parent"}
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navSections.map((section) => (
              <div key={section.href}>
                <Link
                  href={section.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-1 py-3 text-sm font-medium rounded-sm transition-colors duration-200 ${
                    pathname === section.href
                      ? "bg-primary text-white"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3 ml-3">{section.icon}</span>
                  {section.label}
                </Link>
                {section.children && (
                  <div className="space-y-1 mt-1 ml-2 border-l-2 border-gray-300 pl-2">
                    {section.children.map((link) => (
                      <NavLink key={link.href} {...link} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
