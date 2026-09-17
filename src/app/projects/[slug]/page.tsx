import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
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
      <section className="container-x section-b-tight pt-[calc(var(--header-h)+6vh)] md:pt-[calc(var(--header-h)+10vh)]">
        <Reveal as="p" className="label mb-8" immediate>
          {project.tags.join(" · ")}
        </Reveal>

        <Reveal
          as="h1"
          className="font-display text-display leading-[0.9]"
          immediate
        >
          {project.title}
        </Reveal>

        <Reveal
          as="p"
          className="mt-10 max-w-[52ch] text-lead leading-snug text-muted"
          delay={0.15}
          immediate
        >
          {project.summary}
        </Reveal>
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

      <section className="container-x section" aria-labelledby="project-meta">
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

      <div className="container-x section-b flex flex-col gap-16 md:gap-24">
        {project.blocks.map((block, index) => {
          if (block.type === "text") {
            return (
              <section key={index} className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
                {block.title ? (
                  <Reveal as="h2" className="font-display text-h3">
                    {block.title}
                  </Reveal>
                ) : (
                  <span aria-hidden="true" />
                )}
                <Reveal as="p" className="max-w-[62ch] text-lead leading-snug">
                  {block.body}
                </Reveal>
              </section>
            );
          }

          if (block.type === "image") {
            return (
              <Reveal key={index} as="figure" className={block.wide || block.contain ? "" : "md:w-2/3"}>
                <ParallaxImage
                  src={block.src}
                  alt={block.alt}
                  sizes={block.wide || block.contain ? "100vw" : "(max-width: 768px) 100vw, 65vw"}
                  className={
                    block.contain
                      ? "aspect-[8/5] w-full"
                      : block.wide
                        ? "aspect-[16/9] w-full"
                        : "aspect-[4/5] w-full"
                  }
                  fit={block.contain ? "contain" : "cover"}
                  amount={block.contain ? 6 : 12}
                />
                <figcaption className="label mt-4">{block.alt}</figcaption>
              </Reveal>
            );
          }

          if (block.type === "screens") {
            return (
              <Reveal
                key={index}
                as="ul"
                className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 md:gap-x-8"
                stagger={0.08}
              >
                {block.items.map((item) => (
                  <li key={item.src}>
                    {/* Экран показываем целиком: кадрировать телефон нечем,
                        все файлы приведены к одной высоте при подготовке. */}
                    <Image
                      src={item.src}
                      alt={item.caption}
                      width={786}
                      height={1704}
                      sizes="(max-width: 768px) 45vw, 30vw"
                      className="w-full rounded-[1.5rem] border border-line md:rounded-[2rem]"
                    />
                    <p className="label mt-4">{item.caption}</p>
                  </li>
                ))}
              </Reveal>
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
                  <dd className="mt-3">
                    <Counter value={item.value} className="font-display text-h2 leading-none" />
                  </dd>
                </div>
              ))}
            </Reveal>
          );
        })}
      </div>

      <section className="container-x section border-t border-line" aria-labelledby="next-project">
        <span className="label">Следующий проект</span>
        <h2 id="next-project" className="mt-4">
          <TransitionLink
            href={`/projects/${next.slug}`}
            className="link-mask font-display text-display leading-[1.02]"
          >
            {next.title}
          </TransitionLink>
        </h2>
      </section>
    </>
  );
}
