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

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scrollToTop } from "@/components/motion/SmoothScroll";
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

const PANELS = [0, 1, 2, 3, 4];

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
        ScrollTrigger.refresh();
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counter.value)),
    })
      .to(counterRef.current, { autoAlpha: 0, duration: 0.2 }, ">-0.1")
      .to(preloader, {
        yPercent: -100,
        duration: 0.6,
        ease: "power4.inOut",
      })
      .set(preloader, { display: "none" });

    return () => {
      tl.kill();
      document.documentElement.classList.remove("is-loading");
    };
  }, [reduced]);

  /* Переход «внутрь» новой страницы, когда маршрут уже сменился. */
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    scrollToTop();

    const curtain = curtainRef.current;
    if (reduced !== false || !curtain || !coveredRef.current) {
      ScrollTrigger.refresh();
      return;
    }

    const panels = curtain.querySelectorAll<HTMLElement>("[data-panel]");
    const tl = gsap.timeline({
      onComplete: () => {
        coveredRef.current = false;
        gsap.set(curtain, { visibility: "hidden", pointerEvents: "none" });
        ScrollTrigger.refresh();
      },
    });

    tl.to(panels, {
      yPercent: -100,
      duration: 0.6,
      ease: "power4.inOut",
      stagger: 0.05,
    }).set(panels, { yPercent: 100 });

    return () => {
      tl.kill();
    };
  }, [pathname, reduced]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;

      const curtain = curtainRef.current;
      if (reduced !== false || !curtain) {
        router.push(href);
        return;
      }

      coveredRef.current = true;
      gsap.set(curtain, { visibility: "visible", pointerEvents: "auto" });
      gsap.fromTo(
        curtain.querySelectorAll<HTMLElement>("[data-panel]"),
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.5,
          ease: "power4.inOut",
          stagger: 0.05,
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
      >
        {PANELS.map((panel) => (
          <div
            key={panel}
            data-panel
            className="h-full flex-1 bg-fg"
          />
        ))}
      </div>

      <div
        ref={preloaderRef}
        aria-hidden="true"
        className="motion-only fixed inset-0 z-[100] flex items-end justify-between bg-fg px-[var(--gutter)] pb-10 text-inverse"
      >
        <Image
          src="/brand/logo-full-light.png"
          alt={site.name}
          width={1991}
          height={790}
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
