import type { Metadata } from "next";
import "./globals.css";
import NavbarHero from "../components/NavbarHero";
import Footer from "../components/footer";
import BackToTop from "../components/BackToTop";

export const metadata: Metadata = {
  title: "Innovative Immobilienvermittlung - Immo-design.at",
  description:
    " Wir machen Ihre Immobilie erlebbar– mit Home Staging, professioneller Fotografie, Drohnenaufnahmen und vielem mehr zur optimalen Vermarktung.",
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
