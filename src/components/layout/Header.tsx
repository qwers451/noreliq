"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { TransitionLink } from "@/components/motion/TransitionLink";
import { fieldForPath, fields } from "@/content/themes";
import { homeHref, nav } from "@/content/nav";
import { site } from "@/content/site";

/**
 * Шапка-минимум, как у референса: знак слева, мелкое меню капсом справа.
 * Никаких подложек и теней — она лежит прямо на цветовом поле страницы.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("is-menu-open", open);
    return () => document.documentElement.classList.remove("is-menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const darkField = fields[fieldForPath(pathname)].dark;

  const isActive = (href: string) =>
    href === homeHref ? pathname === href : pathname.startsWith(href);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="container-x pointer-events-auto flex h-[var(--header-h)] items-center justify-between">
        <TransitionLink
          href={homeHref}
          className="block"
          aria-label={`${site.name} — на главную`}
          onClick={() => setOpen(false)}
        >
          {/* На тёмных полях знак берём в светлой версии, иначе графит
              сливается с фоном. */}
          <Image
            src={darkField ? "/brand/logo-mark-light.webp" : "/brand/logo-mark.webp"}
            alt={site.name}
            width={160}
            height={133}
            sizes="34px"
            priority
            className="h-[34px] w-auto"
          />
        </TransitionLink>

        <nav aria-label="Основная навигация" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  data-active={isActive(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="mono-label link-mask"
                >
                  {item.label}
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
          className="mono-label relative z-10 md:hidden"
        >
          {open ? "Закрыть" : "Меню"}
        </button>
      </div>

      {/* Меню не прячем через hidden: тогда оно появляется рывком.
          Держим в потоке и анимируем прозрачность с лёгким подъёмом. */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={clsx(
          "fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-6 bg-bg px-[var(--gutter)] text-center transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] md:hidden",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        {nav.map((item, index) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={clsx(
              "display-caps text-[length:clamp(2rem,10vw,3rem)] transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
            style={{ transitionDelay: open ? `${120 + index * 70}ms` : "0ms" }}
            tabIndex={open ? undefined : -1}
          >
            {item.label}
          </TransitionLink>
        ))}

        <a
          href={`mailto:${site.email}`}
          onClick={() => setOpen(false)}
          className={clsx(
            "mono-label link-mask mt-6 transition-opacity duration-700",
            open ? "opacity-70" : "opacity-0",
          )}
          style={{ transitionDelay: open ? "400ms" : "0ms" }}
          tabIndex={open ? undefined : -1}
        >
          {site.email}
        </a>
      </div>
    </header>
  );
}
