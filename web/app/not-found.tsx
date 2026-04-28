import { BackButton } from "@/app/components/ui/BackButton";
import { ArrowLeft, House } from "@deemlol/next-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page non trouvée",
  description: "La page que vous recherchez n'existe pas ou a été déplacée.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative animate-fade-in">
          <div className="relative inline-block">
            <Image
              src="/fripouilles.png"
              alt="Illustration page non trouvée"
              width={140}
              height={140}
              className="mx-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
              priority
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-6">
            <div className="text-8xl font-black text-gray-200 select-none">
              404
            </div>
          </div>
        </div>

        <div className="space-y-6 animate-slide-up">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">
              Oups ! Page introuvable
            </h1>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed mx-auto">
            Désolé, nous n'avons pas pu trouver la page que vous recherchez.
            <br />
            Il se peut qu'elle ait été déplacée, supprimée ou que l'adresse soit
            incorrecte.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-primary to-primary/90 text-white font-semibold rounded-xl hover:from-primary/90 hover:to-primary/80 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-primary/30 focus:ring-offset-2 shadow-sm active:scale-[0.98] transform"
            aria-label="Retour à la page d'accueil"
            prefetch={true}
          >
            <House className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Retour à l'accueil</span>
          </Link>

          <BackButton
            className="cursor-pointer group inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-offset-2 shadow-sm active:scale-[0.98] transform"
            aria-label="Revenir en arrière"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Revenir en arrière</span>
          </BackButton>
        </div>
      </div>
    </main>
  );
}
