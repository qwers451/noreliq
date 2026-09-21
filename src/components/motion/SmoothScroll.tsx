"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { useReducedMotion } from "@/lib/useReducedMotion";

let lenisInstance: Lenis | null = null;

/** Доступ к Lenis из других компонентов (например, сброс скролла при переходе). */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToTop(immediate = true) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

/**
 * Плавный скролл через Lenis на собственном кадровом цикле.
 * При prefers-reduced-motion не инициализируется вовсе — остаётся нативный скролл.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced !== false) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // На тач-устройствах оставляем нативную инерцию.
      syncTouch: false,
    });
    lenisInstance = lenis;

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
