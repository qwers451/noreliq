import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Poster } from "@/components/ui/Poster";
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
      <Poster caps="Давайте поработаем" note="расскажите о задаче" label="04 / Контакты" />

      {/* Контакты выведены отдельным блоком внутри того же экрана:
          у референса под заголовком идёт такой же центрированный столбик. */}
      <section className="container-x -mt-[26svh] pb-24 text-center">
        <Reveal className="flex flex-col items-center gap-1" immediate delay={0.3}>
          <a href={`mailto:${site.email}`} className="link-mask tap-target font-code">
            {site.email}
          </a>
          <a href={`tel:${site.phoneHref}`} className="link-mask tap-target font-code">
            {site.phone}
          </a>
          <p className="font-code opacity-70">{site.city}</p>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-5" delay={0.36} immediate>
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mono-label link-mask tap-target"
            >
              {social.label}
            </a>
          ))}
        </Reveal>
      </section>

      {/* Реквизиты обязательны для ИП, но на плакат не просятся —
          поэтому они ниже, за пределами первого экрана. */}
      <section className="container-x section-b" aria-labelledby="legal">
        <Reveal as="h2" id="legal" className="mono-label text-center opacity-60">
          Реквизиты
        </Reveal>

        <Reveal
          as="dl"
          className="mx-auto mt-8 grid max-w-3xl gap-x-10 gap-y-5 border-t border-line pt-8 sm:grid-cols-3"
          stagger={0.05}
          y={16}
        >
          {[
            ["Сокращённое наименование", legal.shortName],
            ["ИНН", legal.inn],
            ["ОГРНИП", legal.ogrnip],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="mono-label opacity-60">{term}</dt>
              <dd className="mt-1 font-code text-[0.875rem] leading-relaxed">{value}</dd>
            </div>
          ))}
        </Reveal>
      </section>
    </>
  );
}
