import type { Metadata } from "next";

import { Counter } from "@/components/motion/Counter";
import { Disclosure } from "@/components/motion/Disclosure";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { PageHero } from "@/components/ui/PageHero";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "О нас",
  description: about.lead,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero label="01 / О нас" title="Студия для сайтов, AI-контента и автоматизации" lead={about.lead} />

      <section className="container-x section-b" aria-labelledby="about-text">
        <h2 id="about-text" className="sr-only">
          О студии
        </h2>
        <div className="grid gap-10 md:grid-cols-2">
          {about.body.map((paragraph) => (
            <Reveal key={paragraph} as="p" className="text-lead leading-snug">
              {paragraph}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.1}>
          {about.stats.map((stat) => (
            <div key={stat.label} className="border-t border-line pt-4">
              <Counter
                value={stat.value}
                className="block font-display text-h2 leading-none"
              />
              <span className="label mt-3 block">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="container-x section-b" aria-labelledby="principles">
        <Reveal as="h2" id="principles" className="text-h2">
          Принципы
        </Reveal>

        <Reveal className="mt-12 border-t border-line" stagger={0.1}>
          {about.principles.map((principle) => (
            <Disclosure
              key={principle.index}
              index={principle.index}
              title={principle.title}
            >
              {principle.description}
            </Disclosure>
          ))}
        </Reveal>
      </section>

      <section className="mb-[var(--section-y)] border-y border-line py-8" aria-labelledby="stack">
        <h2 id="stack" className="sr-only">
          Технологии
        </h2>
        <Marquee items={about.stack} duration={72} />
      </section>
    </>
  );
}
