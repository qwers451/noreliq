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
  start?: string;
  /** Анимировать сразу при монтировании, без ожидания скролла. */
  immediate?: boolean;
};

/** Ревил для нетекстовых блоков: карточек, изображений, списков. */
export function Reveal({
  children,
  as: Tag = "div",
  id,
  className,
  delay = 0,
  y = 40,
  stagger,
  start = "top 95%",
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced !== false) return;
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        delay,
        stagger,
        scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, delay, y, stagger, start, immediate]);

  return (
    <Tag ref={ref} id={id} data-anim="hidden" className={clsx(className)}>
      {children}
    </Tag>
  );
}
