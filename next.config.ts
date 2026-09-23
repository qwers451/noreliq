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
  env: {
    // Клиентскому коду нужно знать, что сборка статическая: на ней префетч
    // запрашивает RSC-файлы, которых в экспорте нет, и сыплет 404.
    STATIC_EXPORT: isPages ? "true" : "",
  },
  images: {
    // Свой загрузчик вместо оптимизатора — и в разработке тоже. На статике
    // оптимизатора нет вовсе, так что иначе локально видишь одну картинку,
    // а на сайте другую. Варианты нарезаны заранее скриптом.
    loader: "custom",
    loaderFile: "./image-loader.ts",
    // Ровно те ширины, которые нарезает scripts/responsive-images.mjs:
    // srcset тогда состоит только из реально существующих файлов.
    deviceSizes: [480, 960, 1440, 2000],
    imageSizes: [],
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
