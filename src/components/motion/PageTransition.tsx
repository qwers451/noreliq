"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
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
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const coveredRef = useRef(false);
  /** Анимации шторки: при новом переходе старые гасим, иначе они копятся
      с fill: forwards и перебивают друг друга. */
  const curtainAnims = useRef<Animation[]>([]);
  const previousPath = useRef(pathname);
  const [progress, setProgress] = useState(0);

  /* Прелоадер первой загрузки. */
  useEffect(() => {
    if (reduced !== false) return;
    const preloader = preloaderRef.current;
    if (!preloader) return;

    document.documentElement.classList.add("is-loading");

    let frame = 0;
    let fade: Animation | undefined;
    const started = performance.now();

    const count = (now: number) => {
      const passed = Math.min((now - started) / 450, 1);
      // Та же кривая, что была у счётчика: разгон и мягкая остановка.
      const eased = passed < 0.5 ? 2 * passed * passed : 1 - 2 * (1 - passed) ** 2;
      setProgress(Math.round(eased * 100));

      if (passed < 1) {
        frame = requestAnimationFrame(count);
        return;
      }
      frame = 0;

      counterRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        fill: "forwards",
      });
      fade = preloader.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 450,
        delay: 150,
        easing: EASE,
        fill: "forwards",
      });
      fade.onfinish = () => {
        preloader.style.display = "none";
        document.documentElement.classList.remove("is-loading");
      };
    };

    frame = requestAnimationFrame(count);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      fade?.cancel();
      document.documentElement.classList.remove("is-loading");
    };
  }, [reduced]);

  /* Когда маршрут сменился — плавно уводим заливку. */
  useEffect(() => {
    if (normalizePath(previousPath.current) === normalizePath(pathname)) return;
    previousPath.current = pathname;

    scrollToTop();

    const curtain = curtainRef.current;
    if (reduced !== false || !curtain || !coveredRef.current) return;

    // Под волной уже поле нового раздела того же цвета, так что растворение
    // заливки читается как проявление страницы, а не как вторая шторка.
    const open = curtain.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 550,
      easing: EASE,
      fill: "forwards",
    });
    curtainAnims.current.push(open);
    open.onfinish = () => {
      coveredRef.current = false;
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
      // иначе его onfinish всё равно увёл бы на первый адрес.
      curtainAnims.current.forEach((animation) => animation.cancel());
      coveredRef.current = true;
      curtain.style.backgroundColor = next.bg;
      curtain.style.pointerEvents = "auto";
      curtain.style.visibility = "visible";

      const cover = curtain.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
        ],
        { duration: 750, easing: EASE, fill: "forwards" },
      );
      curtainAnims.current = [cover];
      cover.onfinish = () => router.push(href);
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

      <div
        ref={preloaderRef}
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
          ref={counterRef}
          className="font-display text-[length:clamp(2rem,6vw,4rem)] leading-none tabular-nums text-accent"
        >
          {progress}
        </span>
      </div>
    </TransitionContext.Provider>
  );
}
