import { Fraunces, Outfit } from "next/font/google";
import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { Grain } from "@/components/layout/Grain";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { VeinProgress } from "@/components/layout/VeinProgress";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HemoLink — Vous avez déjà tout ce qu’il faut",
  description:
    "Landing page informative sur le don de sang : éligibilité, centres, déroulement et idées reçues. Sans compte, sans transaction.",
  metadataBase: new URL("https://hemolink.vercel.app"),
  openGraph: {
    title: "HemoLink — Le don de sang, enfin expliqué",
    description:
      "Vérifiez votre éligibilité, trouvez un centre, comprenez les 45 minutes. Sans culpabilité.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <SkipLink />
        <AppProviders>
          <Grain />
          <VeinProgress />
          <Header />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
