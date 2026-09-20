import clsx from "clsx";

import { Reveal } from "@/components/motion/Reveal";

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
    <section className="container-x section-b-tight pt-[calc(var(--header-h)+4vh)] md:pt-[calc(var(--header-h)+7vh)]">
      <Reveal as="p" className="label mb-6" immediate>
        <span className="text-accent-ink">{index}</span>
        {name ? ` / ${name}` : null}
      </Reveal>

      <Reveal
        as="h1"
        className={clsx("font-display text-display leading-[0.9]", titleClassName)}
        immediate
      >
        {title}
      </Reveal>

      {lead ? (
        <Reveal
          as="p"
          className="mt-6 max-w-[46ch] text-lead leading-snug text-muted md:mt-8"
          delay={0.15}
          immediate
        >
          {lead}
        </Reveal>
      ) : null}
    </section>
  );
}
