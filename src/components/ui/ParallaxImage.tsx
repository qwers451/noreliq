"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import clsx from "clsx";

import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** Насколько сильно картинка «отстаёт» от скролла, в процентах высоты. */
  amount?: number;
};

/** Обложка с лёгким параллаксом по скроллу. Без движения — обычная картинка. */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  amount = 12,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced !== false) return;
    const el = ref.current;
    if (!el) return;
    const image = el.querySelector("img");
    if (!image) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, amount]);

  return (
    <div ref={ref} className={clsx("relative overflow-hidden bg-bg-alt", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="scale-110 object-cover"
      />
    </div>
  );
}
