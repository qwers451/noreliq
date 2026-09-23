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
 * В статическом экспорте Next не кладёт RSC-пейлоады туда, откуда их просит
 * префетч, — каждая ссылка на экране давала 404 в консоли. Сам переход
 * берёт другой файл и отрабатывает штатно, поэтому на статике префетч
 * выключаем. Признак — именно экспорт, а не basePath: на своём домене
 * префикса нет, а экспорт остаётся.
 */
const PREFETCH = process.env.STATIC_EXPORT ? false : undefined;

/**
 * Внутренняя ссылка, которая сначала проигрывает шторку перехода,
 * а уже потом меняет маршрут. Внешние ссылки ведут себя как обычные <a>.
 */
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
    // Волна перехода идёт от точки нажатия. У клика с клавиатуры (Enter)
    // координат нет — detail у него 0, — тогда берём центр самой ссылки.
    const box = event.currentTarget.getBoundingClientRect();
    const origin =
      event.detail === 0
        ? { x: box.left + box.width / 2, y: box.top + box.height / 2 }
        : { x: event.clientX, y: event.clientY };
    navigate(href, origin);
  };

  return (
    <Link href={href} prefetch={PREFETCH} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
