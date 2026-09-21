"use client";

import { useEffect, useRef } from "react";

import {
  DESKTOP_QUERY,
  useCoarsePointer,
  useMediaQuery,
  useReducedMotion,
} from "@/lib/useReducedMotion";

const INTERACTIVE = 'a, button, [role="button"], [data-cursor]';

/**
 * Кастомный курсор с состояниями default / link / drag.
 * Не монтируется на тач-устройствах и при prefers-reduced-motion.
 *
 * Позицию ведёт кадровый цикл, а масштаб и цвет — CSS-переходы по
 * data-state. Разнесено намеренно: сдвиг пишется в отдельное свойство
 * translate, поэтому переход у scale не дерётся с ним за transform.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  // Ширину проверяем тем же условием, что и отрисовку курсора. Раньше класс
  // has-custom-cursor (cursor: none) ставился независимо от вёрстки, а сам
  // курсор прятался через hidden md:block — в узком окне десктопного браузера
  // пропадали оба, и указателя не оставалось вовсе.
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const enabled = reduced === false && coarse === false && desktop === true;

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = targetX;
    let dotY = targetY;
    let ringX = targetX;
    let ringY = targetY;
    let frame = 0;
    let last = 0;

    /** Доля пути за кадр при 60 Гц, пересчитанная под фактический кадр. */
    const damp = (base: number, dt: number) => 1 - Math.pow(1 - base, dt / 16.67);

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      dotX += (targetX - dotX) * damp(0.45, dt);
      dotY += (targetY - dotY) * damp(0.45, dt);
      ringX += (targetX - ringX) * damp(0.16, dt);
      ringY += (targetY - ringY) * damp(0.16, dt);

      dot.style.translate = `${dotX}px ${dotY}px`;
      ring.style.translate = `${ringX}px ${ringY}px`;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.dataset.visible = "true";
      ring.dataset.visible = "true";
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE);
      const state = target ? target.dataset.cursor || "link" : "default";
      ring.dataset.state = state;
      dot.dataset.state = state;
    };

    const onLeaveWindow = () => {
      dot.dataset.visible = "false";
      ring.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95]">
      <div
        ref={ringRef}
        data-part="ring"
        data-state="default"
        data-visible="false"
        className="cursor-part fixed -left-5 -top-5 h-10 w-10 rounded-full border border-fg"
      />
      <div
        ref={dotRef}
        data-part="dot"
        data-state="default"
        data-visible="false"
        className="cursor-part fixed -left-1 -top-1 h-2 w-2 rounded-full bg-fg"
      />
    </div>
  );
}
