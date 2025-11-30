"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useState, useRef } from "react";

// ===== GlareHover Component =====
function GlareHover({
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.3,
  transitionDuration = 800,
}: {
  children: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  transitionDuration?: number;
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full overflow-hidden rounded-2xl"
      style={{ transition: `all ${transitionDuration}ms ease` }}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${glareColor}, transparent 60%)`,
          opacity: glareOpacity,
          mixBlendMode: "screen",
          transition: `opacity ${transitionDuration}ms ease`,
        }}
      />
    </div>
  );
}

// ===== Animations =====
const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function UnternehmenFullSplit() {
  return (
    <main className="w-full overflow-x-hidden snap-y snap-mandatory scroll-smooth text-gray-800 font-sans">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden snap-start">
        <video
          className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105"
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl px-6 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Impressum
          </h1>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* ===== PERSON SECTION ===== */}
      <section className="min-h-screen flex items-center justify-center bg-white snap-start overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInRight}
          className="flex items-center justify-center p-8 md:p-16"
        >

          <div className="max-w-lg space-y-6">
            <p><strong>Impressum:</strong></p>
            <p>
              DB Immodesign e.U.
              Inhaber: Daniel Betros
              Adresse: Laaweg 30, 8401 Kalsdorf bei Graz, Österreich
              Telefon: +43 676 418 3782
              E-Mail: office@immo-design.at
              Website: www.immo-design.at
              </p>

            <p>
              Firmenbuchnummer: FN 633491 f
              Firmenbuchgericht: Landesgericht Graz
              Gewerbebehörde: Bezirkshauptmannschaft Graz-Umgebung (BH GU)
              Mitglied der Wirtschaftskammer Steiermark, Fachgruppe Immobilien- und Vermögenstreuhänder
              Berufsbezeichnung: Immobilienmakler (verliehen in Österreich)
              Anwendbare Rechtsvorschriften: Gewerbeordnung (GewO)
              Umsatzsteuerbefreiung: Kleinunternehmer gemäß § 6 Abs. 1 Z 27 UStG (keine UID-Nummer)
            </p>

            <p><u>Haftungsausschluss</u></p>
            <p>
              Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Änderungen und Irrtümer vorbehalten.
              Als Diensteanbieter bin ich gemäß § 7 Abs. 1 ECG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 ECG bin ich jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>

            <p><u>Haftung für Links</u></p>
            <p>
              Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Zum Zeitpunkt der Verlinkung wurden die verlinkten Seiten auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar.
            </p>

            <p><u>Urheberrecht</u></p>
            <p>
              Die durch den Websitebetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>

            <p><u>Online-Streitbeilegung</u></p>
            <p>
              Verbraucher haben die Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform der EU zu richten:
              https://ec.europa.eu/odr
              Sie können allfällige Beschwerden auch an die oben angegebene E-Mail-Adresse richten.
            </p>

                    </div>
        </motion.div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <motion.section
        className="bg-gray-900 py-20 text-white text-center snap-start overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Kontaktieren Sie Uns
          </h2>
          <p className="mb-10 text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Bereit, Ihre Immobilienreise zu starten? Kontaktieren Sie uns noch heute!
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8 font-medium text-lg">
            <p>📞 +43 662 46 69-0</p>
            <p>📍 Salzburg, Austria</p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
