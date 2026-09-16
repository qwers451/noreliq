"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useTransitionRouter } from "@/components/motion/PageTransition";

type TransitionLinkProps = Omit<LinkProps, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    children: ReactNode;
  };

/**
 * Внутренняя ссылка, которая сначала проигрывает шторку перехода,
 * а уже потом меняет маршрут. Внешние ссылки ведут себя как обычные <a>.
 */
/**
 * В статическом экспорте Next не кладёт RSC-пейлоады туда, откуда их просит
 * роутер, — префетч отвечает 404 на каждое наведение. Переход при этом
 * отрабатывает штатно, поэтому на статике префетч просто выключаем.
 * На обычной серверной сборке он остаётся включённым.
 */
const PREFETCH = process.env.NEXT_PUBLIC_BASE_PATH ? false : undefined;

export function TransitionLink({ href, children, onClick, ...rest }: TransitionLinkProps) {
  const { navigate } = useTransitionRouter();
  const isInternal = href.startsWith("/");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!isInternal || event.defaultPrevented) return;
    // Не перехватываем модифицированные клики — пусть открывается в новой вкладке.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} prefetch={PREFETCH} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
