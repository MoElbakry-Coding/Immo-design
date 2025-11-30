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
      style={{
        transition: `all ${transitionDuration}ms ease`,
      }}
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
      ></div>
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
      {/* ===== Hero Section ===== */}
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden snap-start">
      <video
        className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105"
        src="/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-4xl px-6 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Über Uns
          </h1>
          <blockquote className="text-lg md:text-2xl italic font-light leading-relaxed drop-shadow-md text-center mb-6">
            „Innovation entsteht, wenn man Dinge anders denkt und den Mut hat,
            sie umzusetzen.“
            <footer className="mt-4 text-base md:text-xl not-italic font-semibold opacity-80">
              – Brehm, Alexander & Vahs, Dietmar, Innovationsmanagement, 2015
            </footer>
          </blockquote>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* ===== Person Section ===== */}
      <section className="min-h-screen flex flex-col md:grid md:grid-cols-2 items-center justify-center bg-white snap-start overflow-hidden">
        {/* Left: Image */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInLeft}
          className="relative w-full h-[500px] md:h-full flex items-center justify-center bg-white p-4"
        >
          <GlareHover glareColor="#ffffff" glareOpacity={0.35}>
            <Image
              src="/Dani.png"
              alt="Daniel BETROS"
              fill
              className="object-contain"
              style={{ pointerEvents: "none" }}
            />
          </GlareHover>
        </motion.div>

        {/* Right: Bio */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInRight}
          className="flex items-center justify-center p-8 md:p-16 bg-white"
        >
          <div className="max-w-lg space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Daniel BETROS
            </h2>
            <p className="text-sm uppercase tracking-wide text-gray-900">
              Inhaber
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Herzlich willkommen bei ImmoDesign e.U.! Mein Name ist Daniel Betros und ich vermittle seit mehr als 10Jahren Immobilien im Auftrag meiner Kunden. <br />
              <br />
              Von Anfang an und bis heute bin ich stets sehr interessiert an neuen Wegen und Ideen um Immobilien noch wirkungsvoller zu präsentieren und erfolgreicher zu vermarkten gewesen. Im Laufe der Jahre habe ich den Einsatz von Home Staging, Drohnenaufnahmen, 3D-Visualisierungen, virtuellem Staging und vielen weiteren Methoden auf die Anforderungen des Immobilienvertriebs optimiert. Heute freue ich mich, diese Fähigkeiten an meine Kundinnen und Kunden weiterzugeben.
              <br />
              <br />
              Jede Immobilie und jede Verkaufssituation ist einzigartig – deshalb ist Zuhören die wichtigste aller Fähigkeiten; In einem persönlichen Gespräch finden wir gemeinsam das richtige Konzept für Ihre Immobilie und Ihre Bedürfnisse.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ===== Contact Section ===== */}
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
            Bereit, Ihre Immobilienreise zu starten? Kontaktieren Sie uns noch
            heute!
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
