import type { Metadata } from "next";

import { Poster } from "@/components/ui/Poster";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "О нас",
  description: about.lead,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Poster
      label="01 / О нас"
      caps="Небольшая студия"
      italic="с длинными отношениями"
      lead={about.lead}
      cta={{ href: "/contacts", label: "Обсудить проект" }}
    />
  );
}
