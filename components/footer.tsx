"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
<footer className="snap-start relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-300 border-t border-white/10 overflow-hidden">

  {/* Decorative gradient line */}
  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 opacity-70" />

  {/* Main Content */}
  <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
    {/* Logo + Tagline */}
    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
      <Link href="/" className="hover:opacity-90 transition">
        <Image
          src="/logo.png"
          alt="IDesign Immobilien"
          width={160}
          height={50}
          className="object-contain opacity-95"
          priority
        />
      </Link>
    
    </div>

    {/* Navigation */}
    <nav className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-medium text-gray-400">
      <Link href="/realestate" className="hover:text-white transition-colors">Immobilien</Link>
      <Link href="/partnerships" className="hover:text-white transition-colors">Partnerschaften</Link>
      <Link href="/services" className="hover:text-white transition-colors">Leistungen</Link>
      <Link href="/about" className="hover:text-white transition-colors">Über Uns</Link>
      <Link href="/contact" className="hover:text-white transition-colors">Kontakt</Link>
      <Link href="/imprint" className="hover:text-white transition-colors">Impressum</Link>
      <Link href="/dataprotection" className="hover:text-white transition-colors">Datenschutz</Link>
    </nav>

    {/* Contact / Social */}
    <div className="flex flex-col items-center md:items-end space-y-4">
      <div className="flex space-x-4">
        <Link
          href="#"
          className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={18} />
        </Link>
        <Link
          href="#"
          className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={18} />
        </Link>
        <Link
          href="#"
          className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} />
        </Link>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="relative z-10 text-center py-5 text-xs text-gray-500 border-t border-white/10">
    © {new Date().getFullYear()}{" "}
    <span className="text-gray-300 font-semibold">IDesign Immobilien</span>.
    &nbsp;Alle Rechte vorbehalten.
  </div>
</footer>

  );
}
