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
 * механизм. CSS scroll-snap не используется совсем — доворот делаем сами,
 * иначе браузер ведёт вторую анимацию поверх нашей. Тач не перехватывается:
 * родную инерцию системы скриптом не повторить.
 *
 * Движение — твин с явной длительностью, а не затухание «к цели». Причина
 * физическая: scrollLeft у браузера целочисленный, и всё, что движется
 * медленнее пикселя за кадр, рисуется рывками по 1 px. У экспоненциального
 * затухания хвост бесконечный, и последние полсекунды любого жеста как раз
 * попадали в эту зону — отсюда оставалась дёрганость. Твин же держит
 * скорость выше пикселя за кадр почти до самого конца.
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
    /** Геометрия трека. Кэш: читать её в каждом кадре — значит заставлять
        браузер пересчитывать раскладку сразу после записи scrollLeft. */
    let limit = 0;
    let view = 0;

    let position = track.scrollLeft;
    let target = position;
    /* Текущий твин: откуда, куда, когда начался и сколько длится. */
    let from = position;
    let startedAt = 0;
    let duration = 0;
    let current = -1;
    let frame = 0;
    let settleTimer = 0;
    let flagStart = true;
    let flagEnd = false;
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    let lastWheel = 0;
    /** Позиция, с которой началась текущая серия событий колеса. */
    let burstFrom = 0;
    /** Сырой накопитель колеса внутри серии: по нему выбираем карточку. */
    let raw = 0;

    const items = () => [...track.children] as HTMLElement[];

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
      view = track.clientWidth;
      const first = cards[0].getBoundingClientRect().width;
      const lastCard = cards[cards.length - 1].getBoundingClientRect().width;

      track.style.paddingInlineStart = `${Math.max(edge, (view - first) / 2)}px`;
      track.style.paddingInlineEnd = `${Math.max(edge, (view - lastCard) / 2)}px`;

      limit = Math.max(track.scrollWidth - view, 0);

      // Смещения храним без зажима по длине прокрутки: зажатые значения
      // у краёв схлопываются в одно число, и тогда и доворот, и счётчик
      // «кадр N из M» начинают врать. Зажимаем в момент использования.
      const trackLeft = track.getBoundingClientRect().left;
      offsets = cards.map((card) => {
        const box = card.getBoundingClientRect();
        return box.left - trackLeft + track.scrollLeft + box.width / 2 - view / 2;
      });

      if (!frame) sync();
      update();
    };

    /** Подхватить фактическую позицию: после инерции пальца или жеста. */
    const sync = () => {
      position = track.scrollLeft;
      target = position;
    };

    /* --- состояние ---------------------------------------------------- */

    const nearest = (at: number) => {
      let best = 0;
      let bestDistance = Infinity;
      offsets.forEach((offset, index) => {
        const distance = Math.abs(offset - at);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      return best;
    };

    const snapped = (at: number) => clamp(offsets[nearest(at)] ?? 0, 0, limit);

    /** Только арифметика по кэшу: ни одного чтения раскладки за кадр. */
    const update = () => {
      const at = position;

      const progress = progressRef.current;
      if (progress) {
        progress.style.setProperty("--progress", String(limit > 0 ? at / limit : 1));
      }

      // Состояние пишем только при смене: иначе на каждом кадре инерции
      // перерисовывалась бы вся лента с картинками.
      const isStart = at <= 1;
      const isEnd = at >= limit - 1;
      if (isStart !== flagStart) {
        flagStart = isStart;
        setAtStart(isStart);
      }
      if (isEnd !== flagEnd) {
        flagEnd = isEnd;
        setAtEnd(isEnd);
      }

      const next = nearest(at);
      if (next === current) return;

      // Активный элемент помечаем атрибутом, а не пересборкой списка в
      // React: оформление висит на CSS-селекторе, и смена активной карточки
      // стоит двух записей в DOM вместо перерисовки всех картинок.
      const cards = items();
      cards[current]?.setAttribute("data-active", "false");
      cards[next]?.setAttribute("data-active", "true");
      current = next;
      setActive(next);
    };

    /* --- движение ----------------------------------------------------- */

    /* Показатель 2.4 — компромисс: мягкое торможение, но без длинного
       хвоста, где шаг меньше пикселя и движение видно рывками. */
    const ease = (x: number) => 1 - Math.pow(1 - x, 2.4);

    const tick = (now: number) => {
      // Прогресс обязательно зажимаем снизу: метка времени у rAF — это
      // начало кадра, а обработчик события, запустивший твин, выполняется
      // уже внутри этого кадра и ставит startedAt позже. Без зажима первый
      // кадр получал отрицательный прогресс, и лента отыгрывала назад —
      // ровно тот рывок на каждом щелчке колеса.
      const progressed = duration > 0 ? clamp((now - startedAt) / duration, 0, 1) : 1;
      position = from + (target - from) * ease(progressed);

      if (progressed >= 1) {
        position = target;
        frame = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }

      track.scrollLeft = Math.round(position);
      update();
    };

    /** Поставить цель и доехать до неё. */
    const moveTo = (to: number) => {
      target = clamp(to, 0, limit);

      if (reduced !== false || Math.abs(target - position) < 0.5) {
        position = target;
        track.scrollLeft = Math.round(position);
        update();
        if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
        return;
      }

      // Твин всегда стартует от текущей позиции, поэтому его можно
      // перезапускать хоть каждым событием колеса — разрыва не будет.
      from = position;
      startedAt = performance.now();
      duration = clamp(Math.abs(target - from) * 1.5, 240, 620);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const go = (index: number) => {
      // Пересчитываем перед каждым переходом: ширина трека успевает
      // измениться (например, когда у страницы появляется вертикальная
      // полоса прокрутки), и кэш смещений уезжает на полполосы.
      measure();
      moveTo(offsets[clamp(index, 0, offsets.length - 1)] ?? 0);
    };

    const step = (dir: number) => go(current + dir);

    controls.current = { go, step };

    /**
     * Доворот после того, как лента остановилась сама. Нужен только для
     * нативной инерции тача: там позиция не наша, и поймать конец жеста
     * можно лишь по факту остановки.
     */
    const settle = () => {
      if (offsets.length === 0) return;
      if (dragging || frame) {
        scheduleSettle();
        return;
      }
      measure();
      const to = snapped(track.scrollLeft);
      if (Math.abs(to - track.scrollLeft) < 1) return;
      moveTo(to);
    };

    const scheduleSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 140);
    };

    /* --- ввод --------------------------------------------------------- */

    const onScroll = () => {
      // Прокрутка пальцем или системой: цель догоняет фактическую позицию,
      // иначе после инерции лента прыгнет обратно к старой цели.
      if (frame) return;
      sync();
      update();
      scheduleSettle();
    };

    const onWheel = (event: WheelEvent) => {
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

      const now = performance.now();
      // Новая серия щелчков начинается после паузы: с этой точки считаем,
      // куда пользователь «повёл» ленту.
      if (now - lastWheel > 220) {
        burstFrom = position;
        raw = position;
      }
      lastWheel = now;
      raw = clamp(raw + event.deltaY, 0, limit);

      // Целью сразу становится центр карточки, а не сырая позиция колеса.
      // Тогда лента одним непрерывным движением доезжает куда нужно и ей
      // не приходится потом отыгрывать назад: именно этот откат в конце
      // жеста и читался как рывок. Доворачиваем только по направлению
      // жеста — один щелчок всегда переводит на соседнюю карточку, а не
      // возвращает на исходную.
      const forward = raw >= burstFrom;
      let index = nearest(raw);
      if (forward && offsets[index] <= burstFrom + 1) index += 1;
      if (!forward && offsets[index] >= burstFrom - 1) index -= 1;
      moveTo(offsets[clamp(index, 0, offsets.length - 1)] ?? raw);
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
      position = clamp(startLeft - delta, 0, limit);
      target = position;
      track.scrollLeft = Math.round(position);
      update();
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      if (moved) moveTo(snapped(position));
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
