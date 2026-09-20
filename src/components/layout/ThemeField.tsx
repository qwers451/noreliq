"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { fieldForPath, fields } from "@/content/themes";

/**
 * Красит страницу в цвет её раздела. Значения кладём в CSS-переменные на
 * <html>, поэтому заливка распространяется на всё — включая области за
 * пределами контента при резиновой прокрутке.
 */
export function ThemeField() {
  const pathname = usePathname();

  useEffect(() => {
    const field = fields[fieldForPath(pathname)];
    const root = document.documentElement;

    root.dataset.field = field.key;
    root.style.setProperty("--color-bg", field.bg);
    root.style.setProperty("--color-fg", field.ink);
    root.style.setProperty("--color-accent", field.accent);
    root.style.setProperty("--color-line", field.line);
  }, [pathname]);

  return null;
}
