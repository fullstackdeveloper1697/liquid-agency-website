import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GridOverlay } from "@/components/ui/GridOverlay";
import { Starfield } from "@/components/fx/Starfield";
import { Cursor } from "@/components/global/Cursor";
import { ScrollProgress } from "@/components/global/ScrollProgress";
import { SmoothScroll } from "@/components/global/SmoothScroll";
import { PageTransitions } from "@/components/global/PageTransitions";
import { Scramble } from "@/components/global/Scramble";
import { site } from "@/config/site";
// Self-hosted variable fonts (no request to Google at build or run time)
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: `${site.tagline} ${site.claim}`,
};

export const viewport = { themeColor: "#000000" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-dvh text-paper">
        <Starfield />
        {/* Header reads the pathname; Suspense keeps dynamic routes prerenderable */}
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main id="main">{children}</main>
        <Footer />
        <GridOverlay />
        <ScrollProgress />
        <Cursor />
        <SmoothScroll />
        <Suspense fallback={null}>
          <PageTransitions />
          <Scramble />
        </Suspense>
      </body>
    </html>
  );
}
