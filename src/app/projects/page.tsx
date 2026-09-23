import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { HorizontalProjects } from "@/components/ui/HorizontalProjects";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Проекты",
  description:
    "Работы Noreliq: платформы, сервисы бронирования, мобильные приложения и визуал для маркетплейсов.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    // Ровно в экран — только от 720px высоты: ниже лента обрезала подписи
    // карточек (ноутбук 1366×650, телефон боком), и страница растёт по ним.
    <section className="flex min-h-[100svh] flex-col pt-[var(--header-h)] [@media(min-height:720px)]:h-[100svh]">
      {/* Заголовок первого уровня, а не абзац: это единственный заголовок
          раздела, и без него у страницы не было структуры для скринридеров
          и поисковиков. Вид задаёт .mono-label — базовые стили h1 он
          перекрывает, потому что слой components идёт после base. */}
      <div className="container-x pt-6 text-center">
        <Reveal as="h1" className="mono-label opacity-60" immediate>
          03 / Проекты · {projects.length}
        </Reveal>
      </div>

      {/* Лента занимает центральную часть экрана: пока всё помещается,
          страница не прокручивается, как в разделе работ у референса. */}
      <div className="flex min-h-0 flex-1 flex-col py-6">
        <HorizontalProjects projects={projects} />
      </div>
    </section>
  );
}
