"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";

import { gsap } from "@/lib/gsap";
import { useCoarsePointer, useReducedMotion } from "@/lib/useReducedMotion";

type MagneticLinkProps = {
  children: ReactNode;
  className?: string;
  /** Сила притяжения: 0.1 — едва заметно, 0.6 — очень липко. */
  strength?: number;
};

/** Магнитное притяжение элемента к курсору. Выключено на тач и при reduced-motion. */
export function MagneticLink({
  children,
  className,
  strength = 0.35,
}: MagneticLinkProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  useEffect(() => {
    if (reduced !== false || coarse !== false) return;
    const el = ref.current;
    if (!el) return;

    const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
      moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduced, coarse, strength]);

  return (
    <span ref={ref} className={clsx("inline-block will-change-transform", className)}>
      {children}
    </span>
  );
}
