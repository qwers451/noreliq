/**
 * Загрузчик картинок для статического экспорта.
 *
 * Нужен потому, что с `images.unoptimized` Next не подставляет basePath
 * в src у next/image — на GitHub Pages все картинки отдавали бы 404.
 * Оптимизации здесь нет: на статике её выполнять негде, отдаём исходник.
 */
export default function imageLoader({ src }: { src: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return src.startsWith("/") ? `${basePath}${src}` : src;
}
