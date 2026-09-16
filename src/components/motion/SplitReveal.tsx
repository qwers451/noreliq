"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import clsx from "clsx";

import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

type SplitRevealProps = {
  children: ReactNode;
  id?: string;
  /** Тег обёртки: h1, h2, p, div… */
  as?: ElementType;
  className?: string;
  /** Что анимируем: строки (по умолчанию), слова или символы. */
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  /** Точка старта ScrollTrigger. */
  start?: string;
  /** Анимировать сразу при монтировании, без ожидания скролла. */
  immediate?: boolean;
};

/**
 * Базовый примитив ревила текста: разбивает содержимое на строки/слова/символы
 * и выводит их каскадом. Подчиняется prefers-reduced-motion — при уменьшенном
 * движении текст просто виден сразу и DOM не трогается.
 */
export function SplitReveal({
  children,
  id,
  as: Tag = "div",
  className,
  type = "lines",
  delay = 0,
  stagger = 0.08,
  start = "top 85%",
  immediate = false,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced !== false) return;
    const el = ref.current;
    if (!el) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    // Разбиваем только после загрузки шрифтов — иначе строки лягут не там.
    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return;

      ctx = gsap.context(() => {
        const split = SplitText.create(el, {
          type: type === "lines" ? "lines" : `lines,${type}`,
          mask: "lines",
          linesClass: "split-line",
          // Не даём SplitText вешать aria-label на произвольные теги:
          // разметка и так временная — после анимации вызывается revert().
          aria: "none",
        });

        const targets =
          type === "lines" ? split.lines : type === "words" ? split.words : split.chars;

        gsap.set(el, { autoAlpha: 1 });
        gsap.from(targets, {
          yPercent: 110,
          duration: 0.9,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: el,
                start,
                once: true,
              },
          onComplete: () => {
            // Возвращаем исходную разметку: текст снова переносится сам.
            split.revert();
          },
        });
      }, el);

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, type, stagger, delay, start, immediate]);

  return (
    <Tag ref={ref} id={id} data-anim="hidden" className={clsx(className)}>
      {children}
    </Tag>
  );
}
