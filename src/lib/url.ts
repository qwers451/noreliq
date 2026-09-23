import { site } from "@/content/site";

// На статике страницы отдаются со слэшем на конце, а без него хостинг
// отвечает редиректом — поисковики считают такие адреса ошибкой.
const slash = process.env.STATIC_EXPORT ? "/" : "";

/** Абсолютный адрес страницы — в том же виде, что canonical. */
export function pageUrl(path: string): string {
  return path === "/" ? `${site.url}/` : `${site.url}${path}${slash}`;
}

/** Абсолютный адрес файла (картинки, иконки) — без слэша на конце. */
export function fileUrl(path: string): string {
  return `${site.url}${path}`;
}
