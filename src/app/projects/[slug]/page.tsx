import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ProjectFrames, type Frame } from "@/components/ui/ProjectFrames";
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

  // Кейс держим коротким: описание сверху, под ним листаемые кадры.
  // Подробности живут в описании проекта, а не в простыне блоков.
  const intro = project.blocks.find((block) => block.type === "text");

  const frames: Frame[] = project.blocks.flatMap((block) => {
    if (block.type === "shots") return block.items;
    if (block.type === "screens") {
      return block.items.map((item) => ({
        src: item.src,
        alt: item.caption,
        width: 786,
        height: 1704,
      }));
    }
    if (block.type === "image" && block.width && block.height) {
      return [{ src: block.src, alt: block.alt, width: block.width, height: block.height }];
    }
    return [];
  });

  return (
    <>
      <section className="container-x pb-10 pt-[calc(var(--header-h)+10vh)] text-center">
        <h1>
          <Reveal as="span" className="display-caps block text-display" immediate>
            {project.title}
          </Reveal>
          <Reveal
            as="span"
            className="display-note mt-4 block text-[length:clamp(0.9375rem,1.7vw,1.375rem)]"
            immediate
            delay={0.08}
          >
            {project.subtitle ?? project.role.toLowerCase()}
          </Reveal>
        </h1>

        <Reveal
          as="p"
          className="mono-label mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 opacity-60"
          immediate
          delay={0.16}
        >
          <span>{project.client}</span>
          <span>{project.year}</span>
          <span>{project.role}</span>
        </Reveal>

        <Reveal as="p" className="poster-lead mt-8" immediate delay={0.24}>
          {intro?.type === "text" ? intro.body : project.summary}
        </Reveal>
      </section>

      {frames.length > 0 ? (
        <Reveal className="py-2">
          <ProjectFrames frames={frames} />
        </Reveal>
      ) : null}

      <section className="container-x section text-center" aria-labelledby="next-project">
        <Reveal as="p" className="mono-label opacity-60">
          Следующий проект
        </Reveal>
        <h2 id="next-project" className="mt-4">
          <TransitionLink
            href={`/projects/${next.slug}`}
            className="link-mask display-caps text-display"
          >
            {next.title}
          </TransitionLink>
        </h2>
      </section>
    </>
  );
}
