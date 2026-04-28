import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function Privacy() {
  return (
    <div>
      <h1 className="text-2xl max-sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
        Politique de confidentialité
      </h1>
      <p className="max-sm:mt-2 mt-4 max-sm:text-xs text-sm text-gray-500">
        Dernière mise à jour :{" "}
        <span className="text-primary">17 janvier 2026</span>
      </p>

      {/* 1. Collecte */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          1. Collecte des informations
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Dans le cadre des services proposés par le Relais Assistantes
          Maternelles{" "}
          <span className="text-primary mr-0.5">Les Fripouilles</span>{" "}
          (inscriptions, demandes d&apos;informations, participation aux
          ateliers d&apos;éveil, services de crèche, etc.), nous collectons des{" "}
          <span className="text-primary mr-0.5">données personnelles</span> vous
          concernant, ainsi que, le cas échéant, concernant vos enfants .
        </p>
        <p className="mt-4 text-gray-700">
          Les informations collectées peuvent inclure notamment : vos nom et
          prénom, coordonnées (adresse postale, adresse e-mail, numéro de
          téléphone), votre qualité (parent, assistante maternelle, futur
          parent), ainsi que les informations nécessaires à la gestion des
          inscriptions, des ateliers, de la crèche ou des suivis de garde .
        </p>
      </section>

      {/* 2. Utilisation */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          2. Utilisation des informations
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Les données collectées sont utilisées pour{" "}
          <span className="text-primary mr-1.5"> gérer</span>
          les différents services du Ram Les Fripouilles : inscriptions aux
          ateliers d&apos;éveil, organisation des activités, gestion du service
          de crèche, suivi des demandes d&apos;information et communication avec
          les familles et les assistantes maternelles.
        </p>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Elles peuvent également être utilisées pour établir des statistiques
          internes sur la fréquentation et l&apos;usage des services, dans le
          but d&apos;améliorer la qualité de l&apos;accueil et de
          l&apos;accompagnement proposés aux familles et aux professionnels de
          la petite enfance.
        </p>
      </section>

      {/* 3. Base légale */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          3. Base légale du traitement
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Le traitement de vos données repose principalement sur l&apos;
          <span className="text-primary">exécution des services</span> que vous
          sollicitez (inscription, prise de contact, participation aux
          activités) ainsi que, le cas échéant, sur le respect
          d&apos;obligations légales et réglementaires applicables aux
          structures d&apos;accueil de la petite enfance.
        </p>
      </section>

      {/* 4. Partage */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          4. Partage des informations
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Vos données personnelles ne sont pas cédées à des tiers à des fins
          commerciales. Elles peuvent être partagées, lorsque cela est
          nécessaire, avec nos partenaires institutionnels (par exemple les
          services de la collectivité, la CAF ou d&apos;autres organismes
          sociaux) dans le cadre du fonctionnement du Relais Assistantes
          Maternelles et du financement de ses activités.
        </p>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Ce partage intervient uniquement dans le respect de la{" "}
          <span className="text-primary">réglementation en vigueur</span> et,
          lorsque la loi l&apos;exige, après information ou recueil de votre
          accord.
        </p>
      </section>

      {/* 5. Durée de conservation */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          5. Durée de conservation des données
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Vos informations sont conservées pendant la durée strictement
          nécessaire à la gestion de votre dossier (inscription, suivi de garde,
          utilisation du service de crèche) puis archivées ou supprimées
          conformément aux règles applicables au secteur de la petite enfance et
          aux exigences des collectivités.
        </p>
      </section>

      {/* 6. Sécurité */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          6. Sécurité des données
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Nous mettons en œuvre des{" "}
          <span className="text-primary">mesures de sécurité</span>
          techniques et organisationnelles (contrôle des accès, comptes
          spécifiques pour les personnels, sauvegardes sur les serveurs dédiés,
          etc.) afin de protéger vos données contre tout accès non autorisé,
          perte ou divulgation.
        </p>
      </section>

      {/* 7. Vos droits */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          7. Vos droits
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Conformément à la réglementation applicable, vous disposez d&apos;un
          droit d&apos;
          <span className="text-primary">accès</span>, de rectification, de mise
          à jour et, dans certains cas, de suppression des données vous
          concernant. Vous pouvez également, le cas échéant, vous opposer à
          certains traitements ou en demander la limitation.
        </p>
      </section>

      {/* 8. Contact */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          8. Contact
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Pour toute question relative à cette politique de confidentialité ou
          pour exercer vos droits, vous pouvez contacter le Relais Assistantes
          Maternelles Les Fripouilles par téléphone ou via la{" "}
          <span className="text-primary">page de contact</span> du site .
        </p>
      </section>

      {/* 9. Loi applicable */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10 max-sm:mb-16 mb-20">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          9. Loi applicable
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          La présente politique de confidentialité est régie par le droit
          français. En cas de litige, et à défaut de résolution amiable, les
          juridictions françaises compétentes seront saisies.
        </p>
      </section>
    </div>
  );
}
