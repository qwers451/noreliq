import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { PageHero } from "@/components/ui/PageHero";
import { process, services } from "@/content/services";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Пакеты работ Noreliq: лендинг, корпоративный сайт, продукт и интерфейс, поддержка и развитие. Стоимость — по запросу.",
  alternates: { canonical: "/services" },
};

/** Цена пока не указывается: price === null → «по запросу». */
function formatPrice(price: number | null) {
  if (price === null) return "По запросу";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="02 / Услуги"
        title="Пакеты работ"
        lead="Формат подбираем под задачу: от быстрого лендинга до продукта с дизайн-системой и долгой поддержкой. Стоимость считаем после короткого разговора."
      />

      <section className="container-x section-b" aria-labelledby="packages">
        <h2 id="packages" className="sr-only">
          Тарифные пакеты
        </h2>

        <Reveal className="grid gap-6 md:grid-cols-2" stagger={0.1}>
          {services.map((service) => (
            <article
              key={service.id}
              className="flex flex-col border border-line p-7 transition-colors duration-500 hover:border-fg md:p-9"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-h3">{service.title}</h3>
                <span className="label shrink-0">{service.duration}</span>
              </div>

              <p className="mt-4 text-muted">{service.summary}</p>

              <ul className="mt-8 flex flex-col gap-2 border-t border-line pt-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span aria-hidden="true" className="text-accent-ink">
                      →
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-end justify-between gap-4 border-t border-line pt-6">
                <div>
                  <span className="label block">Стоимость</span>
                  <span className="mt-1 block font-display text-h3">
                    {formatPrice(service.price)}
                  </span>
                </div>
                <TransitionLink href="/contacts" className="btn-accent">
                  Обсудить
                  <span aria-hidden="true">→</span>
                </TransitionLink>
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="container-x" aria-labelledby="process">
        <Reveal as="h2" id="process" className="text-h2">
          Как идёт работа
        </Reveal>

        <Reveal as="ol" className="mt-12 border-t border-line" stagger={0.1} y={30}>
          {process.map((step) => (
            <li
              key={step.index}
              className="grid gap-3 border-b border-line py-8 md:grid-cols-[3rem_1fr_1.2fr] md:gap-x-4 md:gap-y-3"
            >
              <span className="label">{step.index}</span>
              <h3 className="font-display text-h3">{step.title}</h3>
              <p className="text-muted">{step.description}</p>
            </li>
          ))}
        </Reveal>
      </section>
    </>
  );
}
