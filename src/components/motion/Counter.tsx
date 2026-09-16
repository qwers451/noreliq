"use client";

import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";

import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

type CounterProps = {
  /** Строка целиком: «40+», «×2», «6». Разбирается на префикс, число и суффикс. */
  value: string;
  className?: string;
};

/** Разбор «×2» → { prefix: "×", number: 2, suffix: "" }. */
function parse(value: string) {
  const match = /^(\D*?)(\d+)(\D*)$/.exec(value.trim());
  if (!match) return null;
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
}

/**
 * Прокручивает число до значения при попадании в экран.
 * Если строку разобрать не удалось (например, «1,2 млн») — выводит её как есть.
 */
export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  // Мемо обязательно: без него объект новый на каждый рендер и твин пересоздаётся.
  const parsed = useMemo(() => parse(value), [value]);

  useEffect(() => {
    if (reduced !== false || !parsed) return;
    const el = ref.current;
    if (!el) return;

    const format = new Intl.NumberFormat("ru-RU");
    const state = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        value: parsed.number,
        duration: 1.2,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = format.format(Math.round(state.value));
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, parsed]);

  if (!parsed) return <span className={className}>{value}</span>;

  // Итоговое значение стоит в разметке сразу: без JS и при reduced-motion
  // пользователь видит правильное число, а не ноль.
  return (
    <span className={clsx("tabular-nums", className)}>
      {parsed.prefix}
      <span ref={ref}>{parsed.number}</span>
      {parsed.suffix}
    </span>
  );
}
