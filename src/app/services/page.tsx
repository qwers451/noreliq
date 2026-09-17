import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { PageHero } from "@/components/ui/PageHero";
import { process, services } from "@/content/services";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Услуги Noreliq: веб-платформы и интеграции, карточки и AI-визуал для маркетплейсов, AI-видео, Telegram-боты и Mini Apps, AI-автоматизация, продвижение в AI-поиске.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="02 / Услуги"
        title="Пакеты работ"
        lead="Шесть направлений — от веб-платформ и маркетплейсов до AI-контента, Telegram, автоматизации и видимости в AI-поиске. Формат и стоимость собираем под задачу после короткого разговора."
      />

      <section className="container-x section-b" aria-labelledby="packages">
        <h2 id="packages" className="sr-only">
          Услуги
        </h2>

        <Reveal className="grid gap-6 md:grid-cols-2" stagger={0.1}>
          {services.map((category) => (
            <article
              key={category.id}
              className="flex flex-col border border-line p-7 transition-colors duration-500 hover:border-fg md:p-9"
            >
              {/* Код рубрики — строкой над заголовком, а не справа от него:
                  «AI AUTOMATION» с разрядкой не оставляет заголовку места
                  в узкой колонке и выталкивает его за край карточки. */}
              <span className="label block">
                {category.index} · {category.code}
              </span>
              <h3 className="mt-3 font-display text-h3">{category.title}</h3>

              <div className="mt-4 flex flex-col gap-3 text-muted">
                {category.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {/* Пара «тариф — цена» разъезжается по краям только там, где
                  обе строки помещаются рядом. В двухколоночной сетке до xl
                  карточка слишком узкая: название ломалось бы на две строки,
                  а цена повисала у первой — поэтому там цена идёт под ним. */}
              <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
                {category.tiers.map((tier) => (
                  <li
                    key={tier.title}
                    className="flex flex-col gap-x-4 xl:flex-row xl:items-baseline xl:justify-between"
                  >
                    <span>{tier.title}</span>
                    <span className="shrink-0 font-display">{tier.price}</span>
                  </li>
                ))}
              </ul>

              {category.footnote && (
                <p className="mt-6 text-sm leading-normal text-muted">{category.footnote}</p>
              )}

              <div className="mt-auto pt-8">
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
