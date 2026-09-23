import type { Metadata } from "next";

import { site } from "@/content/site";

type ShareImage = { url: string; width: number; height: number; type: string; alt: string };

/**
 * Общая картинка превью из app/og.png/route.tsx. Отдельный маршрут с
 * расширением, а не opengraph-image: в статическом экспорте тот ложился
 * файлом без расширения, и хостинг отдавал его без типа image/png.
 */
export const shareImage: ShareImage = {
  url: "/og.png",
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
  image = shareImage,
}: {
  title: string;
  description: string;
  path: string;
  /** Своя картинка превью — например, обложка кейса. */
  image?: ShareImage;
}): Metadata {
  const fullTitle = `${title} — ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...openGraphBase, images: [image], title: fullTitle, description, url: path },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}
