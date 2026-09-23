import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, JetBrains_Mono, Manrope } from "next/font/google";

import "./globals.css";

import { Header } from "@/components/layout/Header";
import { ThemeField } from "@/components/layout/ThemeField";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/motion/Cursor";
import { Grain } from "@/components/motion/Grain";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { openGraphBase, shareImage } from "@/lib/metadata";
import { organizationSchema } from "@/lib/schema";

// Геометрический гротеск для заголовков — в духе JetBrains Sans.
// Антиква с курсивом ушла: от неё сайт читался как дизайнерское портфолио,
// а не как студия разработки.
const display = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "800"],
  variable: "--font-display-src",
  display: "swap",
});

// Моноширинный для интерфейсных подписей и меты.
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["500"],
  variable: "--font-sans-src",
  display: "swap",
});

// Второй моноширинный — для «кодовых» строк: подзаголовков-комментариев,
// индексов и тегов. Отличается от JetBrains Mono рисунком, поэтому служебное
// и акцентное не сливаются.
const code = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-code-src",
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
    ...openGraphBase,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [shareImage],
  },
  alternates: { canonical: "/" },
  // Пустые коды не выводим: тег без значения Вебмастер считает ошибкой.
  verification: {
    ...(site.verification.yandex ? { yandex: site.verification.yandex } : {}),
    ...(site.verification.google ? { google: site.verification.google } : {}),
  },
};

export const viewport: Viewport = {
  // Цвет поля главной страницы: панель браузера на телефоне сливается
  // с сайтом, а не подсвечивает светлую полосу над тёмной заливкой.
  themeColor: "#241a86",
  colorScheme: "dark",
};

/**
 * Ставит .motion-ok до первой отрисовки, если пользователь не просил
 * уменьшить движение. Все «спрятанные до анимации» состояния в CSS
 * висят на этом классе, поэтому при reduced-motion контент виден сразу.
 *
 * Здесь же — блокировка прокрутки на время CSS-прелоадера (0,6 с счёта
 * + 0,45 с ухода): скрипты страницы к этому моменту могут ещё не загрузиться.
 */
const MOTION_FLAG_SCRIPT = `try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('motion-ok','is-loading');setTimeout(function(){d.classList.remove('is-loading')},1050)}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: скрипт ниже дописывает класс motion-ok
    // на <html> до гидрации, и React иначе ругается на расхождение атрибутов.
    <html
      lang="ru"
      className={`${display.variable} ${mono.variable} ${code.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG_SCRIPT }} />
        <JsonLd data={organizationSchema()} />
      </head>
      <body id="top">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-fg focus:px-4 focus:py-2 focus:text-inverse"
        >
          Перейти к содержимому
        </a>

        <ThemeField />

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
