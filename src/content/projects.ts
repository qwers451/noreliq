export type ProjectBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "image"; src: string; alt: string; wide?: boolean }
  | { type: "quote"; body: string; author: string }
  | { type: "stats"; items: { value: string; label: string }[] };

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  role: string;
  tags: string[];
  cover: string;
  summary: string;
  blocks: ProjectBlock[];
};

/** Контент-заглушка. Меняется здесь, вёрстка страниц не трогается. */
export const projects: Project[] = [
  {
    slug: "atlas-platform",
    title: "Atlas",
    client: "Atlas Group",
    year: "2025",
    role: "Дизайн, фронтенд",
    tags: ["Платформа", "Дизайн-система"],
    cover: "/placeholders/project-01.svg",
    summary:
      "Платформа для управления распределёнными командами: единый интерфейс вместо пяти разрозненных сервисов.",
    blocks: [
      {
        type: "text",
        title: "Задача",
        body:
          "Клиент пришёл с набором внутренних инструментов, выросших стихийно. Нужно было собрать их в один продукт, не потеряв привычные сценарии команд.",
      },
      {
        type: "image",
        src: "/placeholders/project-01-a.svg",
        alt: "Экран платформы Atlas",
        wide: true,
      },
      {
        type: "text",
        title: "Решение",
        body:
          "Спроектировали навигацию вокруг задач, а не разделов. Собрали дизайн-систему из 60 компонентов и перенесли на неё восемь ключевых экранов.",
      },
      {
        type: "stats",
        items: [
          { value: "60+", label: "компонентов в системе" },
          { value: "8", label: "ключевых экранов" },
          { value: "×2", label: "скорость сценария" },
        ],
      },
      {
        type: "image",
        src: "/placeholders/project-01-b.svg",
        alt: "Компоненты дизайн-системы",
      },
      {
        type: "quote",
        body:
          "Команда впервые перестала переключаться между вкладками — всё нужное оказалось на одном экране.",
        author: "Продуктовый директор, Atlas Group",
      },
    ],
  },
  {
    slug: "north-store",
    title: "North",
    client: "North Supply",
    year: "2025",
    role: "Дизайн, разработка",
    tags: ["E-commerce", "Витрина"],
    cover: "/placeholders/project-02.svg",
    summary:
      "Витрина бренда одежды с акцентом на съёмку: крупная типографика, мягкие переходы, быстрый каталог.",
    blocks: [
      {
        type: "text",
        title: "Задача",
        body:
          "Показать коллекцию так, чтобы фотографии работали в полную силу, а путь до корзины оставался коротким.",
      },
      {
        type: "image",
        src: "/placeholders/project-02-a.svg",
        alt: "Главный экран витрины North",
        wide: true,
      },
      {
        type: "text",
        title: "Решение",
        body:
          "Сделали каталог с мгновенной фильтрацией и карточкой товара, которая открывается поверх сетки — без перезагрузки контекста.",
      },
      {
        type: "stats",
        items: [
          { value: "1.2 с", label: "до первого экрана" },
          { value: "+34%", label: "глубина просмотра" },
          { value: "4", label: "недели до релиза" },
        ],
      },
      {
        type: "image",
        src: "/placeholders/project-02-b.svg",
        alt: "Карточка товара",
      },
    ],
  },
  {
    slug: "meridian-report",
    title: "Meridian",
    client: "Meridian Capital",
    year: "2024",
    role: "Дизайн, фронтенд",
    tags: ["Лендинг", "Данные"],
    cover: "/placeholders/project-03.svg",
    summary:
      "Годовой отчёт как интерактивный сайт: данные раскрываются по мере прокрутки, вместо PDF на сто страниц.",
    blocks: [
      {
        type: "text",
        title: "Задача",
        body:
          "Перевести годовой отчёт в формат, который читают с телефона и пересылают коллегам одной ссылкой.",
      },
      {
        type: "image",
        src: "/placeholders/project-03-a.svg",
        alt: "Разворот отчёта Meridian",
        wide: true,
      },
      {
        type: "text",
        title: "Решение",
        body:
          "Разбили отчёт на семь сюжетов. Каждый график появляется по скроллу и объясняет один тезис — без перегруза цифрами.",
      },
      {
        type: "stats",
        items: [
          { value: "7", label: "разделов-сюжетов" },
          { value: "5 мин", label: "среднее время чтения" },
          { value: "0", label: "страниц PDF" },
        ],
      },
    ],
  },
  {
    slug: "kvartal-city",
    title: "Квартал",
    client: "Девелопер «Квартал»",
    year: "2024",
    role: "Дизайн, разработка, поддержка",
    tags: ["Недвижимость", "Корпоративный сайт"],
    cover: "/placeholders/project-04.svg",
    summary:
      "Сайт жилого квартала с подбором квартир: карта корпусов, фильтры и заявка в два шага.",
    blocks: [
      {
        type: "text",
        title: "Задача",
        body:
          "Помочь покупателю выбрать квартиру, не звоня в отдел продаж, и передать заявку менеджеру со всем контекстом.",
      },
      {
        type: "image",
        src: "/placeholders/project-04-a.svg",
        alt: "Подбор квартир",
        wide: true,
      },
      {
        type: "text",
        title: "Решение",
        body:
          "Собрали интерактивный подбор: план корпуса, этаж, планировка. Заявка уходит в CRM вместе с выбранным лотом.",
      },
      {
        type: "quote",
        body:
          "Менеджеры стали тратить на квалификацию заявки в два раза меньше времени.",
        author: "Руководитель отдела продаж",
      },
    ],
  },
  {
    slug: "signal-app",
    title: "Signal",
    client: "Signal Labs",
    year: "2023",
    role: "Дизайн интерфейса",
    tags: ["Личный кабинет", "SaaS"],
    cover: "/placeholders/project-05.svg",
    summary:
      "Личный кабинет сервиса мониторинга: сводка, оповещения и история инцидентов в одном месте.",
    blocks: [
      {
        type: "text",
        title: "Задача",
        body:
          "Свести десятки метрик к одному экрану, на котором дежурный инженер за минуту понимает состояние системы.",
      },
      {
        type: "image",
        src: "/placeholders/project-05-a.svg",
        alt: "Дашборд Signal",
        wide: true,
      },
      {
        type: "text",
        title: "Решение",
        body:
          "Ввели три уровня детализации: сводка, разрез по сервисам, лента событий. Оповещения группируются по инцидентам.",
      },
      {
        type: "stats",
        items: [
          { value: "−40%", label: "лишних оповещений" },
          { value: "3", label: "уровня детализации" },
          { value: "24/7", label: "режим дежурства" },
        ],
      },
    ],
  },
  {
    slug: "forma-studio",
    title: "Форма",
    client: "Студия «Форма»",
    year: "2023",
    role: "Дизайн, разработка",
    tags: ["Портфолио", "Анимация"],
    cover: "/placeholders/project-06.svg",
    summary:
      "Портфолио архитектурного бюро: спокойная сетка, крупные планы и аккуратные переходы между проектами.",
    blocks: [
      {
        type: "text",
        title: "Задача",
        body:
          "Показать двадцать лет работы бюро так, чтобы проекты не сливались в бесконечную ленту.",
      },
      {
        type: "image",
        src: "/placeholders/project-06-a.svg",
        alt: "Сетка проектов бюро",
        wide: true,
      },
      {
        type: "text",
        title: "Решение",
        body:
          "Разделили архив по типологиям и годам. Каждый проект — отдельная страница с единым ритмом подачи материала.",
      },
      {
        type: "image",
        src: "/placeholders/project-06-b.svg",
        alt: "Страница проекта бюро",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
