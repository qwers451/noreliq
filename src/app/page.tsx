import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Marquee } from "@/components/ui/Marquee";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { about } from "@/content/about";
import { featuredProjects, projects } from "@/content/projects";
import { services } from "@/content/services";
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
          className="mt-8 max-w-[22ch] text-h2 leading-[0.95]"
        >
          Мы делаем сайты, которые решают задачу, а не просто красиво выглядят.
        </Reveal>

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

      <section className="mb-[var(--section-y)] border-y border-line py-8">
        <Marquee items={about.stack} />
      </section>

      <section className="container-x section-b" aria-labelledby="featured">
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

        <div className="mt-14 grid gap-x-10 gap-y-20 md:grid-cols-2">
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

      <section className="container-x" aria-labelledby="home-services">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" id="home-services" className="text-h2">
            Чем помогаем
          </Reveal>
          <Reveal y={20}>
            <TransitionLink href="/services" className="link-mask text-muted">
              Услуги и пакеты
            </TransitionLink>
          </Reveal>
        </div>

        <Reveal className="mt-12 border-t border-line" stagger={0.08}>
          {services.map((service) => (
            <TransitionLink
              key={service.id}
              href="/services"
              className="group grid gap-2 border-b border-line py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_9rem] md:items-baseline md:gap-8"
            >
              <span className="font-display text-h3">{service.title}</span>
              <span className="text-muted">{service.summary}</span>
              <span className="label md:text-right">{service.code}</span>
            </TransitionLink>
          ))}
        </Reveal>
      </section>
    </>
  );
}
