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

import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scrollToTop } from "@/components/motion/SmoothScroll";
import { fieldForPath, fields } from "@/content/themes";
import { site } from "@/content/site";

type TransitionContextValue = {
  /** Проигрывает «шторку» и только потом меняет маршрут. */
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
});

export function useTransitionRouter() {
  return useContext(TransitionContext);
}

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
  const previousPath = useRef(pathname);
  const [progress, setProgress] = useState(0);

  /* Прелоадер первой загрузки. */
  useEffect(() => {
    if (reduced !== false) return;
    const preloader = preloaderRef.current;
    if (!preloader) return;

    document.documentElement.classList.add("is-loading");

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("is-loading");
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 0.45,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counter.value)),
    })
      .to(counterRef.current, { autoAlpha: 0, duration: 0.2 }, ">-0.1")
      .to(preloader, {
        autoAlpha: 0,
        duration: 0.45,
        ease: "power2.inOut",
      })
      .set(preloader, { display: "none" });

    return () => {
      tl.kill();
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

    const tl = gsap.timeline({
      onComplete: () => {
        coveredRef.current = false;
        gsap.set(curtain, { visibility: "hidden", pointerEvents: "none" });
      },
    });

    tl.to(curtain, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" });

    return () => {
      tl.kill();
    };
  }, [pathname, reduced]);

  const navigate = useCallback(
    (href: string) => {
      // В статическом экспорте у путей есть завершающий слеш, поэтому
      // сравниваем нормализованные значения.
      if (normalizePath(href) === normalizePath(pathname)) return;

      const curtain = curtainRef.current;
      if (reduced !== false || !curtain) {
        router.push(href);
        return;
      }

      // Заливка в цвет следующего раздела: переход читается как смена
      // цветового поля, без резких панелей.
      const next = fields[fieldForPath(href)];
      coveredRef.current = true;
      gsap.set(curtain, { backgroundColor: next.bg, pointerEvents: "auto" });
      gsap.fromTo(
        curtain,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.55,
          ease: "power2.inOut",
          onComplete: () => router.push(href),
        },
      );
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
