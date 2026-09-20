"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { TransitionLink } from "@/components/motion/TransitionLink";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Project } from "@/content/projects";

type Props = { projects: Project[] };

const ALL = "Все";

/**
 * Лента работ как в разделе проектов у референса: горизонтальная полоса
 * небольших карточек, подпись «клиент / название курсивом» под каждой,
 * активная карточка подрастает и раскрывает описание. Снизу — фильтры
 * по тегам со счётчиками и тонкая полоса прокрутки.
 */
export function HorizontalProjects({ projects }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState(ALL);
  const [progress, setProgress] = useState(0);

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
    setActive(0);
    trackRef.current?.scrollTo({ left: 0 });
  };

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter))),
    [projects, filter],
  );

  /* Колесо мыши двигает ленту вбок. Позицию догоняем плавно в rAF:
     scrollBy на каждое событие колеса накапливался и дёргал ленту. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let target = track.scrollLeft;
    let frame = 0;
    const smooth = reduced === false;

    const tick = () => {
      const delta = target - track.scrollLeft;
      if (Math.abs(delta) < 0.5) {
        frame = 0;
        return;
      }
      track.scrollLeft += delta * 0.12;
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();

      const max = track.scrollWidth - track.clientWidth;
      target = Math.min(Math.max(target + event.deltaY, 0), max);

      if (!smooth) {
        track.scrollLeft = target;
        return;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      setProgress(max > 0 ? track.scrollLeft / max : 0);
      // Пальцем прокрутили — цель догоняет фактическую позицию.
      if (!frame) target = track.scrollLeft;
    };

    /* Перетаскивание мышью. Клик по карточке не ломаем: переход отменяем
       только если курсор реально увели в сторону. */
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startLeft = track.scrollLeft;
      // Захват указателя ставим один раз здесь: повторный вызов на каждом
      // движении бросает исключение и обрывает перетаскивание.
      try {
        track.setPointerCapture(event.pointerId);
      } catch {
        /* браузер может отказать в захвате — перетаскивание всё равно работает */
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 4) moved = true;
      track.scrollLeft = startLeft - delta;
      target = track.scrollLeft;
    };

    const onPointerUp = () => {
      dragging = false;
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("click", onClickCapture, true);

    return () => {
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("click", onClickCapture, true);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div className="flex h-full flex-col justify-center">
      <div
        ref={trackRef}
        className="no-scrollbar flex cursor-grab items-start gap-8 overflow-x-auto px-[var(--gutter)] pb-2 active:cursor-grabbing md:gap-12"
        aria-label="Лента проектов"
      >
        {visible.map((project, index) => {
          const isActive = index === active;

          return (
            <article
              key={project.slug}
              onMouseEnter={() => setActive(index)}
              onFocusCapture={() => setActive(index)}
              className="w-[74vw] shrink-0 md:w-[24vw]"
            >
              <TransitionLink href={`/projects/${project.slug}`} className="block">
                {/* Активная карточка чуть крупнее — так лента получает
                    фокус внимания, как в референсе. */}
                <div className="relative h-[28svh] w-full overflow-hidden">
                  <Image
                    src={project.cover}
                    alt={`Обложка проекта ${project.title}`}
                    fill
                    sizes="(max-width: 768px) 74vw, 24vw"
                    quality={92}
                    priority={index < 2}
                    className={clsx(
                      "object-cover transition-all duration-700 ease-[var(--ease-out-expo)]",
                      isActive ? "scale-[1.04] opacity-100" : "scale-100 opacity-65",
                    )}
                  />
                </div>

                <h2 className="mt-5">
                  <span className="display-caps block text-h2">{project.title}</span>
                  <span className="display-italic block text-h2">
                    {project.subtitle ?? project.role.toLowerCase()}
                  </span>
                </h2>

                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-8 bg-current opacity-50"
                />

                {/* Описание и мета показываются только у активной карточки. */}
                <div
                  className={clsx(
                    "mt-5 h-36 transition-[opacity,transform] duration-1000 ease-[var(--ease-out-expo)]",
                    isActive ? "translate-y-0 opacity-100 delay-100" : "translate-y-2 opacity-0 delay-0",
                  )}
                  aria-hidden={!isActive}
                >
                  <p className="line-clamp-4 max-w-[34ch] leading-relaxed">{project.summary}</p>
                  <p className="mono-label mt-3 opacity-60">
                    {project.tags[0]} · {project.year}
                  </p>
                </div>
              </TransitionLink>
            </article>
          );
        })}
      </div>

      <div className="container-x mt-10">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={() => applyFilter(ALL)}
            className={clsx("mono-label transition-opacity", filter === ALL ? "opacity-100" : "opacity-50 hover:opacity-80")}
          >
            {ALL}
          </button>

          {tags.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              onClick={() => applyFilter(tag)}
              className={clsx(
                "mono-label transition-opacity",
                filter === tag ? "opacity-100" : "opacity-50 hover:opacity-80",
              )}
            >
              {tag}
              <sup className="ml-1 opacity-70">{count}</sup>
            </button>
          ))}
        </div>

        {/* Полоса прокрутки ленты — тонкая линия под фильтрами. */}
        <div className="mx-auto mt-6 h-px w-full max-w-md bg-current opacity-20">
          <div
            className="h-px bg-current opacity-100 transition-[width] duration-200"
            style={{ width: `${Math.max(progress * 100, 8)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
