"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { useCarousel } from "@/lib/useCarousel";

export type Frame = { src: string; alt: string; width: number; height: number };

type Props = {
  frames: Frame[];
  /** Кадр, с которого открыли просмотр. */
  start: number;
  onClose: () => void;
};

/**
 * Просмотр кадра во весь экран. Кадры листаются свайпом, стрелками и
 * клавишами — на телефоне без свайпа просмотр ощущался сломанным.
 *
 * Рендерится порталом в body намеренно: любой transform у предка делает
 * его containing block, и position: fixed схлопывается до размеров этого
 * предка. В этом проекте на грабли наступали дважды.
 */
export function FrameViewer({ frames, start, onClose }: Props) {
  const { trackRef, active, step, goTo } = useCarousel({
    count: frames.length,
    mode: "single",
  });

  /* Открываемся на том кадре, по которому нажали. Слайды шириной во весь
     экран, поэтому позиция известна сразу и не зависит от загрузки. */
  useEffect(() => {
    goTo(start);
  }, [goTo, start]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.documentElement.classList.add("is-menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("is-menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, step]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={frames[active]?.alt}
      className="fixed inset-0 z-[120] flex flex-col bg-bg/[0.97] pb-4 pt-14 backdrop-blur-md"
    >
      <div
        ref={trackRef}
        className="carousel-track min-h-0 flex-1 items-center"
        aria-label="Кадры во весь экран"
        data-lenis-prevent
      >
        {frames.map((frame) => (
          <div
            key={frame.src}
            onClick={onClose}
            className="flex h-full w-screen shrink-0 items-center justify-center"
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              width={frame.width}
              height={frame.height}
              quality={95}
              sizes="92vw"
              draggable={false}
              // Пинч-зум оставляем системе: это единственный способ
              // рассмотреть детали на телефоне.
              style={{ touchAction: "pinch-zoom" }}
              className="max-h-full w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex shrink-0 items-center justify-center gap-8">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={active === 0}
          className="mono-label inline-flex min-h-11 min-w-11 items-center justify-center text-base transition-opacity active:opacity-60 disabled:opacity-25"
          aria-label="Предыдущий кадр"
        >
          ←
        </button>
        <span className="mono-label tabular-nums opacity-60">
          {active + 1} / {frames.length}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={active === frames.length - 1}
          className="mono-label inline-flex min-h-11 min-w-11 items-center justify-center text-base transition-opacity active:opacity-60 disabled:opacity-25"
          aria-label="Следующий кадр"
        >
          →
        </button>
      </div>

      <p className="mono-label mx-auto mt-2 max-w-[60ch] shrink-0 px-[var(--gutter)] text-center opacity-70">
        {frames[active]?.alt}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mono-label absolute right-[var(--gutter)] top-4 inline-flex min-h-11 items-center px-2 opacity-70 active:opacity-100"
      >
        Закрыть
      </button>
    </div>,
    document.body,
  );
}
