import type { Metadata } from "next";
import "./globals.css";
import NavbarHero from "../components/NavbarHero";
import Footer from "../components/footer";
import BackToTop from "../components/BackToTop";

export const metadata: Metadata = {
  title: "Immo Design Austria - Immo-design.at",
  description:
    "Discover luxury real estate with IDesign Immobilien. Exclusive properties, tailored investments, and visionary concepts with style. | Entdecken Sie exklusive Immobilien mit IDesign Immobilien. Luxusobjekte, maßgeschneiderte Investments und visionäre Konzepte mit Stil.",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" dir="ltr">
      <body className="flex flex-col min-h-screen relative">
        <NavbarHero />

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />

        {/* BackToTop button */}
        <BackToTop />
      </body>
    </html>
  );
}
