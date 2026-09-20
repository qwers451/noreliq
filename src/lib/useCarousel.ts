"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

type Mode = "free" | "single";

type Controls = { go: (index: number) => void; step: (dir: number) => void };

type Options = {
  /** Число элементов в ленте: меняется — пересобираем замеры. */
  count: number;
  /** free — свободная прокрутка с доворотом, single — ровно по одному кадру. */
  mode?: Mode;
  /**
   * Где ловить колесо. По умолчанию — сама лента, но её высота меньше
   * экрана, и на странице проектов колесо над пустым местом не работало
   * бы вовсе: вертикально эта страница не прокручивается.
   */
  wheelSurface?: RefObject<HTMLElement | null>;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Горизонтальная лента на нативной прокрутке.
 *
 * Правило, ради которого хук существует: позицию ленты меняет ровно один
 * механизм. Раньше над одним контейнером одновременно работали CSS
 * scroll-snap, собственный rAF-лерп, перетаскивание мышью и инерция тача —
 * они писали scrollLeft наперегонки, отсюда рывки и «резина». Поэтому:
 *
 * - CSS scroll-snap не используется совсем, доворот делаем сами;
 * - сглаживание считается от времени кадра, а не от числа кадров, иначе
 *   на 120 Гц лента летит вдвое быстрее, а при просадках идёт ступенями;
 * - тач не перехватывается вовсе: родную инерцию системы скриптом не
 *   повторить, а попытки это сделать и давали лаги на телефоне;
 * - во время прокрутки React не перерисовывается — активный индекс
 *   пишется в состояние только когда он реально сменился.
 */
export function useCarousel({ count, mode = "free", wheelSurface }: Options) {
  const trackRef = useRef<HTMLDivElement>(null);
  /** Узел полосы прогресса: обновляется через CSS-переменную, без рендера. */
  const progressRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** Императивное управление: ссылки стабильны между рендерами. */
  const controls = useRef<Controls | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    /** Позиции scrollLeft, при которых i-й элемент стоит по центру. */
    let offsets: number[] = [];
    let target = track.scrollLeft;
    let current = -1;
    let frame = 0;
    let last = 0;
    let settleTimer = 0;
    let flagStart = true;
    let flagEnd = false;
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    let lastWheel = 0;

    const items = () => [...track.children] as HTMLElement[];
    const maxScroll = () => Math.max(track.scrollWidth - track.clientWidth, 0);

    /* --- замеры ------------------------------------------------------- */

    /** Ширина --gutter в пикселях: значение задано через clamp(), из
        getPropertyValue его не достать — меряем временным элементом. */
    const gutter = () => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:fixed;top:-9999px;left:0;width:var(--gutter)";
      document.body.appendChild(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return width;
    };

    const measure = () => {
      const cards = items();
      if (cards.length === 0) return;

      // Центрируем отступами, а не justify-center: у переполненного
      // flex-контейнера центрирование выталкивает контент за оба края,
      // но scrollLeft не уходит в минус — левая часть становится
      // недостижимой. С отступами первый элемент стоит по центру ровно
      // при scrollLeft = 0, а последний долистывается целиком.
      const edge = gutter();
      const view = track.clientWidth;
      const first = cards[0].getBoundingClientRect().width;
      const lastCard = cards[cards.length - 1].getBoundingClientRect().width;

      track.style.paddingInlineStart = `${Math.max(edge, (view - first) / 2)}px`;
      track.style.paddingInlineEnd = `${Math.max(edge, (view - lastCard) / 2)}px`;

      // Смещения храним без зажима по длине прокрутки: зажатые значения
      // у краёв схлопываются в одно число, и тогда и доворот, и счётчик
      // «кадр N из M» начинают врать. Зажимаем в момент использования.
      const trackLeft = track.getBoundingClientRect().left;
      offsets = cards.map((card) => {
        const box = card.getBoundingClientRect();
        const centre = box.left - trackLeft + track.scrollLeft + box.width / 2;
        return centre - track.clientWidth / 2;
      });

      if (!frame) target = track.scrollLeft;
      update();
    };

    /* --- состояние ---------------------------------------------------- */

    const nearest = (position: number) => {
      let best = 0;
      let bestDistance = Infinity;
      offsets.forEach((offset, index) => {
        const distance = Math.abs(offset - position);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      return best;
    };

    const update = () => {
      const limit = maxScroll();
      const position = track.scrollLeft;

      const progress = progressRef.current;
      if (progress) {
        progress.style.setProperty("--progress", String(limit > 0 ? position / limit : 1));
      }

      // Состояние пишем только при смене: иначе на каждом кадре инерции
      // перерисовывалась бы вся лента с картинками.
      const start_ = position <= 1;
      const end_ = position >= limit - 1;
      if (start_ !== flagStart) {
        flagStart = start_;
        setAtStart(start_);
      }
      if (end_ !== flagEnd) {
        flagEnd = end_;
        setAtEnd(end_);
      }

      const next = nearest(position);
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };

    /* --- движение ----------------------------------------------------- */

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      const delta = target - track.scrollLeft;
      if (Math.abs(delta) < 1) {
        track.scrollLeft = target;
        frame = 0;
        update();
        return;
      }

      // Сглаживание от времени, а не от кадра: одинаковая скорость
      // на 60 и 120 Гц и никаких ступеней при просадках.
      const eased = delta * (1 - Math.pow(0.0015, dt / 1000));
      // Браузер округляет scrollLeft до целых пикселей: шаг меньше
      // половины пикселя просто теряется, и лента замирает, не доехав
      // до цели. Поэтому у шага есть минимум.
      track.scrollLeft += Math.abs(eased) < 0.6 ? Math.sign(delta) * 0.6 : eased;
      update();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const go = (index: number) => {
      // Пересчитываем перед каждым переходом: ширина трека успевает
      // измениться (например, когда у страницы появляется вертикальная
      // полоса прокрутки), и кэш смещений уезжает на полполосы.
      measure();
      const next = clamp(index, 0, offsets.length - 1);
      target = clamp(offsets[next] ?? 0, 0, maxScroll());

      if (reduced !== false) {
        track.scrollLeft = target;
        update();
        return;
      }
      start();
    };

    const step = (dir: number) => go(current + dir);

    controls.current = { go, step };


    const scheduleSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => settle(), 140);
    };

    /** Доворот к ближайшему элементу после того, как жест закончился. */
    const settle = () => {
      if (offsets.length === 0) return;
      // Пока идёт жест или наша собственная анимация — ждём. Иначе доворот
      // перебивает цель на полпути и лента застревает, дёргаясь у края:
      // ровно та драка двух механизмов, от которой мы уходим.
      if (dragging || frame) {
        scheduleSettle();
        return;
      }
      measure();
      const to = clamp(offsets[nearest(track.scrollLeft)], 0, maxScroll());
      if (Math.abs(to - track.scrollLeft) < 1) return;
      target = to;
      if (reduced !== false) {
        track.scrollLeft = target;
        update();
        return;
      }
      start();
    };

    /* --- ввод --------------------------------------------------------- */

    const onScroll = () => {
      // Прокрутка пальцем или системой: цель догоняет фактическую позицию,
      // иначе после инерции лента прыгнет обратно к старой цели.
      if (!frame) {
        target = track.scrollLeft;
        scheduleSettle();
      }
      update();
    };

    const onWheel = (event: WheelEvent) => {
      const limit = maxScroll();
      const position = track.scrollLeft;
      const pass =
        limit <= 0 ||
        // Горизонтальный жест трекпада отдаём браузеру: он делает это лучше.
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        // У краёв отдаём прокрутку странице, иначе её не пролистать.
        (position <= 1 && event.deltaY < 0) ||
        (position >= limit - 1 && event.deltaY > 0);

      // Пока лента может двигаться, колесо забираем себе и запрещаем Lenis
      // крутить страницу; у краёв атрибут снимаем — иначе на последнем кадре
      // страница застревала бы намертво. Наш обработчик висит глубже, поэтому
      // Lenis увидит уже обновлённое состояние этого же события.
      surface.toggleAttribute("data-lenis-prevent", !pass);
      if (pass) return;

      event.preventDefault();

      if (mode === "single") {
        const now = performance.now();
        if (now - lastWheel < 320) return;
        lastWheel = now;
        step(Math.sign(event.deltaY));
        return;
      }

      target = clamp(target + event.deltaY, 0, limit);
      if (reduced !== false) {
        track.scrollLeft = target;
        update();
        return;
      }
      start();
      scheduleSettle();
    };

    /* Перетаскивание только мышью. Тач не трогаем: нативная инерция
       лучше любой самодельной, а её перехват и ломал мобильную версию. */
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startLeft = track.scrollLeft;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      // Порог 6px: дрожание руки при клике не считаем жестом, иначе
      // карточка перестаёт открываться.
      if (Math.abs(delta) > 6) moved = true;
      if (!moved) return;
      event.preventDefault();
      track.scrollLeft = clamp(startLeft - delta, 0, maxScroll());
      target = track.scrollLeft;
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      settle();
      // Клик приходит сразу после отпускания и должен узнать,
      // что это было перетаскивание.
      if (moved) window.setTimeout(() => (moved = false), 0);
    };

    const onDragStart = (event: Event) => event.preventDefault();

    const onClickCapture = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };

    /* --- подписки ----------------------------------------------------- */

    // Следим и за треком, и за элементами: в dev стили приезжают после
    // первого кадра, и замер по «голой» раскладке даёт мусорные смещения.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    items().forEach((card) => observer.observe(card));

    measure();
    // Повторный замер, когда шрифты дошли до раскладки: ширина подписей
    // под кадрами меняется, а вместе с ней и центры.
    document.fonts?.ready.then(measure).catch(() => {});

    const surface = wheelSurface?.current ?? track;

    track.addEventListener("scroll", onScroll, { passive: true });
    surface.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("dragstart", onDragStart);
    track.addEventListener("keydown", onKeyDown);
    track.addEventListener("click", onClickCapture, true);
    // Картинки меняют ширину при загрузке — событие load не всплывает,
    // поэтому слушаем на фазе перехвата и пересчитываем замеры.
    track.addEventListener("load", measure, true);
    // Окно, а не трек: курсор во время жеста уходит на картинку.
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const hasScrollEnd = "onscrollend" in track;
    if (hasScrollEnd) track.addEventListener("scrollend", settle);

    return () => {
      observer.disconnect();
      window.clearTimeout(settleTimer);
      if (frame) cancelAnimationFrame(frame);
      controls.current = null;

      track.removeEventListener("scroll", onScroll);
      surface.removeEventListener("wheel", onWheel);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("dragstart", onDragStart);
      track.removeEventListener("keydown", onKeyDown);
      track.removeEventListener("click", onClickCapture, true);
      track.removeEventListener("load", measure, true);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (hasScrollEnd) track.removeEventListener("scrollend", settle);
    };
  }, [count, mode, reduced, wheelSurface]);

  const goTo = useCallback((index: number) => controls.current?.go(index), []);
  const step = useCallback((dir: number) => controls.current?.step(dir), []);

  return { trackRef, progressRef, active, atStart, atEnd, goTo, step };
}
