import type { MetadataRoute } from "next";

import { nav } from "@/content/nav";
import { projects } from "@/content/projects";
import { pageUrl } from "@/lib/url";

// Статический экспорт требует явной пометки для метаданных-маршрутов.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: pageUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    ...nav.map((item) => ({
      url: pageUrl(item.href),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: pageUrl(`/projects/${project.slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
