import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { getNextProject, getProject, projects } from "@/content/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Проект не найден" };

  return {
    title: `${project.title} — ${project.client}`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const next = getNextProject(project.slug);

  return (
    <>
      <section className="container-x pb-12 pt-[calc(var(--header-h)+6vh)] md:pb-16 md:pt-[calc(var(--header-h)+10vh)]">
        <SplitReveal as="p" className="label mb-8" type="words" immediate stagger={0.04}>
          {project.tags.join(" · ")}
        </SplitReveal>

        <SplitReveal
          as="h1"
          className="font-display text-display leading-[0.9]"
          immediate
        >
          {project.title}
        </SplitReveal>

        <SplitReveal
          as="p"
          className="mt-10 max-w-[52ch] text-lead leading-snug text-muted"
          delay={0.15}
          immediate
        >
          {project.summary}
        </SplitReveal>
      </section>

      <section className="container-x" aria-label="Обложка проекта">
        <ParallaxImage
          src={project.cover}
          alt={`Обложка проекта ${project.title}`}
          sizes="100vw"
          priority
          className="aspect-[16/9] w-full"
          amount={16}
        />
      </section>

      <section className="container-x py-16 md:py-24" aria-labelledby="project-meta">
        <h2 id="project-meta" className="sr-only">
          Информация о проекте
        </h2>
        <Reveal className="grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4" stagger={0.08}>
          <div>
            <span className="label block">Клиент</span>
            <span className="mt-2 block">{project.client}</span>
          </div>
          <div>
            <span className="label block">Год</span>
            <span className="mt-2 block">{project.year}</span>
          </div>
          <div>
            <span className="label block">Роль</span>
            <span className="mt-2 block">{project.role}</span>
          </div>
          <div>
            <span className="label block">Теги</span>
            <span className="mt-2 block">{project.tags.join(", ")}</span>
          </div>
        </Reveal>
      </section>

      <div className="container-x flex flex-col gap-16 pb-24 md:gap-24 md:pb-32">
        {project.blocks.map((block, index) => {
          if (block.type === "text") {
            return (
              <section key={index} className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
                {block.title ? (
                  <h2 className="font-display text-h3">{block.title}</h2>
                ) : (
                  <span aria-hidden="true" />
                )}
                <SplitReveal as="p" className="max-w-[62ch] text-lead leading-snug">
                  {block.body}
                </SplitReveal>
              </section>
            );
          }

          if (block.type === "image") {
            return (
              <figure key={index} className={block.wide ? "" : "md:w-2/3"}>
                <ParallaxImage
                  src={block.src}
                  alt={block.alt}
                  sizes={block.wide ? "100vw" : "(max-width: 768px) 100vw, 65vw"}
                  className={block.wide ? "aspect-[16/9] w-full" : "aspect-[4/5] w-full"}
                />
                <figcaption className="label mt-4">{block.alt}</figcaption>
              </figure>
            );
          }

          if (block.type === "quote") {
            return (
              <Reveal key={index} className="md:px-[10%]">
                <figure>
                  <blockquote className="font-display text-h2 leading-[1.05]">
                    «{block.body}»
                  </blockquote>
                  <figcaption className="label mt-6">{block.author}</figcaption>
                </figure>
              </Reveal>
            );
          }

          return (
            <Reveal
              key={index}
              as="dl"
              className="grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-3"
              stagger={0.1}
            >
              {block.items.map((item) => (
                <div key={item.label}>
                  <dt className="label">{item.label}</dt>
                  <dd className="mt-3 font-display text-h2 leading-none">{item.value}</dd>
                </div>
              ))}
            </Reveal>
          );
        })}
      </div>

      <section className="container-x border-t border-line py-16 md:py-24" aria-labelledby="next-project">
        <span className="label">Следующий проект</span>
        <h2 id="next-project" className="mt-4">
          <MagneticLink strength={0.2}>
            <TransitionLink
              href={`/projects/${next.slug}`}
              className="link-mask font-display text-display leading-none"
            >
              {next.title}
            </TransitionLink>
          </MagneticLink>
        </h2>
      </section>
    </>
  );
}
