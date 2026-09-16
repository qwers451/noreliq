import clsx from "clsx";

type MarqueeProps = {
  items: readonly string[];
  className?: string;
  /** Длительность одного прохода в секундах. */
  duration?: number;
};

/**
 * Бегущая строка на CSS. Анимация включена только под .motion-ok,
 * поэтому при prefers-reduced-motion строка просто стоит на месте.
 */
export function Marquee({ items, className, duration = 28 }: MarqueeProps) {
  return (
    <div
      className={clsx("marquee relative flex w-full overflow-hidden", className)}
    >
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 ? "true" : undefined}
          className="marquee-track flex shrink-0 items-center gap-10 pr-10"
          style={{ animationDuration: `${duration}s` }}
        >
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex shrink-0 items-center gap-10 font-display text-h3 whitespace-nowrap"
            >
              {item}
              <span aria-hidden="true" className="text-accent">
                *
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
