"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";

import { FrameViewer, type Frame } from "@/components/ui/FrameViewer";
import { useCarousel } from "@/lib/useCarousel";

export type { Frame };

type Props = { frames: Frame[] };

/**
 * Кадры проекта листаются строго по одному: свайпом, перетаскиванием,
 * колесом и стрелками. Первый кадр стоит по центру сразу при открытии
 * страницы — за центрирование отвечает useCarousel.
 */
export function ProjectFrames({ frames }: Props) {
  const { trackRef, active, atStart, atEnd, step } = useCarousel({
    count: frames.length,
    mode: "single",
  });
  /** Индекс кадра, открытого во весь экран. null — просмотр закрыт. */
  const [zoom, setZoom] = useState<number | null>(null);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        tabIndex={0}
        aria-label="Кадры проекта"
        data-lenis-prevent
        className="carousel-track items-start gap-6 py-4 md:gap-10"
      >
        {frames.map((frame, index) => (
          <figure
            key={frame.src}
            // Размер кадра известен до загрузки картинки: ширина считается
            // из пропорции и упирается либо в ширину экрана, либо в высоту.
            // Без этого первые замеры центрирования врут и ряд съезжает.
            style={{ "--ratio": frame.width / frame.height } as CSSProperties}
            className="flex w-[min(82vw,calc(56svh*var(--ratio)))] shrink-0 flex-col items-center md:w-[min(62vw,calc(60svh*var(--ratio)))]"
          >
            <button
              type="button"
              onClick={() => setZoom(index)}
              className="relative block aspect-[var(--ratio)] w-full cursor-zoom-in"
              aria-label={`Открыть кадр: ${frame.alt}`}
              tabIndex={index === active ? 0 : -1}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="(max-width: 768px) 82vw, 62vw"
                quality={92}
                draggable={false}
                className="object-contain"
              />
            </button>

            <figcaption className="mono-label mt-4 text-center opacity-60">
              {frame.alt}
            </figcaption>
          </figure>
        ))}
      </div>

      {frames.length > 1 ? (
        <div className="mt-2 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            className="mono-label inline-flex min-h-11 items-center px-3 transition-opacity active:opacity-60 disabled:opacity-25"
            aria-label="Предыдущий кадр"
          >
            ← Назад
          </button>

          <span className="mono-label tabular-nums opacity-60">
            {active + 1} / {frames.length}
          </span>

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

      {zoom !== null ? (
        <FrameViewer frames={frames} start={zoom} onClose={() => setZoom(null)} />
      ) : null}
    </div>
  );
}
