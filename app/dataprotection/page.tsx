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
            Datenschutz
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
            <p><strong>Datenschutzerklärung</strong></p>
            <p>
              Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSG 2018, DSGVO, TKG 2003). In diesen Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.
            </p>

            <p><u>1. Verantwortlicher</u></p>
            <p>
              DB ImmoDesign e.U.<br />
              Inhaber: Daniel Betros<br />
              Laaweg 30<br />
              8401 Kalsdorf bei Graz<br />
              E-Mail: office@immo-design.at<br />
              Web: immo-design.at
            </p>

            <p><u>2. Zweck der Datenverarbeitung</u></p>
            <p>
              Wir verarbeiten personenbezogene Daten, um Anfragen zu bearbeiten,
              Beratungen & Besichtigungen durchzuführen, die Website sicher zu
              betreiben usw.
            </p>

            <p><u>3. Verarbeitete Daten</u></p>
            <p>
              Kontaktdaten, technische Daten (IP-Adresse, Cookies) usw.
            </p>

            <p><u>4. Empfänger</u></p>
            <p>
              IT-Dienstleister & Auftragsverarbeiter, keine Weitergabe ohne Anlass.
            </p>

            <p><u>5. Speicherdauer</u></p>
            <p>
              Speicherung nur solange wie notwendig oder gesetzlich vorgeschrieben.
            </p>

            <p><u>6. Cookies</u></p>
            <p>
              Nur technisch notwendige Cookies + optionale Cookies per Einwilligung.
            </p>

            <p><u>7. Ihre Rechte</u></p>
            <p>
              Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit,
              Widerspruch, Widerruf.
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
