import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Проекты",
  description:
    "Избранные работы Noreliq: платформы, витрины, интерактивные отчёты и корпоративные сайты.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        label={`03 / Проекты · ${projects.length}`}
        title="Работы"
        lead="Выборка проектов за последние годы. Каждый кейс — про задачу, решение и результат, а не только про картинки."
      />

      <section className="container-x" aria-label="Список проектов">
        <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal
              key={project.slug}
              className={project.size === "wide" ? "md:col-span-2" : undefined}
              delay={index % 2 === 1 ? 0.08 : 0}
            >
              <ProjectCard
                project={project}
                index={index}
                priority={index < 2}
                wide={project.size === "wide"}
                sizes={
                  project.size === "wide"
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
