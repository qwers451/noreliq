"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useCoarsePointer, useReducedMotion } from "@/lib/useReducedMotion";

const INTERACTIVE = 'a, button, [role="button"], [data-cursor]';

/**
 * Кастомный курсор с состояниями default / link / drag.
 * Не монтируется на тач-устройствах и при prefers-reduced-motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const enabled = reduced === false && coarse === false;

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
    };

    const setState = (state: string) => {
      const isLink = state === "link";
      const isDrag = state === "drag";
      gsap.to(ring, {
        scale: isDrag ? 2.4 : isLink ? 1.8 : 1,
        borderColor: isLink || isDrag ? "var(--color-accent-ink)" : "var(--color-fg)",
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: isLink ? 0 : 1, duration: 0.3, ease: "power3.out" });
      ring.dataset.state = state;
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE);
      setState(target ? target.dataset.cursor || "link" : "default");
    };

    const onLeaveWindow = () => {
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] hidden md:block">
      <div
        ref={ringRef}
        className="invisible fixed -left-5 -top-5 h-10 w-10 rounded-full border border-fg"
      />
      <div ref={dotRef} className="invisible fixed -left-1 -top-1 h-2 w-2 rounded-full bg-fg" />
    </div>
  );
}
