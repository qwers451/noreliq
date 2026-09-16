import type { MetadataRoute } from "next";

import { site } from "@/content/site";

// Статический экспорт требует явной пометки для метаданных-маршрутов.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Демо-стенд на GitHub Pages закрываем от индексации, чтобы он не
  // конкурировал в выдаче с будущим основным доменом.
  const isDemo = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

  return {
    rules: isDemo
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
