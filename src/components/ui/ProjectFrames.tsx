"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import clsx from "clsx";

import { useReducedMotion } from "@/lib/useReducedMotion";

export type Frame = { src: string; alt: string; width: number; height: number };

type Props = { frames: Frame[] };

/**
 * Кадры проекта листаются: колесом, перетаскиванием и стрелками.
 * Ряд центрируется, пока кадры помещаются в экран, — иначе на широком
 * мониторе они жались к левому краю и половина экрана пустовала.
 */
export function ProjectFrames({ frames }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // Центрировать ряд можно только пока он помещается: у переполненного
  // flex-контейнера с justify-center первый кадр уезжает за левый край
  // и до него невозможно долистать.
  const [fits, setFits] = useState(true);
  /** Индекс кадра, открытого во весь экран. null — просмотр закрыт. */
  const [zoom, setZoom] = useState<number | null>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let target = track.scrollLeft;
    let frame = 0;

    const maxScroll = () => track.scrollWidth - track.clientWidth;

    const tick = () => {
      const delta = target - track.scrollLeft;
      if (Math.abs(delta) < 0.5) {
        frame = 0;
        return;
      }
      track.scrollLeft += delta * 0.14;
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (maxScroll() <= 0) return;

      const next = target + event.deltaY;
      // У краёв отдаём прокрутку странице, иначе кейс невозможно пролистать.
      if ((next <= 0 && event.deltaY < 0) || (next >= maxScroll() && event.deltaY > 0)) return;

      event.preventDefault();
      target = Math.min(Math.max(next, 0), maxScroll());

      if (reduced !== false) {
        track.scrollLeft = target;
        return;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!frame) target = track.scrollLeft;
      setAtStart(track.scrollLeft <= 1);
      setAtEnd(track.scrollLeft >= maxScroll() - 1);
    };

    const measure = () => {
      const overflow = track.scrollWidth - track.clientWidth;
      setFits(overflow <= 1);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    /* Перетаскивание мышью — привычный способ листать такие ряды. */
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startLeft = track.scrollLeft;
      // Привязка к кадрам во время жеста тянет ленту обратно —
      // на время перетаскивания выключаем её.
      track.style.scrollSnapType = "none";
    };
    const onMouseMove = (event: MouseEvent) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 6) moved = true;
      if (!moved) return;
      event.preventDefault();
      track.scrollLeft = startLeft - delta;
      target = track.scrollLeft;
    };
    const onMouseUp = () => {
      if (dragging) track.style.scrollSnapType = "";
      dragging = false;
      // Клик приходит сразу после отпускания — он должен узнать,
      // что это было перетаскивание, а не нажатие на кадр.
      if (moved) window.setTimeout(() => (moved = false), 0);
    };

    const onDragStart = (event: Event) => event.preventDefault();

    const onClickCapture = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
    };

    onScroll();
    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("mousedown", onMouseDown);
    track.addEventListener("dragstart", onDragStart);
    // Окно, а не трек: курсор уходит на картинку, и события теряются.
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    track.addEventListener("click", onClickCapture, true);

    return () => {
      observer.disconnect();
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("mousedown", onMouseDown);
      track.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      track.removeEventListener("click", onClickCapture, true);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  /* Полноэкранный просмотр: Esc закрывает, стрелки листают. */
  useEffect(() => {
    if (zoom === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoom(null);
      if (event.key === "ArrowRight") setZoom((i) => (i === null ? i : (i + 1) % frames.length));
      if (event.key === "ArrowLeft") {
        setZoom((i) => (i === null ? i : (i - 1 + frames.length) % frames.length));
      }
    };

    document.documentElement.classList.add("is-menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("is-menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom, frames.length]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: reduced === false ? "smooth" : "auto",
    });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className={clsx(
          "no-scrollbar flex snap-x snap-proximity items-center gap-6 overflow-x-auto px-[var(--gutter)] py-4 md:gap-10",
          fits ? "justify-center" : "justify-start",
        )}
        aria-label="Кадры проекта"
      >
        {frames.map((frame, index) => (
          <figure key={frame.src} className="flex shrink-0 snap-center flex-col items-center">
            <button
              type="button"
              onClick={() => setZoom(index)}
              className="block cursor-zoom-in"
              aria-label={`Открыть кадр: ${frame.alt}`}
            >
            <Image
              src={frame.src}
              alt={frame.alt}
              width={frame.width}
              height={frame.height}
              sizes="(max-width: 768px) 82vw, 60vw"
              quality={92}
              draggable={false}
              className="max-h-[58svh] w-auto max-w-[82vw] object-contain md:max-w-[62vw]"
            />
            </button>

            {/* w-0 + min-w-full: подпись переносится по ширине картинки
                и не растягивает кадр, иначе изображение уезжает влево. */}
            <figcaption className="mono-label mt-4 w-0 min-w-full text-center opacity-60">
              {frame.alt}
            </figcaption>
          </figure>
        ))}
      </div>

      {zoom !== null
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={frames[zoom].alt}
              onClick={() => setZoom(null)}
              className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-4 bg-bg/95 px-[var(--gutter)] py-14 backdrop-blur-sm"
            >
              <Image
                src={frames[zoom].src}
                alt={frames[zoom].alt}
                width={frames[zoom].width}
                height={frames[zoom].height}
                quality={95}
                sizes="92vw"
                className="max-h-[70svh] w-auto max-w-[92vw] object-contain"
              />

              <p className="mono-label max-w-[60ch] text-center opacity-70">
                {frames[zoom].alt}
              </p>

              <div
                className="flex items-center gap-8"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() =>
                    setZoom((i) => (i === null ? i : (i - 1 + frames.length) % frames.length))
                  }
                  className="mono-label inline-flex min-h-11 min-w-11 items-center justify-center text-base active:opacity-60"
                  aria-label="Предыдущий кадр"
                >
                  ←
                </button>
                <span className="mono-label opacity-60">
                  {zoom + 1} / {frames.length}
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((i) => (i === null ? i : (i + 1) % frames.length))}
                  className="mono-label inline-flex min-h-11 min-w-11 items-center justify-center text-base active:opacity-60"
                  aria-label="Следующий кадр"
                >
                  →
                </button>
              </div>

              <button
                type="button"
                onClick={() => setZoom(null)}
                className="mono-label absolute right-[var(--gutter)] top-4 inline-flex min-h-11 items-center px-2 opacity-70 active:opacity-100"
              >
                Закрыть
              </button>
            </div>,
            document.body,
          )
        : null}

      {/* Стрелки появляются только когда есть куда листать. */}
      {frames.length > 1 ? (
        <div className="mt-2 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            className="mono-label inline-flex min-h-11 items-center px-3 transition-opacity active:opacity-60 disabled:opacity-25"
            aria-label="Предыдущий кадр"
          >
            ← Назад
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            className="mono-label inline-flex min-h-11 items-center px-3 transition-opacity active:opacity-60 disabled:opacity-25"
            aria-label="Следующий кадр"
          >
            Вперёд →
          </button>
        </div>
      ) : null}
    </div>
  );
}
