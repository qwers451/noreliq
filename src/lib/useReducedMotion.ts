"use client";

import { useEffect, useState } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Брейкпоинт md из Tailwind: ниже него интерфейс ведёт себя «по-мобильному». */
export const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Подписка на медиа-запрос. Возвращает null до гидрации, чтобы ничего
 * не запускалось раньше замера, и обновляется при изменении окна.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Единый источник правды о том, можно ли анимировать. */
export function useReducedMotion(): boolean | null {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}

/** true — если устройство без точного указателя (тач). */
export function useCoarsePointer(): boolean | null {
  return useMediaQuery("(pointer: coarse)");
}
