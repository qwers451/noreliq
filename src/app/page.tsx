import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Marquee } from "@/components/ui/Marquee";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { about } from "@/content/about";
import { featuredProjects, projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = featuredProjects;

  return (
    <>
      <section className="container-x flex min-h-[100svh] flex-col justify-between pb-12 pt-[calc(var(--header-h)+8vh)]">
        <div>
          <Reveal as="p" className="label mb-10" immediate>
            {site.tagline} · {site.city}
          </Reveal>

          <h1 className="isolate font-display text-hero leading-[0.92]">
            <Reveal as="span" className="block" immediate>
              Цифровые
            </Reveal>
            <Reveal as="span" className="block" immediate delay={0.08}>
              <span className="accent-fill">продукты</span>
            </Reveal>
            <Reveal as="span" className="block" immediate delay={0.16}>
              под задачу
            </Reveal>
          </h1>
        </div>

        <div className="mt-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal
            as="p"
            className="max-w-[44ch] text-lead leading-snug text-muted"
            delay={0.25}
            immediate
          >
            {site.intro}
          </Reveal>

          <Reveal delay={0.4} immediate>
            <TransitionLink
              href="/projects"
              className="link-mask inline-flex items-center gap-3 text-h3"
            >
              Смотреть проекты
              <span aria-hidden="true">↓</span>
            </TransitionLink>
          </Reveal>
        </div>
      </section>

      <section className="container-x section" aria-labelledby="manifesto">
        <Reveal as="span" className="label block">
          Манифест
        </Reveal>
        <Reveal
          as="h2"
          id="manifesto"
          className="mt-6 max-w-[22ch] text-h2 leading-[0.95]"
        >
          Мы делаем сайты, которые решают задачу, а не просто красиво выглядят.
        </Reveal>
      </section>

      <section className="mb-[var(--section-y)] border-y border-line py-8">
        <Marquee items={about.stack} />
      </section>

      <section className="container-x" aria-labelledby="featured">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" id="featured" className="text-h2">
            Избранные проекты
          </Reveal>
          <Reveal y={20}>
            <TransitionLink href="/projects" className="link-mask text-muted">
              Все проекты ({projects.length})
            </TransitionLink>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal
              key={project.slug}
              className={index === 0 ? "md:col-span-2" : undefined}
              delay={index === 2 ? 0.1 : 0}
            >
              <ProjectCard
                project={project}
                index={index}
                priority={index === 0}
                wide={index === 0}
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 90vw"
                    : "(max-width: 768px) 100vw, 45vw"
                }
              />
            </Reveal>
          ))}
        </div>
      </section>

    </>
  );
}
