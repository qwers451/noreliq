"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { scrollToTop } from "@/components/motion/SmoothScroll";
import { fieldForPath, fields } from "@/content/themes";
import { site } from "@/content/site";

/** Точка на экране, откуда расходится волна перехода. */
export type TransitionOrigin = { x: number; y: number };

type TransitionContextValue = {
  /** Проигрывает «шторку» и только потом меняет маршрут. */
  navigate: (href: string, origin?: TransitionOrigin) => void;
};

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
});

export function useTransitionRouter() {
  return useContext(TransitionContext);
}

/** Кривая совпадает с --ease-in-out-quart из globals.css. */
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
/** Кривая совпадает с --ease-out-expo: быстрый старт, мягкая остановка. */
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Длительность волны перехода. */
const WAVE_MS = 650;
/**
 * Когда начинать загрузку следующей страницы. На 70% пути волна по этой
 * кривой уже почти закрыла экран, и подмену не видно. Если ждать конца
 * волны, загрузка шла уже после неё, и экран висел залитым цветом.
 */
const PUSH_AT_MS = WAVE_MS * 0.7;

/**
 * При `trailingSlash: true` (статический экспорт) `usePathname()` отдаёт путь
 * со слэшем на конце, а ссылки в `nav.ts` — без него. Без нормализации
 * переход на текущую страницу не совпадает с pathname, шторка закрывает
 * экран и остаётся так навсегда: `router.push` на тот же маршрут не меняет
 * pathname, и «открывающий» эффект просто не запускается.
 */
const normalizePath = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();

  const curtainRef = useRef<HTMLDivElement>(null);
  const coveredRef = useRef(false);
  /** Анимации шторки: при новом переходе старые гасим, иначе они копятся
      с fill: forwards и перебивают друг друга. */
  const curtainAnims = useRef<Animation[]>([]);
  const pushTimer = useRef(0);
  const previousPath = useRef(pathname);

  /* Когда маршрут сменился — плавно уводим заливку. */
  useEffect(() => {
    if (normalizePath(previousPath.current) === normalizePath(pathname)) return;
    previousPath.current = pathname;

    scrollToTop();

    const curtain = curtainRef.current;
    if (reduced !== false || !curtain || !coveredRef.current) return;

    // Под волной уже поле нового раздела того же цвета, так что растворение
    // заливки читается как проявление страницы, а не как вторая шторка.
    // Быстрый старт растворения: с плавным разгоном текст новой страницы
    // первые ~200 мс почти не проступал сквозь заливку.
    const open = curtain.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 450,
      easing: EASE_OUT,
      fill: "forwards",
    });
    curtainAnims.current.push(open);
    open.onfinish = () => {
      coveredRef.current = false;
      document.documentElement.classList.remove("is-switching");
      curtain.style.visibility = "hidden";
      curtain.style.pointerEvents = "none";
      curtainAnims.current.forEach((animation) => animation.cancel());
      curtainAnims.current = [];
    };

    return () => {
      open.cancel();
    };
  }, [pathname, reduced]);

  const navigate = useCallback(
    (href: string, origin?: TransitionOrigin) => {
      // В статическом экспорте у путей есть завершающий слеш, поэтому
      // сравниваем нормализованные значения.
      if (normalizePath(href) === normalizePath(pathname)) return;

      const curtain = curtainRef.current;
      if (reduced !== false || !curtain) {
        router.push(href);
        return;
      }

      // Волна цвета следующего раздела расходится от точки нажатия и
      // заливает экран: переход читается как смена цветового поля.
      const next = fields[fieldForPath(href)];
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      // Радиус — до самого дальнего угла, иначе круг не закроет экран.
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      // Прерванный переход (второй клик во время волны) гасим целиком:
      // иначе его таймер всё равно увёл бы на первый адрес.
      curtainAnims.current.forEach((animation) => animation.cancel());
      window.clearTimeout(pushTimer.current);
      coveredRef.current = true;
      document.documentElement.classList.add("is-switching");
      curtain.style.backgroundColor = next.bg;
      curtain.style.pointerEvents = "auto";
      curtain.style.visibility = "visible";

      const cover = curtain.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
        ],
        { duration: WAVE_MS, easing: EASE, fill: "forwards" },
      );
      curtainAnims.current = [cover];
      // Роутер держит старую страницу, пока грузит новую, поэтому загрузка
      // идёт параллельно с хвостом волны, а не после неё.
      pushTimer.current = window.setTimeout(() => router.push(href), PUSH_AT_MS);
    },
    [pathname, reduced, router],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      <div
        ref={curtainRef}
        aria-hidden="true"
        className="motion-only invisible pointer-events-none fixed inset-0 z-[90]"
      />

      {/* Прелоадер первой загрузки целиком на CSS: см. [data-preloader]
          в globals.css. Скрипты ему не нужны — он играет с первой отрисовки. */}
      <div
        data-preloader
        aria-hidden="true"
        className="motion-only fixed inset-0 z-[100] flex items-end justify-between bg-fg px-[var(--gutter)] pb-10 text-inverse"
      >
        <Image
          src="/brand/logo-full-light.webp"
          alt={site.name}
          width={960}
          height={381}
          sizes="(max-width: 768px) 55vw, 320px"
          priority
          className="h-10 w-auto md:h-14"
        />
        <span
          data-preloader-count
          className="font-display text-[length:clamp(2rem,6vw,4rem)] leading-none tabular-nums text-accent"
        />
      </div>
    </TransitionContext.Provider>
  );
}
