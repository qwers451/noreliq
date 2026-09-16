import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { nav } from "@/content/nav";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    // Верхний отступ футера — единственная отбивка от последней секции:
    // у неё самой нижнего padding нет, иначе поля складывались бы.
    <footer className="container-x section-t border-t border-line pb-10">
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

      <Reveal className="mt-20 grid gap-10 md:grid-cols-4" stagger={0.08} y={24}>
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
      </Reveal>

      {/* Водяной знак: параллакс по скроллу, тот же компонент, что у обложек. */}
      <div className="mt-20 opacity-[0.08]" aria-hidden="true">
        <ParallaxImage
          src="/brand/logo-name.png"
          alt=""
          sizes="(max-width: 768px) 90vw, 70vw"
          // Рамка выше самого знака: остаётся запас, чтобы сдвиг не обрезал логотип.
          className="aspect-[2200/860] w-full"
          amount={14}
          fit="contain"
        />
      </div>

      {/* start=top bottom обязателен: строка стоит в последних пикселях страницы
          и до «top 95%» не доезжает никогда — с дефолтом она осталась бы скрытой. */}
      <Reveal
        as="div"
        className="mt-10 flex flex-col justify-between gap-2 text-sm text-muted md:flex-row"
        y={16}
        start="top bottom"
      >
        <span>
          © {year} {site.name}. {site.legalName}
        </span>
        <span>Все права защищены</span>
      </Reveal>
    </footer>
  );
}
