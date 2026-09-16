import type { NextConfig } from "next";

/**
 * Сборка под GitHub Pages включается только переменной GITHUB_PAGES=true
 * (её выставляет workflow). Обычные `next dev` и `next build` при этом
 * работают ровно как раньше — под будущий свой домен и сервер.
 */
const isPages = process.env.GITHUB_PAGES === "true";
// Проект публикуется по пути /<repo>, поэтому нужен префикс. Для своего
// домена переменную не задают — и префикс исчезает.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  images: {
    // Плейсхолдеры лежат локально в SVG. Внешние источники не используются.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // На Pages нет сервера оптимизации картинок. Свой загрузчик вместо
    // unoptimized: он ещё и подставляет basePath, чего next/image
    // с unoptimized не делает — иначе картинки отдавали бы 404.
    ...(isPages ? { loader: "custom" as const, loaderFile: "./image-loader.ts" } : {}),
  },
  ...(isPages
    ? {
        output: "export" as const,
        // Каждый маршрут становится папкой с index.html: статика отдаётся
        // одинаково и на Pages, и на любом другом хостинге без правил.
        trailingSlash: true,
        basePath,
        assetPrefix: basePath || undefined,
      }
    : {}),
};

export default nextConfig;
