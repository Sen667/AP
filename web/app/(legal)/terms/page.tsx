import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
};

export default function Terms() {
  return (
    <div>
      <h1 className="text-2xl max-sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
        Conditions d&apos;utilisation
      </h1>
      <p className="max-sm:mt-2 mt-4 max-sm:text-xs text-sm text-gray-500">
        Dernière mise à jour :{" "}
        <span className="text-primary">17 janvier 2026</span>
      </p>

      {/* 1. Objet du site */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          1. Objet du site
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Le site <span className="text-primary">Les Fripouilles</span> présente
          le Relais Assistantes Maternelles, ses services (multi-accueil,
          crèche, ateliers d&apos;éveil, accompagnement des assistantes
          maternelles) et met à disposition des familles et des professionnels
          des informations pratiques ainsi que des services en ligne liés à ces
          activités.
        </p>
      </section>

      {/* 2. Acceptation des conditions */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          2. Acceptation des conditions
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          En accédant au site et en utilisant ses fonctionnalités (consultation
          des informations, formulaires d&apos;inscription, prise de contact,
          etc.), vous reconnaissez accepter pleinement les présentes{" "}
          <span className="text-primary">conditions d&apos;utilisation</span>.
          Si vous n&apos;acceptez pas ces conditions, vous êtes invité à ne pas
          utiliser le site.
        </p>
      </section>

      {/* 3. Utilisation des services */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          3. Utilisation du site et des services
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Vous vous engagez à utiliser le site dans le respect de la loi, des
          règles de fonctionnement du Ram Les Fripouilles et des présentes
          conditions. Toute utilisation abusive, frauduleuse ou de nature à
          perturber le bon fonctionnement des services (inscriptions en ligne,
          demandes de contact, etc.) est strictement interdite.
        </p>
      </section>

      {/* 4. Informations fournies par l'utilisateur */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          4. Exactitude des informations fournies
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Lors de l&apos;utilisation des formulaires d&apos;inscription ou de
          contact, vous vous engagez à fournir des informations{" "}
          <span className="text-primary">exactes</span>, complètes et à jour,
          notamment concernant votre identité, vos coordonnées et, le cas
          échéant, les informations relatives à vos enfants.
        </p>
      </section>

      {/* 5. Propriété intellectuelle */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          5. Propriété intellectuelle
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          L&apos;ensemble des contenus du site (textes, images, logos, éléments
          graphiques, supports de présentation des ateliers, etc.) est la{" "}
          <span className="text-primary">propriété</span> du Ram Les Fripouilles
          ou de ses partenaires et est protégé par la législation relative à la
          propriété intellectuelle. Toute reproduction, diffusion ou
          modification non autorisée de ces contenus est interdite.
        </p>
      </section>

      {/* 6. Disponibilité du site */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          6. Disponibilité du site
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Le site est en principe accessible en permanence. Toutefois,
          l&apos;accès peut être suspendu temporairement pour des raisons de
          maintenance, de mise à jour ou en cas de problème technique
          indépendant de notre volonté.
        </p>
      </section>

      {/* 7. Liens externes */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          7. Liens vers des sites tiers
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Le site peut contenir des liens vers des sites gérés par des tiers
          (par exemple des partenaires institutionnels ou des organismes
          d&apos;information). Le Ram Les Fripouilles ne saurait être tenu
          responsable du contenu ou du fonctionnement de ces sites externes.
        </p>
      </section>

      {/* 8. Modifications */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          8. Modifications des conditions
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Nous nous réservons le droit de{" "}
          <span className="text-primary mr-0.5">mettre à jour </span> les
          présentes conditions d&apos;utilisation afin de les adapter à
          l&apos;évolution du site, des services proposés ou de la
          réglementation. Les nouvelles conditions s&apos;appliquent dès leur
          publication sur cette page.
        </p>
      </section>

      {/* 9. Contact */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          9. Contact
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Pour toute question relative au fonctionnement du site ou aux
          présentes conditions d&apos;utilisation, vous pouvez prendre contact
          avec le Ram Les Fripouilles via la
          <span className="text-primary"> page de contact</span> ou aux
          coordonnées indiquées dans les informations officielles du relais .
        </p>
      </section>

      {/* 10. Loi applicable */}
      <section className="max-sm:mt-6 sm:mt-8 md:mt-10 max-sm:mb-16 mb-20">
        <h2 className="max-sm:mt-4 mt-10 text-lg max-sm:text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          10. Loi applicable
        </h2>
        <p className="max-sm:mt-2 mt-4 max-sm:text-xs sm:text-sm text-gray-700">
          Les présentes conditions d&apos;utilisation sont régies par le droit
          français. Tout litige relatif à l&apos;utilisation du site sera soumis
          à la compétence exclusive des juridictions françaises.
        </p>
      </section>
    </div>
  );
}
