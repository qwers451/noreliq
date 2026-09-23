import { site } from "@/content/site";

/**
 * Нижняя строка вместо подвала: год основания слева, почта справа.
 * Как у референса —
 * лежит поверх цветового поля и не занимает отдельный экран.
 */
export function Footer() {
  return (
    // На очень низком экране (телефон боком) строка лежала поверх ленты
    // проектов: свайп по ней не листал карточки, а тап открывал почту.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 [@media(max-height:500px)]:hidden">
      <div className="container-x flex items-center justify-between pb-5">
        {/* Год основания, а не диапазон: студия появилась в 2026-м,
            и «2026/2026» выглядело бы как опечатка. */}
        <span className="mono-label pointer-events-auto opacity-70">
          Est. {site.foundedYear}
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
