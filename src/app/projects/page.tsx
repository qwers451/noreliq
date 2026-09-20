import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { HorizontalProjects } from "@/components/ui/HorizontalProjects";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Проекты",
  description:
    "Работы Noreliq: платформы, сервисы бронирования, мобильные приложения и визуал для маркетплейсов.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <section className="flex h-[100svh] flex-col pt-[var(--header-h)]">
      <div className="container-x pt-6 text-center">
        <Reveal as="p" className="mono-label opacity-60" immediate>
          03 / Проекты · {projects.length}
        </Reveal>
      </div>

      {/* Лента занимает центральную часть экрана: страница не прокручивается,
          как в разделе работ у референса. */}
      <div className="min-h-0 flex-1 py-6">
        <HorizontalProjects projects={projects} />
      </div>
    </section>
  );
}
