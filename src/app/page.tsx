import type { Metadata } from "next";

import { Poster } from "@/components/ui/Poster";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <Poster
      size="hero"
      label={`${site.tagline} · ${site.city}`}
      caps="Noreliq"
      note="цифровые продукты и сервисы с ИИ"
      lead={site.intro}
      cta={{ href: "/projects", label: "Смотреть работы" }}
    />
  );
}
