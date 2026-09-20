"use client";

import { useEffect, useRef, useState } from "react";
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

    // Стартовая позиция — середина ленты, чтобы кадры выглядели
    // отцентрированными, а не прижатыми к левому краю.
    const centerOnce = () => {
      const overflow = track.scrollWidth - track.clientWidth;
      if (overflow > 0) {
        track.scrollLeft = overflow / 2;
        target = track.scrollLeft;
      }
    };
    requestAnimationFrame(centerOnce);
    const observer = new ResizeObserver(measure);
    observer.observe(track);

    /* Перетаскивание мышью — привычный способ листать такие ряды. */
    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      dragging = true;
      startX = event.clientX;
      startLeft = track.scrollLeft;
      try {
        track.setPointerCapture(event.pointerId);
      } catch {
        /* если захват недоступен, перетаскивание всё равно отработает */
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      track.scrollLeft = startLeft - (event.clientX - startX);
      target = track.scrollLeft;
    };
    const onPointerUp = () => {
      dragging = false;
    };

    onScroll();
    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);

    return () => {
      observer.disconnect();
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

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
          "no-scrollbar flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[var(--gutter)] py-4 md:gap-10",
          fits ? "justify-center" : "justify-start",
        )}
        aria-label="Кадры проекта"
      >
        {frames.map((frame) => (
          <figure key={frame.src} className="flex shrink-0 snap-center flex-col items-center">
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
            {/* w-0 + min-w-full: подпись переносится по ширине картинки
                и не растягивает кадр, иначе изображение уезжает влево. */}
            <figcaption className="mono-label mt-4 w-0 min-w-full text-center opacity-60">
              {frame.alt}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Стрелки появляются только когда есть куда листать. */}
      {frames.length > 1 ? (
        <div className="mt-2 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            className="mono-label transition-opacity disabled:opacity-25"
            aria-label="Предыдущий кадр"
          >
            ← Назад
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            className="mono-label transition-opacity disabled:opacity-25"
            aria-label="Следующий кадр"
          >
            Вперёд →
          </button>
        </div>
      ) : null}
    </div>
  );
}
