import type { MetadataRoute } from "next";

import { nav } from "@/content/nav";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

// Статический экспорт требует явной пометки для метаданных-маршрутов.
export const dynamic = "force-static";

// На статике страницы отдаются со слэшем на конце, а без него хостинг
// отвечает редиректом — поисковики считают такие адреса в карте ошибкой.
const slash = process.env.STATIC_EXPORT ? "/" : "";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    ...nav.map((item) => ({
      url: `${site.url}${item.href}${slash}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.slug}${slash}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
