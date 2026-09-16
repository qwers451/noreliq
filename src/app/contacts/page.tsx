import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Связаться с ${site.name}: ${site.email}, ${site.phone}. ${site.city}, ${site.timezone}.`,
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <>
      <section className="container-x pb-16 pt-[calc(var(--header-h)+6vh)] md:pb-24 md:pt-[calc(var(--header-h)+12vh)]">
        <SplitReveal as="p" className="label mb-8" type="words" immediate stagger={0.04}>
          04 / Контакты
        </SplitReveal>

        <SplitReveal
          as="h1"
          className="max-w-[16ch] font-display text-display leading-[0.9]"
          immediate
        >
          Расскажите, что нужно сделать
        </SplitReveal>

        <SplitReveal
          as="p"
          className="mt-10 max-w-[46ch] text-lead leading-snug text-muted"
          delay={0.15}
          immediate
        >
          Напишите пару строк о задаче и сроках — ответим в течение рабочего дня и предложим формат
          работы.
        </SplitReveal>
      </section>

      <section className="container-x pb-20 md:pb-28" aria-labelledby="direct">
        <h2 id="direct" className="sr-only">
          Прямые контакты
        </h2>

        <Reveal className="border-t border-line pt-10">
          <div>
            <MagneticLink strength={0.15}>
              <a
                href={`mailto:${site.email}`}
                className="link-mask block break-words font-display text-[length:clamp(1.75rem,6.5vw,4.5rem)] leading-none hover:text-accent-ink"
              >
                {site.email}
              </a>
            </MagneticLink>
          </div>

          <div className="mt-8">
            <MagneticLink strength={0.15}>
              <a
                href={`tel:${site.phoneHref}`}
                className="link-mask block font-display text-[length:clamp(1.5rem,4.5vw,3.25rem)] leading-none text-muted hover:text-fg"
              >
                {site.phone}
              </a>
            </MagneticLink>
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-20 md:pb-28" aria-labelledby="socials">
        <h2 id="socials" className="label">
          Соцсети
        </h2>

        <Reveal as="ul" className="mt-6 border-t border-line" stagger={0.08} y={24}>
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center justify-between gap-6 border-b border-line py-6"
              >
                <span className="font-display text-h3 transition-transform duration-500 ease-[var(--ease-out-expo)] md:group-hover:translate-x-3">
                  {social.label}
                </span>
                <span className="text-muted">{social.handle}</span>
                <span aria-hidden="true" className="text-accent-ink">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </section>

      {/* Место под форму обратной связи: появится здесь, вёрстку менять не придётся. */}
      <section className="container-x pb-24 md:pb-32" aria-labelledby="details">
        <h2 id="details" className="label">
          Реквизиты и адрес
        </h2>

        <Reveal
          as="dl"
          className="mt-6 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.08}
          y={24}
        >
          <div>
            <dt className="label">Город</dt>
            <dd className="mt-2">
              {site.city}, {site.timezone}
            </dd>
          </div>
          {site.legal.map((item) => (
            <div key={item.label}>
              <dt className="label">{item.label}</dt>
              <dd className="mt-2">{item.value}</dd>
            </div>
          ))}
        </Reveal>

        <p className="mt-10 max-w-[52ch] text-sm text-muted">
          Реквизиты указаны как заглушка и будут заменены на актуальные.
        </p>
      </section>
    </>
  );
}
