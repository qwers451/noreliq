import { site } from "@/content/site";

/**
 * Нижняя строка вместо подвала: годы слева, почта справа. Как у референса —
 * лежит поверх цветового поля и не занимает отдельный экран.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="container-x flex items-center justify-between pb-5">
        <span className="mono-label pointer-events-auto opacity-70">
          {site.foundedYear}/{year}
        </span>

        <a
          href={`mailto:${site.email}`}
          className="mono-label link-mask tap-target pointer-events-auto hidden opacity-70 transition-opacity hover:opacity-100 sm:inline-flex"
        >
          {site.email}
        </a>
      </div>
    </div>
  );
}
