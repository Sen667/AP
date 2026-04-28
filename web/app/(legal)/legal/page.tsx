import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function LegalNotice() {
  return (
    <div>
      <h1 className="text-2xl max-sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
        Mentions légales
      </h1>
      <p className="max-sm:mt-2 mt-4 max-sm:text-xs text-sm text-gray-500">
        Dernière mise à jour :{" "}
        <span className="text-primary">17 janvier 2026</span>
      </p>

      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          1. Éditeur du site
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Le site Les Fripouilles est édité par le Relais Assistantes
          Maternelles (RAM) Les Fripouilles, Allée Levillain, 62200
          Boulogne-sur-Mer.
        </p>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700\">
          Téléphone : 03-21-91-00-00
          <br />
          Courriel : ram@ville-boulogne-sur-mer.fr
        </p>
      </section>

      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          2. Directeur de publication
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Le directeur de publication est le responsable du RAM Les Fripouilles.
        </p>
      </section>

      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          3. Hébergement
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Le site est hébergé par l'infrastructure du RAM Les Fripouilles.
        </p>
      </section>

      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          4. Propriété intellectuelle
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          L ensemble des contenus (textes, logos, visuels) est protégé par le
          droit d'auteur. Toute reproduction est interdite sans autorisation.
        </p>
      </section>

      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          5. Données personnelles
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Les traitements de données personnelles sont décrits dans la politique
          de confidentialité.
        </p>
      </section>
    </div>
  );
}
