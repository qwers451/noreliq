import type { Metadata } from "next";

import { TransitionLink } from "@/components/motion/TransitionLink";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { nav } from "@/content/nav";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70svh] flex-col justify-center py-24">
      <span className="label">Ошибка 404</span>
      <h1 className="mt-6 max-w-[18ch] font-display text-display leading-[0.9]">
        Такой страницы нет
      </h1>
      <p className="mt-8 max-w-[44ch] text-lead text-muted">
        Возможно, ссылка устарела. Загляните в один из разделов сайта.
      </p>

      <ul className="mt-10 flex flex-wrap gap-6">
        {nav.map((item) => (
          <li key={item.href}>
            <MagneticLink strength={0.2}>
              <TransitionLink href={item.href} className="link-mask text-h3">
                {item.label}
              </TransitionLink>
            </MagneticLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
