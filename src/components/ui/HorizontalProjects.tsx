"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { TransitionLink } from "@/components/motion/TransitionLink";
import { useCarousel } from "@/lib/useCarousel";
import type { Project } from "@/content/projects";

type Props = { projects: Project[] };

const ALL = "Все";

/**
 * Лента работ как в разделе проектов у референса: горизонтальная полоса
 * небольших карточек, активная подрастает и раскрывает описание, снизу —
 * фильтры по тегам со счётчиками и тонкая полоса прокрутки.
 *
 * Вся механика прокрутки живёт в useCarousel: активной считается карточка
 * в центре, после жеста лента сама доворачивает ближайшую.
 */
export function HorizontalProjects({ projects }: Props) {
  const [filter, setFilter] = useState(ALL);

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter))),
    [projects, filter],
  );

  // Колесо ловим на всём блоке, а не только на полосе карточек:
  // страница проектов не прокручивается вертикально, и над подписями
  // или фильтрами колесо иначе не делало бы ничего.
  const surfaceRef = useRef<HTMLDivElement>(null);
  const { trackRef, progressRef, goTo } = useCarousel({
    count: visible.length,
    mode: "free",
    wheelSurface: surfaceRef,
  });

  /** Теги со счётчиками — как «GAMING 22» в нижней строке референса. */
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [projects]);

  const applyFilter = (tag: string) => {
    setFilter(tag);
    goTo(0);
  };

  return (
    <div ref={surfaceRef} className="flex h-full flex-col justify-center">
      <div
        ref={trackRef}
        role="region"
        tabIndex={0}
        aria-label="Лента проектов"
        className="carousel-track items-start gap-8 pb-2 md:gap-12"
      >
        {visible.map((project, index) => (
          // data-active проставляет useCarousel напрямую в DOM, а оформление
          // висит на CSS-селекторе: так смена центральной карточки не гоняет
          // React по списку картинок посреди прокрутки.
          <article key={project.slug} className="group w-[74vw] shrink-0 md:w-[24vw]">
            <TransitionLink href={`/projects/${project.slug}`} className="block">
              {/* Активная карточка чуть крупнее — так лента получает
                  фокус внимания, как в референсе. */}
              <div className="relative h-[24svh] w-full overflow-hidden md:h-[28svh]">
                <Image
                  src={project.cover}
                  alt={`Обложка проекта ${project.title}`}
                  fill
                  sizes="(max-width: 768px) 74vw, 24vw"
                  priority={index < 2}
                  draggable={false}
                  className="scale-100 object-cover opacity-65 transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)] group-data-[active=true]:scale-[1.04] group-data-[active=true]:opacity-100"
                />
              </div>

              <h2 className="mt-5">
                <span className="display-caps block text-h2">{project.title}</span>
                <span className="display-note mt-2 block text-[0.9375rem]">
                  {project.subtitle ?? project.role.toLowerCase()}
                </span>
              </h2>

              <span aria-hidden="true" className="mt-3 block h-px w-8 bg-current opacity-50" />

              {/* Описание показывается только у центральной карточки.
                  Высота зарезервирована — иначе лента прыгает при смене. */}
              <div className="mt-4 h-24 translate-y-2 opacity-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 group-data-[active=true]:delay-100 md:mt-5 md:h-36">
                <p className="line-clamp-2 max-w-[34ch] leading-relaxed md:line-clamp-4">
                  {project.summary}
                </p>
                <p className="mono-label mt-3 opacity-60">
                  {project.tags[0]} · {project.year}
                </p>
              </div>
            </TransitionLink>
          </article>
        ))}
      </div>

      <div className="mt-6 md:mt-10">
        <div className="no-scrollbar flex items-center gap-x-5 overflow-x-auto px-[var(--gutter)] md:flex-wrap md:justify-center md:px-0">
          <button
            type="button"
            onClick={() => applyFilter(ALL)}
            className={clsx(
              "mono-label inline-flex min-h-11 shrink-0 items-center px-1 transition-opacity active:opacity-60",
              filter === ALL ? "opacity-100" : "opacity-50 hover:opacity-80",
            )}
          >
            {ALL}
          </button>

          {tags.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              onClick={() => applyFilter(tag)}
              className={clsx(
                "mono-label inline-flex min-h-11 shrink-0 items-center px-1 transition-opacity active:opacity-60",
                filter === tag ? "opacity-100" : "opacity-50 hover:opacity-80",
              )}
            >
              {tag}
              <sup className="ml-1 opacity-70">{count}</sup>
            </button>
          ))}
        </div>

        {/* Полоса прокрутки ленты. Ширину не анимируем: масштаб по X
            не трогает раскладку и не заставляет пересчитывать её каждый кадр. */}
        <div className="mx-auto mt-5 mb-10 h-px w-[60%] max-w-md bg-current opacity-20 md:mb-0">
          <div
            ref={progressRef}
            className="h-px origin-left bg-current opacity-100"
            style={{ transform: "scaleX(max(0.08, var(--progress, 0)))" }}
          />
        </div>
      </div>
    </div>
  );
}
