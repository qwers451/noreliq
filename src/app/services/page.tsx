import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Poster } from "@/components/ui/Poster";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Веб-платформы, карточки для маркетплейсов, AI-видео, боты и Mini Apps. Форматы работ и цены Noreliq.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Poster label="02 / Услуги" caps="Что мы умеем" italic="форматы работ и цены" />

      {/* Список направлений: крупная антиква и цены моноширинным —
          без описаний на несколько абзацев. */}
      <section className="container-x -mt-[22svh] pb-[var(--section-y)]">
        <div className="mx-auto max-w-4xl">
          {services.map((service, index) => (
            <Reveal
              key={service.id}
              as="article"
              className="border-t border-line py-10 text-center"
              y={20}
              delay={index === 0 ? 0.3 : 0}
            >
              <p className="mono-label opacity-60">
                {service.index} / {service.code}
              </p>

              <h2 className="display-caps mt-4 text-h2">{service.title}</h2>

              <p className="poster-lead mt-4 opacity-80">{service.summary}</p>

              <dl className="mx-auto mt-7 flex max-w-xl flex-col gap-2">
                {service.tiers.map((tier) => (
                  <div
                    key={tier.title}
                    className="flex flex-wrap items-baseline justify-center gap-x-3 sm:flex-nowrap"
                  >
                    <dt className="opacity-80 sm:shrink-0">{tier.title}</dt>
                    {/* Линия-выноска только там, где строка помещается целиком. */}
                    <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:block" />
                    <dd className="sm:shrink-0">{tier.price}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}

          <Reveal className="mt-14 flex flex-col items-center gap-6" y={20}>
            <span aria-hidden="true" className="hairline" />
            <TransitionLink href="/contacts" className="mono-label link-mask tap-target">
              Обсудить задачу
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
