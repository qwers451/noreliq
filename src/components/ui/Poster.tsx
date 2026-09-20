import clsx from "clsx";

import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";

type PosterProps = {
  /** Мелкая строка над заголовком: раздел или позиционирование. */
  label?: string;
  /** Первая строка — антиква капсом. */
  caps: string;
  /** Вторая строка — курсив в акцентном цвете. */
  italic: string;
  lead?: string;
  cta?: { href: string; label: string };
  /** Размер заголовка: hero для главной, display для внутренних страниц. */
  size?: "hero" | "display";
  className?: string;
};

/**
 * Композиция-плакат: всё по центру одного экрана — метка, две строки
 * заголовка, короткий абзац и призыв под волосяной линией.
 */
export function Poster({
  label,
  caps,
  italic,
  lead,
  cta,
  size = "display",
  className,
}: PosterProps) {
  const titleSize = size === "hero" ? "text-hero" : "text-display";

  return (
    <section className={clsx("poster container-x", className)}>
      {label ? (
        <Reveal as="p" className="mono-label mb-8 opacity-70" immediate>
          {label}
        </Reveal>
      ) : null}

      <h1 className="mb-0">
        <Reveal as="span" className={clsx("display-caps block", titleSize)} immediate>
          {caps}
        </Reveal>
        {/* Комментарий идёт подзаголовком: раньше он был набран тем же
            кеглем, что и заголовок, и перетягивал внимание на себя. */}
        <Reveal
          as="span"
          className="display-note mt-4 block text-[length:clamp(0.9375rem,1.7vw,1.375rem)]"
          immediate
          delay={0.08}
        >
          {italic}
        </Reveal>
      </h1>

      {lead ? (
        <Reveal as="p" className="poster-lead mt-10" immediate delay={0.16}>
          {lead}
        </Reveal>
      ) : null}

      {cta ? (
        <Reveal className="mt-12 flex flex-col items-center gap-6" immediate delay={0.24}>
          <span aria-hidden="true" className="hairline" />
          <TransitionLink href={cta.href} className="mono-label link-mask tap-target">
            {cta.label}
          </TransitionLink>
        </Reveal>
      ) : null}
    </section>
  );
}
