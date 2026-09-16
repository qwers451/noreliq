"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { homeHref, nav } from "@/content/nav";
import { site } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Блокируем скролл под открытым меню. */
  useEffect(() => {
    document.documentElement.classList.toggle("is-menu-open", open);
    return () => document.documentElement.classList.remove("is-menu-open");
  }, [open]);

  /* Каскад пунктов при открытии. */
  useEffect(() => {
    if (!open || reduced !== false) return;
    const el = menuRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-menu-item]"), {
        yPercent: 110,
        autoAlpha: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.1,
      });
    }, el);

    return () => ctx.revert();
  }, [open, reduced]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = () => setOpen(false);

  const isActive = (href: string) =>
    href === homeHref ? pathname === href : pathname.startsWith(href);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={clsx(
          "container-x pointer-events-auto flex h-[var(--header-h)] items-center justify-between transition-colors duration-300",
          open ? "text-inverse" : "text-fg",
        )}
      >
        <TransitionLink
          href={homeHref}
          className="block"
          aria-label={`${site.name} — на главную`}
        >
          <MagneticLink strength={0.25}>
            {/* На тёмном фоне открытого меню показываем светлую версию знака. */}
            <Image
              src={open ? "/brand/logo-full-light.png" : "/brand/logo-full.png"}
              alt={site.name}
              width={1991}
              height={790}
              sizes="140px"
              priority
              className="h-7 w-auto md:h-8"
            />
          </MagneticLink>
        </TransitionLink>

        <nav aria-label="Основная навигация" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  data-active={isActive(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="link-mask text-sm"
                >
                  <MagneticLink strength={0.25}>{item.label}</MagneticLink>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span
            className={clsx(
              "block h-px w-6 bg-current transition-transform duration-300",
              open && "translate-y-[3.5px] rotate-45",
            )}
          />
          <span
            className={clsx(
              "block h-px w-6 bg-current transition-transform duration-300",
              open && "-translate-y-[3.5px] -rotate-45",
            )}
          />
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="pointer-events-auto fixed inset-0 z-[-1] flex flex-col justify-between bg-fg px-[var(--gutter)] pb-10 pt-[var(--header-h)] text-inverse md:hidden"
      >
        <nav aria-label="Мобильная навигация" className="mt-12">
          <ul className="flex flex-col gap-2">
            {nav.map((item) => (
              <li key={item.href} className="overflow-hidden">
                <TransitionLink
                  href={item.href}
                  onClick={closeMenu}
                  data-menu-item
                  className="flex items-baseline gap-4 py-2 font-display text-[length:clamp(2.5rem,12vw,4rem)] leading-none"
                >
                  <span className="text-xs tracking-[0.16em] text-inverse/50">{item.index}</span>
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div data-menu-item className="flex flex-col gap-1 text-sm text-inverse/70">
          <a href={`mailto:${site.email}`} onClick={closeMenu} className="link-mask">
            {site.email}
          </a>
          <a href={`tel:${site.phoneHref}`} onClick={closeMenu} className="link-mask">
            {site.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
