"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

type DisclosureProps = {
  /** Мелкий индекс слева от заголовка: «01», «02»… */
  index?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * Раскрывающийся блок с анимацией высоты.
 * Нативный <details> не анимируется предсказуемо, поэтому состояние своё,
 * а доступность собрана руками: кнопка + aria-expanded + region.
 */
export function Disclosure({ index, title, children, className }: DisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  useEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    // Без анимации панель просто показывается/скрывается.
    if (reduced !== false) {
      gsap.set(panel, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 });
      gsap.set(inner, { clearProps: "all" });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "expo.out", overwrite: "auto" },
      // Высота страницы изменилась — иначе триггеры ниже сработают не там.
      onComplete: () => ScrollTrigger.refresh(),
    });

    if (open) {
      // Стартовое состояние задаём явно, а не через .from(): прерванный
      // на полпути from оставляет элемент в промежуточных значениях и
      // запоминает их как конечные — от частых кликов текст тускнел
      // и больше не проявлялся.
      tl.set(inner, { y: 16, autoAlpha: 0 })
        .to(panel, { height: "auto", autoAlpha: 1, duration: 0.55 })
        .to(inner, { y: 0, autoAlpha: 1, duration: 0.5 }, "<0.1")
        // Фиксируем auto, чтобы панель не обрезала текст после смены ширины окна.
        .set(panel, { height: "auto" });
    } else {
      tl.to(panel, { height: 0, autoAlpha: 0, duration: 0.4, ease: "power3.inOut" });
    }

    return () => {
      tl.kill();
    };
  }, [open, reduced]);

  return (
    <div className={clsx("border-b border-line", className)}>
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="group grid w-full grid-cols-[3rem_1fr_auto] items-center gap-x-4 py-7 text-left"
        >
          {index ? <span className="label">{index}</span> : <span aria-hidden="true" />}
          <span className="font-display text-h3 transition-colors duration-300 group-hover:text-accent-ink">
            {title}
          </span>
          <span
            aria-hidden="true"
            className={clsx(
              "text-2xl leading-none transition-transform duration-500 ease-[var(--ease-out-expo)]",
              open && "rotate-45",
            )}
          >
            +
          </span>
        </button>
      </h3>

      {/* height: 0 стоит инлайн, чтобы блок не мигал раскрытым до гидрации. */}
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{ height: 0, overflow: "hidden" }}
      >
        <div ref={innerRef} className="grid grid-cols-[3rem_1fr] gap-x-4 pb-7">
          <span aria-hidden="true" />
          <div className="max-w-[60ch] text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}
