import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";

import "./globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/motion/Cursor";
import { Grain } from "@/components/motion/Grain";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/content/site";

// Геометрический гротеск — ближе всего к начертанию логотипа.
const display = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display-src",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: ["веб-студия", "разработка сайтов", "дизайн интерфейсов", "Next.js", site.name],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f3f4f2",
  colorScheme: "light",
};

/**
 * Ставит .motion-ok до первой отрисовки, если пользователь не просил
 * уменьшить движение. Все «спрятанные до анимации» состояния в CSS
 * висят на этом классе, поэтому при reduced-motion контент виден сразу.
 */
const MOTION_FLAG_SCRIPT = `try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ok')}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: скрипт ниже дописывает класс motion-ok
    // на <html> до гидрации, и React иначе ругается на расхождение атрибутов.
    <html
      lang="ru"
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG_SCRIPT }} />
      </head>
      <body id="top">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-fg focus:px-4 focus:py-2 focus:text-inverse"
        >
          Перейти к содержимому
        </a>

        <SmoothScroll>
          <PageTransition>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </PageTransition>
        </SmoothScroll>

        <Cursor />
        <Grain />
      </body>
    </html>
  );
}
