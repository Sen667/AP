import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accueil",
};

export default async function Home() {
  const session = await getServerSession();
  const isAuthenticated =
    !!session?.user || (session?.expiresAt && session.expiresAt > Date.now());

  return (
    <div className="bg-[#fcfcfc] text-[#1a1a1a] scroll-smooth">
      <nav className="bg-white fixed w-full z-50">
        <div className="max-w-6xl mx-auto py-5 max-md:px-5 h-max flex justify-between items-center">
          <Link href="/" className="font-bold text-lg flex items-center gap-3">
            <div className="h-10 w-10 relative">
              <Image
                src="/fripouilles.png"
                alt="Logo"
                fill
                className="mx-auto drop-shadow-lg"
                priority
              />
            </div>
            <span>Les Fripouilles</span>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link
              href="#contact"
              className="bg-primary text-white px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-cyan-700 transition whitespace-nowrap"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="accueil" className="relative w-full h-150 md:h-175 pt-20">
        <Image
          src="/child.webp"
          alt="Photo d'accueil du RAM Les Fripouilles"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <div className="max-w-3xl text-white">
              <span className="text-[0.7rem] max-sm:text-[0.65rem] font-bold uppercase tracking-widest text-cyan-400 max-sm:mb-2 mb-3 block">
                Boulogne-sur-Mer
              </span>
              <h1 className="text-3xl max-sm:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-sm:mb-4 mb-6 leading-tight">
                Un espace de 1 000 m²
                <br />
                <span className="text-cyan-400">
                  dédié à la petite enfance.
                </span>
              </h1>
              <p className="text-base max-sm:text-sm sm:text-base md:text-lg text-gray-200 max-sm:mb-6 mb-8 leading-relaxed">
                Le Relais d'Assistantes Maternelles Les Fripouilles est un lieu
                d'information, d'échange et d'éveil gratuit financé par la CAF
                et la MSA. Nous accueillons parents, futurs parents, enfants et
                professionnels dans un cadre moderne et sécurisé.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {isAuthenticated ? (
                  <Link
                    href="/espace"
                    className="bg-white text-primary px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-primary hover:text-white transition whitespace-nowrap"
                  >
                    Mon espace personnel DEBUGTEST
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-white text-primary px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-primary hover:text-white transition whitespace-nowrap"
                  >
                    Nous rejoindre
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSIONS */}
      <section className="max-sm:py-10 sm:py-16 md:py-20 bg-slate-50 border-y border-gray-100 max-sm:px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl max-sm:text-xl sm:text-2xl md:text-3xl font-bold max-sm:mb-8 sm:mb-10 md:mb-12">
            Les missions du Relais
          </h2>

          <div className="grid md:grid-cols-3 max-sm:gap-3 sm:gap-4 md:gap-6">
            {[
              {
                title: "Informer & Orienter",
                text: "Accompagner les parents et futurs parents dans leurs choix de modes d'accueil, leurs démarches administratives et leurs droits.",
              },
              {
                title: "Accompagner les professionnels",
                text: "Soutenir les assistantes maternelles agréées dans leur pratique quotidienne et favoriser les échanges professionnels.",
              },
              {
                title: "Favoriser l'éveil",
                text: "Proposer des temps collectifs favorisant la socialisation, la découverte et le développement des jeunes enfants.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white max-sm:p-4 sm:p-5 md:p-6 rounded-xl max-sm:rounded-lg border border-gray-100 shadow-sm"
              >
                <h3 className="font-bold max-sm:text-sm sm:text-base max-sm:mb-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-xs max-sm:text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURES */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-cyan-400 font-bold uppercase text-xs tracking-widest">
                  Infrastructures
                </span>
                <h2 className="max-sm:text-xl sm:text-2xl md:text-3xl font-bold mt-4 mb-6">
                  Un multi-accueil de 25 places
                </h2>
                <p className="text-gray-400 mb-8">
                  Nos locaux sont conçus pour le bien-être et la sécurité des
                  enfants, avec des espaces spécifiques pour chaque moment de la
                  journée.
                </p>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <ul className="space-y-3">
                    {[
                      "Aire d'évolution (150 m²)",
                      "Coin repas équipé",
                      "2 pièces dortoirs",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                        </div>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-3">
                    {[
                      "Salle de lecture & chant",
                      "Salle de change moderne",
                      "Salon d'accueil",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                        </div>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/ram.jpg"
                  alt="Intérieur du "
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TYPES D'ACCUEIL */}
      <section id="types-accueil" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[0.75rem] font-bold uppercase tracking-widest text-primary block mb-2">
              Nos Solutions d'Accueil
            </span>
            <h2 className="max-sm:text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Types d'Accueil Proposés
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Nous adaptons nos services aux besoins spécifiques de chaque
              famille avec différentes formules flexibles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Régulier */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-2xl">
                  📅
                </div>
                <div>
                  <h3 className="text-xl font-bold">Accueil Régulier</h3>
                  <p className="text-sm text-primary font-medium">
                    Planning défini à l'année
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                Pour les familles ayant besoin d'un mode de garde stable et
                prévisible tout au long de l'année.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-700">
                <li>• Contrat annuel avec jours et heures fixes</li>
                <li>• Priorité pour les inscriptions aux ateliers</li>
                <li>• Tarifs préférentiels mensuels</li>
              </ul>
              <div className="pt-6 border-t border-gray-100 text-xs">
                <p className="font-bold text-gray-900 mb-1">Idéal pour :</p>
                <p className="text-gray-600">
                  Parents travaillant à temps plein ou avec horaires fixes
                </p>
              </div>
            </div>

            {/* Occasionnel */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-2xl">
                  ⏱️
                </div>
                <div>
                  <h3 className="text-xl font-bold">Accueil Occasionnel</h3>
                  <p className="text-sm text-primary font-medium">
                    Sur réservation ponctuelle
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                Pour les besoins de garde ponctuels, imprévus ou complémentaires
                à un autre mode de garde.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-700">
                <li>• Réservation 24h à l'avance minimum</li>
                <li>• Flexibilité selon les places disponibles</li>
                <li>• Facturation à l'heure ou à la demi-journée</li>
              </ul>
              <div className="pt-6 border-t border-gray-100 text-xs">
                <p className="font-bold text-gray-900 mb-1">Idéal pour :</p>
                <p className="text-gray-600">
                  Parents en télétravail, freelance, ou avec besoins ponctuels
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATELIERS & EQUIPE */}
      <section
        id="ateliers"
        className="py-20 bg-white border-y border-gray-100 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[0.75rem] font-bold uppercase tracking-widest text-primary block mb-2">
              Éveil & Socialisation
            </span>
            <h2 className="max-sm:text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Les Ateliers d'Éveil
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Des activités gratuites centrées sur la découverte (min. 4 fois
              par semaine).
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl mb-4">🎨</div>
              <h3 className="font-bold mb-2 text-sm">Activités Variées</h3>
              <p className="text-xs text-gray-500">
                Peinture, motricité et jeux sensoriels adaptés.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl mb-4">📚</div>
              <h3 className="font-bold mb-2 text-sm">Bibliothèque</h3>
              <p className="text-xs text-gray-500">
                Partenariat pour l'emprunt d'albums jeunesse.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl mb-4">🗓️</div>
              <h3 className="font-bold mb-2 text-sm">Inscriptions</h3>
              <p className="text-xs text-gray-500">
                Obligatoires avant le lundi/jeudi précédent.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-8 text-center">
            Une équipe de 5 professionnels
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Directeur", sub: "Éducateur J.E.", code: "DIR" },
              { label: "Hôtesse", sub: "Éducatrice J.E.", code: "HÔT" },
              { label: "Auxiliaire", sub: "Puériculture", code: "AUX" },
              { label: "Animatrice", sub: "CAP Petite Enfance", code: "ANI" },
              { label: "Infirmière", sub: "Suivi Médical", code: "INF" },
            ].map((staff, i) => (
              <div
                key={i}
                className="text-center p-4 bg-white rounded-xl border border-gray-100"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-xs font-bold text-gray-400">
                  {staff.code}
                </div>
                <p className="text-xs font-bold">{staff.label}</p>
                <p className="text-sm text-gray-500">{staff.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULAIRE DE CONTACT */}
      <section id="contact" className="py-20 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            {/* Colonne gauche */}
            <div className="w-full md:w-1/2">
              <span className="text-[0.75rem] font-bold uppercase tracking-widest text-primary mb-3 block">
                Contact
              </span>
              <h2 className="max-sm:text-xl sm:text-2xl md:text-3xl font-bold mb-6">
                Prenez contact avec nous
              </h2>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                Vous avez des questions sur nos services, nos ateliers ou
                souhaitez vous renseigner sur les inscriptions ? Notre équipe
                est à votre écoute pour vous répondre dans les meilleurs délais.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    📍
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Adresse</h4>
                    <p className="text-gray-600 text-sm">
                      Allée Levillain
                      <br />
                      62200 Boulogne-sur-Mer
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Téléphone</h4>
                    <p className="text-gray-600 text-sm">03 21 91 00 00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">
                      contact@les-fripouilles.fr
                    </p>
                  </div>
                </div>

                {/* Horaires */}
                <div className="mt-10">
                  <h3 className="text-lg font-bold mb-4">
                    Horaires d'ouverture
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium">
                        Lundi, Jeudi, Vendredi
                      </span>
                      <span className="text-gray-500">
                        9h00 - 12h00 / 14h00 - 17h00
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium">Mardi</span>
                      <span className="text-gray-500">
                        9h00 - 12h00 / 14h00 - 18h00
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium">Mercredi</span>
                      <span className="text-gray-500">9h00 - 12h00</span>
                    </div>

                    <p className="text-[11px] text-primary italic mt-3">
                      * Ateliers du jeudi réservés aux Assistantes Maternelles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="w-full md:w-1/2 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Téléphone"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre message..."
                  ></textarea>
                </div>

                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      J'accepte que mes données soient utilisées pour me
                      recontacter.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition cursor-pointer flex items-center justify-center"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
