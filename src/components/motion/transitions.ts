import { homeHref, nav } from "@/content/nav";

type Offset = { xPercent?: number; yPercent?: number };

export type TransitionVariant = {
  /** columns — вертикальные панели в ряд, rows — горизонтальные полосы. */
  layout: "columns" | "rows";
  /** Стартовое положение панелей: откуда они наезжают на экран. */
  from: Offset;
  /** Куда панели уходят, открывая новую страницу. */
  to: Offset;
  stagger: number | { each: number; from: "start" | "end" | "center" };
  coverDuration: number;
  revealDuration: number;
};

/**
 * Переход один и тот же — шторка из панелей. Меняются только направление
 * и ритм, поэтому разделы ощущаются по-разному, но ничего не бросается в глаза.
 */
const VARIANTS: Record<string, TransitionVariant> = {
  [homeHref]: {
    layout: "columns",
    from: { yPercent: 100 },
    to: { yPercent: -100 },
    stagger: 0.05,
    coverDuration: 0.5,
    revealDuration: 0.6,
  },
  "/about": {
    layout: "columns",
    from: { yPercent: -100 },
    to: { yPercent: 100 },
    stagger: { each: 0.05, from: "end" },
    coverDuration: 0.5,
    revealDuration: 0.6,
  },
  "/services": {
    layout: "columns",
    from: { yPercent: 100 },
    to: { yPercent: -100 },
    stagger: { each: 0.06, from: "center" },
    coverDuration: 0.5,
    revealDuration: 0.6,
  },
  "/projects": {
    layout: "rows",
    from: { xPercent: 100 },
    to: { xPercent: -100 },
    stagger: 0.05,
    coverDuration: 0.55,
    revealDuration: 0.6,
  },
  "/contacts": {
    layout: "columns",
    from: { yPercent: 100 },
    to: { yPercent: -100 },
    stagger: 0.09,
    coverDuration: 0.6,
    revealDuration: 0.7,
  },
};

export const defaultVariant = VARIANTS[homeHref];

/** Вложенные маршруты наследуют вариант раздела: /projects/atlas → /projects. */
export function getVariant(href: string): TransitionVariant {
  const section = nav.find((item) => href.startsWith(item.href));
  return (section && VARIANTS[section.href]) || defaultVariant;
}
