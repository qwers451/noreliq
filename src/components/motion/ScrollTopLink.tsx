"use client";

import { scrollToTop } from "@/components/motion/SmoothScroll";

/**
 * Кнопка «Наверх». Через Lenis, а не через якорь #top:
 * нативный переход по якорю конфликтует с плавным скроллом.
 */
export function ScrollTopLink() {
  return (
    <button
      type="button"
      onClick={() => scrollToTop(false)}
      className="link-mask w-fit text-left"
    >
      Наверх
    </button>
  );
}
