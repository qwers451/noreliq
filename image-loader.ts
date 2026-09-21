import widths from "./src/content/image-widths.json";

/**
 * Загрузчик картинок.
 *
 * Используется всегда, а не только на Pages: на статическом экспорте
 * оптимизатора next/image нет в принципе, и если полагаться на него в
 * разработке, локально видишь одно, а на сайте другое. Вместо него —
 * варианты, нарезанные заранее (scripts/responsive-images.mjs).
 *
 * Побочно это убирает повторное сжатие: оптимизатор пережимал и без того
 * сжатый webp, и мелкий текст на снимках интерфейсов заметно плыл.
 */

// Совпадает с images.deviceSizes в next.config.ts и WIDTHS в скрипте нарезки.
const WIDTHS = [480, 960, 1440, 2000];

const sizes = widths as Record<string, number>;

export default function imageLoader({ src, width }: { src: string; width: number }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!src.startsWith("/")) return src;

  const original = sizes[src];
  // Берём самый узкий вариант, которого хватает. Если такого нет (или файл
  // вне нарезки — логотипы) отдаём исходник: он и есть верхний кандидат.
  const pick = original ? WIDTHS.find((w) => w >= width && w < original) : undefined;
  const file = pick ? src.replace(/\.webp$/, `-${pick}.webp`) : src;

  return `${basePath}${file}`;
}
