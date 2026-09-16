import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { Marquee } from "@/components/ui/Marquee";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { about } from "@/content/about";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = projects.slice(0, 3);

  return (
    <>
      <section className="container-x flex min-h-[100svh] flex-col justify-between pb-12 pt-[calc(var(--header-h)+8vh)]">
        <div>
          <SplitReveal as="p" className="label mb-10" type="words" immediate stagger={0.05}>
            {site.tagline} · {site.city}
          </SplitReveal>

          <h1 className="font-display text-hero leading-[0.85]">
            <SplitReveal as="span" className="block" immediate>
              Цифровые
            </SplitReveal>
            <SplitReveal as="span" className="block" immediate delay={0.08}>
              <span className="accent-fill">продукты</span>
            </SplitReveal>
            <SplitReveal as="span" className="block" immediate delay={0.16}>
              под задачу
            </SplitReveal>
          </h1>
        </div>

        <div className="mt-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SplitReveal
            as="p"
            className="max-w-[44ch] text-lead leading-snug text-muted"
            delay={0.25}
            immediate
          >
            {site.intro}
          </SplitReveal>

          <Reveal delay={0.4} immediate>
            <MagneticLink>
              <TransitionLink
                href="/projects"
                className="link-mask inline-flex items-center gap-3 text-h3"
              >
                Смотреть проекты
                <span aria-hidden="true">↓</span>
              </TransitionLink>
            </MagneticLink>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-24 md:py-36" aria-labelledby="manifesto">
        <span className="label">Манифест</span>
        <SplitReveal
          as="h2"
          id="manifesto"
          className="mt-8 max-w-[22ch] text-h2 leading-[0.95]"
        >
          Мы делаем сайты, которые решают задачу, а не просто красиво выглядят.
        </SplitReveal>

        <Reveal className="mt-14 grid gap-10 md:grid-cols-3" stagger={0.12}>
          {about.principles.slice(0, 3).map((principle) => (
            <div key={principle.index} className="border-t border-line pt-5">
              <span className="label">{principle.index}</span>
              <h3 className="mt-3 text-h3">{principle.title}</h3>
              <p className="mt-3 text-muted">{principle.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="border-y border-line py-8">
        <Marquee items={about.stack} />
      </section>

      <section className="container-x py-24 md:py-36" aria-labelledby="featured">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitReveal as="h2" id="featured" className="text-h2">
            Избранные проекты
          </SplitReveal>
          <TransitionLink href="/projects" className="link-mask text-muted">
            Все проекты ({projects.length})
          </TransitionLink>
        </div>

        <div className="mt-14 grid gap-14 md:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal
              key={project.slug}
              className={index === 2 ? "md:col-span-2" : undefined}
              delay={index === 1 ? 0.1 : 0}
            >
              <ProjectCard
                project={project}
                index={index}
                priority={index === 0}
                sizes={
                  index === 2
                    ? "(max-width: 768px) 100vw, 90vw"
                    : "(max-width: 768px) 100vw, 45vw"
                }
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x pb-24 md:pb-36" aria-labelledby="home-services">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitReveal as="h2" id="home-services" className="text-h2">
            Чем помогаем
          </SplitReveal>
          <TransitionLink href="/services" className="link-mask text-muted">
            Услуги и пакеты
          </TransitionLink>
        </div>

        <Reveal className="mt-12 border-t border-line" stagger={0.08}>
          {services.map((service) => (
            <TransitionLink
              key={service.id}
              href="/services"
              className="group flex flex-col gap-2 border-b border-line py-7 md:flex-row md:items-center md:justify-between"
            >
              <span className="font-display text-h3 transition-transform duration-500 ease-[var(--ease-out-expo)] md:group-hover:translate-x-3">
                {service.title}
              </span>
              <span className="max-w-[40ch] text-muted">{service.summary}</span>
              <span className="label shrink-0">{service.duration}</span>
            </TransitionLink>
          ))}
        </Reveal>
      </section>
    </>
  );
}
