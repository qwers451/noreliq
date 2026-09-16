import Image from "next/image";

import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { nav } from "@/content/nav";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="container-x border-t border-line pb-10 pt-24 md:pt-32">
      <SplitReveal as="p" className="label mb-6">
        Свободны для новых проектов
      </SplitReveal>

      <TransitionLink href="/contacts" className="group block">
        <SplitReveal
          as="span"
          className="block font-display text-display leading-[0.9] transition-colors duration-300 group-hover:text-accent-ink"
        >
          Обсудим проект
        </SplitReveal>
      </TransitionLink>

      <div className="mt-20 grid gap-10 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <span className="label">Связь</span>
          <a href={`mailto:${site.email}`} className="link-mask w-fit">
            {site.email}
          </a>
          <a href={`tel:${site.phoneHref}`} className="link-mask w-fit">
            {site.phone}
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <span className="label">Соцсети</span>
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="link-mask w-fit"
            >
              {social.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="label">Разделы</span>
          {nav.map((item) => (
            <TransitionLink key={item.href} href={item.href} className="link-mask w-fit">
              {item.label}
            </TransitionLink>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="label">Студия</span>
          <p className="text-muted">
            {site.city}, {site.timezone}
          </p>
          <MagneticLink strength={0.2} className="w-fit">
            <a href="#top" className="link-mask">
              Наверх
            </a>
          </MagneticLink>
        </div>
      </div>

      <div className="mt-20">
        <Image
          src="/brand/logo-name.png"
          alt={site.name}
          width={2200}
          height={715}
          sizes="(max-width: 768px) 90vw, 70vw"
          className="w-full opacity-[0.08]"
        />
      </div>

      <div className="mt-10 flex flex-col justify-between gap-2 text-sm text-muted md:flex-row">
        <span>
          © {year} {site.name}. {site.legalName}
        </span>
        <span>Все права защищены</span>
      </div>
    </footer>
  );
}
