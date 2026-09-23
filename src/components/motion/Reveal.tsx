"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import clsx from "clsx";

import { useReducedMotion } from "@/lib/useReducedMotion";

type RevealProps = {
  children: ReactNode;
  /** Тег обёртки — например, ol или ul, чтобы не ломать семантику списка. */
  as?: ElementType;
  id?: string;
  className?: string;
  delay?: number;
  /** Сдвиг по вертикали в пикселях. */
  y?: number;
  /** Каскад по прямым потомкам вместо анимации блока целиком. */
  stagger?: number;
  /** Анимировать сразу при монтировании, без ожидания скролла. */
  immediate?: boolean;
};

/** Кривая совпадает с --ease-out-expo из globals.css. */
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Единственный примитив появления: мягкий сдвиг вверх с проявлением.
 *
 * Сделано на Web Animations API. Раньше здесь был GSAP, но во всём проекте
 * от него оставались ровно такие переходы — 42 КБ в сжатом виде на каждой
 * странице ради четырёх простых анимаций.
 */
export function Reveal({
  children,
  as: Tag = "div",
  id,
  className,
  delay = 0,
  y = 12,
  stagger,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Появление «сразу» — чистым CSS (см. [data-anim="intro"] в globals.css):
  // анимация стартует с первой отрисовки, а не после загрузки скриптов.
  // Раньше до гидрации текст был прозрачным, и на медленном телефоне
  // главный экран оставался пустым ~3 с (LCP). CSS-анимация заново
  // играет и при переходе: новые узлы вставляются в документ.
  const cssIntro = immediate && !stagger;

  useEffect(() => {
    if (reduced !== false || cssIntro) return;
    const el = ref.current;
    if (!el) return;

    // Со stagger анимируем прямых потомков, но если их нет (блок с голым
    // текстом) — анимируем сам блок, иначе анимация просто не состоялась бы.
    const children = [...el.children] as HTMLElement[];
    const targets = stagger && children.length > 0 ? children : [el];

    let animations: Animation[] = [];

    const play = () => {
      // Снимаем CSS-скрытие и анимируем только «от»: конечное значение
      // браузер берёт из стилей элемента, поэтому приглушённые подписи
      // (opacity-60) остаются приглушёнными. offset: 0 обязателен —
      // одиночный кадр без него считается конечным, и блок сначала
      // растворялся, а потом появлялся заново.
      el.dataset.anim = "shown";
      animations = targets.map((target, index) =>
        target.animate([{ offset: 0, opacity: 0, transform: `translateY(${y}px)` }], {
          duration: 1100,
          delay: (delay + (stagger ?? 0) * index) * 1000,
          easing: EASE,
          fill: "backwards",
        }),
      );
    };

    if (immediate) {
      play();
      return () => animations.forEach((animation) => animation.cancel());
    }

    // IntersectionObserver вместо скролл-плагинов: нужен ровно один
    // сценарий — «показать один раз, когда блок появился в окне».
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        play();
      },
      { rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [reduced, delay, y, stagger, immediate, cssIntro]);

  if (cssIntro) {
    const vars = { "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as CSSProperties;
    return (
      <Tag ref={ref} id={id} data-anim="intro" style={vars} className={clsx(className)}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} id={id} data-anim="hidden" className={clsx(className)}>
      {children}
    </Tag>
  );
}
