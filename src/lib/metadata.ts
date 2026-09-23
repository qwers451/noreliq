import type { Metadata } from "next";

import { site } from "@/content/site";

/**
 * Картинка из app/opengraph-image.tsx. Файловая картинка действует только в
 * своём сегменте: страница со своим openGraph без явной ссылки её теряет.
 */
const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${site.name} — ${site.tagline}`,
};

export const openGraphBase = {
  type: "website" as const,
  locale: "ru_RU",
  siteName: site.name,
  images: [shareImage],
};

/**
 * Метаданные страницы вместе с превью для соцсетей. Next сливает метаданные
 * поверхностно: страница без своего openGraph целиком наследует превью
 * главной, и ссылка на любой кейс в мессенджере выглядела как ссылка на главную.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} — ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...openGraphBase, title: fullTitle, description, url: path },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [shareImage] },
  };
}
