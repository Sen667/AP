import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#fcfcfc] text-[#1a1a1a] scroll-smooth min-h-screen flex flex-col">
      <nav className="bg-white/70 backdrop-blur-sm fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto py-5 max-md:px-5 h-max flex justify-between items-center">
          <Link href="/" className="font-bold text-lg flex items-center gap-3">
            <div className="h-10 w-10 relative">
              <Image
                src="/fripouilles.png"
                alt="Logo"
                fill
                className="rounded-sm object-cover"
                sizes="40px"
              />
            </div>
            <span>Les Fripouilles</span>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link
              href="/#contact"
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-cyan-700 transition"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 max-sm:px-4 px-6 flex-1">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      <footer className="py-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto max:sm:px-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="font-bold text-lg flex items-center justify-center md:justify-start gap-2 mb-2">
                {" "}
                <span>Les Fripouilles</span>
              </div>
              <p className="text-xs text-gray-400">
                © 2026 Les Fripouilles — Ville de Boulogne-sur-Mer
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-gray-500 justify-center md:justify-start">
              <Link
                href="/legal"
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                Mentions légales
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                Conditions d'utilisation
              </Link>
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
