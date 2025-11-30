"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NavbarHero() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHomePage = pathname === "/";

  // ---- NEW FOR AUTO HEIGHT ----
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardHeight, setCardHeight] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const calculateHeights = () => {
      const heights = cardRefs.current
        .filter((el) => el !== null)
        .map((el) => el!.offsetHeight);

      if (heights.length > 0) {
        setCardHeight(Math.max(...heights));
      }
    };

    setTimeout(calculateHeights, 60);
    window.addEventListener("resize", calculateHeights);

    return () => window.removeEventListener("resize", calculateHeights);
  }, []);
  // ---- END NEW ----

  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    // Always scroll to top when landing on home
    useEffect(() => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);
  // Video autoplay
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Nika und Marko Cipot",
      comment:
        "Wir waren relativ neu in Graz und wollten unsere erste Wohnung kaufen. Daniel hat uns von Beginn an bis zur Übergabe - und danach super unterstütz und alle unsere Fragen beatwortet.",
      position: "",
      avatar: "/Nika&Marko_Cipot.jpeg",
      rating: 5,
    },
    {
      id: 2,
      name: "Elvira und Kemal Alikovic",
      comment:
        "2019 wollten wir unser Haus verkaufen und haben Daniel kennengelerntin - inzwischen haben wir schon die dritte Immobilie mit seiner Hilfe veräußert, Danke!!",
      position: "",
      avatar: "/Elvira&Kemal_Alikovic.jpeg",
      rating: 4,
    },
    {
      id: 3,
      name: "Peter Pache",
      comment:
        "Daniel verstand schon beim ersten Treffen das es sich um ein Liebhaberobjekt handelt und hat mir mit viel Geduld dabei geholfen meinen Wunschpreis zu erzielen, ich bin sehr dankbar dafür.",
      position: "",
      avatar: "/Peter_Pache.jpeg",
      rating: 5,
    },
  ];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 4000);
  };

  // ---- LOGO SCROLL FIX ----
  const handleLogoClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // -------------------------

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, []);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
    stopAuto();
  };

  const handleTouchEnd = (e: any) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0
        ? setIndex((i) => (i + 1) % testimonials.length)
        : setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
    }
    touchStartX.current = null;
    startAuto();
  };

  const navLinks = [
    { name: "Immobilien", href: "/realestate" },
    { name: "Partnerschaften", href: "/partnerships" },
    { name: "Über Uns", href: "/about" },
    { name: "Leistungen", href: "/services" },
    { name: "Kontakt", href: "/contact" },
  ];

  return (
    <header className="relative">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${
          isHomePage
            ? scrolled
              ? "bg-gray-100 shadow-md"
              : "bg-transparent"
            : "bg-gray-100 shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" scroll={false} onClick={handleLogoClick}>
            <div className="relative w-28 sm:w-80 md:w-80 h-42 sm:h-33.5 md:h-42">
              <Image
                src="/logo.png"
                alt="iDesign Immobilien"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 lg:space-x-10 text-base lg:text-lg font-semibold">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.name} className="relative group">
                  <Link
                    href={l.href}
                    className={`transition-colors duration-300 ${
                      active
                        ? "text-blue-600"
                        : scrolled || !isHomePage
                        ? "text-gray-800 hover:text-blue-600"
                        : "text-white hover:text-blue-300"
                    }`}
                  >
                    {l.name}
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-blue-500 transition-all duration-300
                        ${active ? "w-full" : "w-0 group-hover:w-full"}
                      `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              className="focus:outline-none text-gray-300"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-10 text-white">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-gray-300 hover:text-white transition-colors duration-300"
          >
            <X size={32} />
          </button>

          <ul className="flex flex-col items-center space-y-8">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`text-3xl font-semibold tracking-wide transition-all duration-300 ${
                      active
                        ? "text-blue-400 scale-105"
                        : "hover:text-blue-400 hover:scale-105 text-gray-100"
                    }`}
                  >
                    {l.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* HERO SECTION */}
      {isHomePage && (
        <section className="relative w-full min-h-screen overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover grayscale"
            src="/hero-video.mp4"
            playsInline
            autoPlay
            loop
            muted
            preload="auto"
            poster="/hero-poster.jpg"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          <div className="relative z-20 flex flex-col w-full justify-start items-center pt-28">
            {/* GLASS CARD */}
            <div className="flex flex-col items-center text-center justify-center bg-white/10 border border-white/20 shadow-2xl max-w-8xl w-[90%] mx-auto p-2 sm:p-10 rounded-none">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 text-shadow-immo">
                DB ImmoDesign
              </h1>

              <h2 className="text-lg sm:text-2xl font-semibold text-blue-200 mb-4 text-shadow-immo">
                Innovatives Immobilienmarketing
              </h2>

              <p className="text-sm sm:text-lg text-white/90 mb-5 text-glow-immo">
                Wir machen Ihre Immobilie erlebbar– mit Home Staging,
                professioneller Fotografie, Drohnenaufnahmen und mehr.
              </p>

              <Link
                href="/services"
                className="mt-2 px-8 py-3 border border-white text-white rounded-full tracking-widest text-sm sm:text-base hover:bg-white hover:text-black transition"
              >
                Mehr erfahren
              </Link>

              {/* TESTIMONIALS */}
              <div
                className="w-full flex flex-col justify-center pb-3 pt-3 min-h-[50vh]"
                onMouseEnter={stopAuto}
                onMouseLeave={startAuto}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="max-w-6xl mx-auto px-4 text-center">
                  <p className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3 text-shadow-immo">
                    Was unsere Kunden sagen
                  </p>

                  {/* MOBILE CAROUSEL */}
                  <div className="relative md:hidden min-h-[30vh] flex items-center justify-center pb-20">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={testimonials[index].id}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.6 }}
                        className="w-full flex items-center justify-center"
                      >
                      <div
                        ref={(el) => {
                          cardRefs.current[index] = el;
                        }}
                        style={{
                          height: cardHeight ? `${cardHeight}px` : "auto",
                        }}
                        className="bg-gray-800 border border-gray-200 rounded-2xl shadow-lg w-[90%] p-4 sm:p-6 text-left flex flex-col justify-between"
                      >
                          <div className="flex items-center gap-4 mb-3">
                            <Image
                              src={testimonials[index].avatar}
                              alt={testimonials[index].name}
                              width={56}
                              height={56}
                              className="!w-[56px] !h-[56px] rounded-full object-cover border border-gray-200"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-white text-base sm:text-lg">
                                {testimonials[index].name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {testimonials[index].position}
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-yellow-400 text-sm ${
                                      i < testimonials[index].rating
                                        ? "opacity-100"
                                        : "opacity-30"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <p className="text-white italic text-sm sm:text-base leading-relaxed">
                            “{testimonials[index].comment}”
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* DESKTOP GRID */}
                  <div className="hidden md:grid md:grid-cols-3 gap-6 pt-6">
                    {testimonials.map((t, i) => (
                      <div
                        key={t.id}
                        className="bg-gray-800 border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 text-left max-w-3x1"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            width={56}
                            height={56}
                            className="!w-[56px] !h-[56px] rounded-full object-cover border border-gray-200"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-white text-base sm:text-lg">
                              {t.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {t.position}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i2) => (
                                <span
                                  key={i2}
                                  className={`text-yellow-400 text-sm ${
                                    i2 < t.rating
                                      ? "opacity-100"
                                      : "opacity-30"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-white italic text-sm sm:text-base leading-relaxed">
                          “{t.comment}”
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </header>
  );
}
