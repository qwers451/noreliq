"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import clsx from "clsx";

import { gsap } from "@/lib/gsap";
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

/** Единственный примитив появления: мягкий сдвиг вверх с проявлением. */
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

  useEffect(() => {
    if (reduced !== false) return;
    const el = ref.current;
    if (!el) return;

    // Со stagger анимируем прямых потомков, но если их нет (блок с голым
    // текстом) — анимируем сам блок, иначе анимация просто не состоялась бы.
    const children = Array.from(el.children);
    const targets = stagger && children.length > 0 ? children : el;

    const play = () => {
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        delay,
        stagger,
      });
    };

    if (immediate) {
      const ctx = gsap.context(play, el);
      return () => ctx.revert();
    }

    // IntersectionObserver вместо ScrollTrigger: плагин весил 17 КБ в сжатом
    // виде, а нужен был ровно один сценарий — «показать один раз, когда блок
    // появился в окне».
    let ctx: gsap.Context | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        ctx = gsap.context(play, el);
      },
      { rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [reduced, delay, y, stagger, immediate]);

  return (
    <Tag ref={ref} id={id} data-anim="hidden" className={clsx(className)}>
      {children}
    </Tag>
  );
}
