import type { Metadata } from "next";

import { Poster } from "@/components/ui/Poster";
import { about } from "@/content/about";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "О нас",
  description: about.lead,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Poster
      label="01 / О нас"
      caps="Студия для сайтов"
      note="AI-контента и автоматизации"
      lead={about.lead}
      cta={{ href: "/contacts", label: "Обсудить проект" }}
    />
  );
}
