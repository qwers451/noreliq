import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/ui/PageHero";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Связаться с ${site.name}: ${site.email}, ${site.phone}. ${site.city}.`,
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <>
      <PageHero
        label="04 / Контакты"
        title="Расскажите, что нужно сделать"
        titleClassName="max-w-[16ch]"
        lead="Напишите пару строк о задаче и сроках — ответим в течение рабочего дня и предложим формат работы."
      />

      <section className="container-x section-b" aria-labelledby="direct">
        <h2 id="direct" className="sr-only">
          Прямые контакты
        </h2>

        <Reveal className="border-t border-line pt-8">
          <div>
            <a
              href={`mailto:${site.email}`}
              className="link-mask block break-words font-display text-[length:clamp(1.75rem,6.5vw,4.5rem)] leading-[1.1] hover:text-accent-ink"
            >
              {site.email}
            </a>
          </div>

          <div className="mt-6">
            <a
              href={`tel:${site.phoneHref}`}
              className="link-mask block font-display text-[length:clamp(1.5rem,4.5vw,3.25rem)] leading-[1.1] text-muted hover:text-fg"
            >
              {site.phone}
            </a>
          </div>

          {/* Соцсети живут здесь же: ради одной ссылки отдельный раздел не нужен. */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="link-mask inline-flex items-center gap-2 text-muted hover:text-fg"
              >
                {social.label}
                <span className="text-accent-ink">{social.handle}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-x" aria-labelledby="legal">
        <Reveal as="h2" id="legal" className="label">
          Реквизиты
        </Reveal>

        <Reveal
          as="dl"
          className="mt-6 grid gap-x-10 gap-y-6 border-t border-line pt-6 sm:grid-cols-2"
          stagger={0.06}
          y={16}
        >
          <div>
            <dt className="label">Сокращённое наименование</dt>
            <dd className="mt-1">{legal.shortName}</dd>
          </div>
          <div>
            <dt className="label">Полное наименование</dt>
            <dd className="mt-1">{legal.fullName}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="label">Адрес</dt>
            <dd className="mt-1">{legal.address}</dd>
          </div>
          <div>
            <dt className="label">Расчётный счёт</dt>
            <dd className="mt-1">
              {legal.bank.account} ({legal.bank.currency})
            </dd>
          </div>
          <div>
            <dt className="label">Банк</dt>
            <dd className="mt-1">{legal.bank.name}</dd>
          </div>
          <div>
            <dt className="label">БИК</dt>
            <dd className="mt-1">{legal.bank.bic}</dd>
          </div>
          <div>
            <dt className="label">Корр. счёт</dt>
            <dd className="mt-1">{legal.bank.corrAccount}</dd>
          </div>
          <div>
            <dt className="label">ИНН банка</dt>
            <dd className="mt-1">{legal.bank.inn}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="label">Адрес банка</dt>
            <dd className="mt-1">{legal.bank.address}</dd>
          </div>
        </Reveal>
      </section>
    </>
  );
}
