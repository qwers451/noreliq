import { SplitReveal } from "@/components/motion/SplitReveal";

type PageHeroProps = {
  label: string;
  title: string;
  lead?: string;
};

/** Единая шапка внутренних страниц: индекс раздела, крупный заголовок, лид. */
export function PageHero({ label, title, lead }: PageHeroProps) {
  return (
    <section className="container-x pb-16 pt-[calc(var(--header-h)+6vh)] md:pb-24 md:pt-[calc(var(--header-h)+12vh)]">
      <SplitReveal as="p" className="label mb-8" type="words" immediate stagger={0.04}>
        {label}
      </SplitReveal>

      <SplitReveal
        as="h1"
        className="font-display text-display leading-[0.9]"
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
