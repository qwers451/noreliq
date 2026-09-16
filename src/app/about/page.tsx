import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Marquee } from "@/components/ui/Marquee";
import { PageHero } from "@/components/ui/PageHero";
import { about } from "@/content/about";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "О нас",
  description: about.lead,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero label="01 / О нас" title="Небольшая студия с длинными отношениями" lead={about.lead} />

      <section className="container-x pb-24 md:pb-32" aria-labelledby="about-text">
        <h2 id="about-text" className="sr-only">
          О студии
        </h2>
        <div className="grid gap-10 md:grid-cols-2">
          {about.body.map((paragraph) => (
            <SplitReveal key={paragraph} as="p" className="text-lead leading-snug">
              {paragraph}
            </SplitReveal>
          ))}
        </div>

        <Reveal className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.1}>
          {about.stats.map((stat) => (
            <div key={stat.label} className="border-t border-line pt-4">
              <span className="block font-display text-h2 leading-none">
                {stat.value}
              </span>
              <span className="label mt-3 block">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="container-x pb-24 md:pb-32" aria-labelledby="principles">
        <SplitReveal as="h2" id="principles" className="text-h2">
          Принципы
        </SplitReveal>

        <Reveal className="mt-12 border-t border-line" stagger={0.1}>
          {about.principles.map((principle) => (
            <details key={principle.index} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center gap-6 py-7">
                <span className="label shrink-0">{principle.index}</span>
                <span className="font-display text-h3">{principle.title}</span>
                <span
                  aria-hidden="true"
                  className="ml-auto text-2xl transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[60ch] pb-7 pl-[calc(2rem+1.5rem)] text-muted">
                {principle.description}
              </p>
            </details>
          ))}
        </Reveal>
      </section>

      <section className="border-y border-line py-8" aria-labelledby="stack">
        <h2 id="stack" className="sr-only">
          Технологии
        </h2>
        <Marquee items={about.stack} duration={34} />
      </section>

      <section className="container-x py-24 md:py-32" aria-labelledby="team">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitReveal as="h2" id="team" className="text-h2">
            Команда
          </SplitReveal>
          <p className="label">
            {site.city} · {site.timezone}
          </p>
        </div>

        <Reveal className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.08}>
          {about.team.map((member, index) => (
            <figure key={`${member.role}-${index}`}>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-alt">
                <Image
                  src={member.photo}
                  alt={`${member.name} — ${member.role}`}
                  fill
                  sizes="(max-width: 768px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <span className="block font-display text-h3">{member.name}</span>
                <span className="label mt-1 block">{member.role}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>
    </>
  );
}
