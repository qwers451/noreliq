import clsx from "clsx";

import { SplitReveal } from "@/components/motion/SplitReveal";

type PageHeroProps = {
  label: string;
  title: string;
  lead?: string;
  /** Например, ограничение ширины заголовка на «Контактах». */
  titleClassName?: string;
};

/** Единая шапка внутренних страниц: индекс раздела, крупный заголовок, лид. */
export function PageHero({ label, title, lead, titleClassName }: PageHeroProps) {
  // Индекс раздела отделяем от названия, чтобы подсветить его лаймом.
  const [index, ...rest] = label.split(" / ");
  const name = rest.join(" / ");

  return (
    <section className="container-x section-b-tight pt-[calc(var(--header-h)+6vh)] md:pt-[calc(var(--header-h)+12vh)]">
      <SplitReveal as="p" className="label mb-8" type="words" immediate stagger={0.04}>
        <span className="text-accent-ink">{index}</span>
        {name ? ` / ${name}` : null}
      </SplitReveal>

      <SplitReveal
        as="h1"
        className={clsx("font-display text-display leading-[0.9]", titleClassName)}
        immediate
      >
        {title}
      </SplitReveal>

      {lead ? (
        <SplitReveal
          as="p"
          className="mt-10 max-w-[46ch] text-lead leading-snug text-muted md:mt-14"
          delay={0.15}
          immediate
        >
          {lead}
        </SplitReveal>
      ) : null}
    </section>
  );
}
