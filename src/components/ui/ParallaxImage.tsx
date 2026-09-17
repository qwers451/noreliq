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
  /**
   * Классы для слоя между рамкой и картинкой — сюда вешается hover-зум.
   * Отдельный слой нужен потому, что на сам <img> GSAP пишет inline-трансформ
   * параллакса, и CSS-трансформ с него бы не сработал.
   */
  innerClassName?: string;
  /**
   * cover — обложки: картинка кадрируется, лёгкий зум прячет края при сдвиге.
   * contain — логотип-водяной знак: кадрировать его нельзя.
   */
  fit?: "cover" | "contain";
  /**
   * Качество пережатия next/image. По умолчанию 75 — для снимков
   * интерфейса с мелким текстом этого мало, поэтому здесь 92.
   */
  quality?: number;
};

/** Обложка с лёгким параллаксом по скроллу. Без движения — обычная картинка. */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  amount = 8,
  innerClassName,
  fit = "cover",
  quality = 92,
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
    <div
      ref={ref}
      className={clsx(
        "relative overflow-hidden",
        fit === "cover" && "bg-bg-alt",
        className,
      )}
    >
      <div className={clsx("absolute inset-0", innerClassName)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          // scale-[1.06] вместо 110: запас нужен только чтобы сдвиг
          // не оголял края, а лишнее увеличение размывает картинку.
          // will-change удерживает слой в исходном разрешении при трансформе.
          className={
            fit === "cover"
              ? "scale-[1.06] object-cover will-change-transform"
              : "object-contain will-change-transform"
          }
        />
      </div>
    </div>
  );
}
