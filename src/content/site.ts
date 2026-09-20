export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export const site = {
  name: "Noreliq",
  legalName: "Норлик",
  tagline: "Digital & AI studio",
  /** Короткое позиционирование — используется в hero и SEO-описании. */
  intro:
    "Digital & AI студия. Проектируем и собираем цифровые продукты: сайты, интерфейсы и сервисы с ИИ внутри — там, где он решает задачу.",
  description:
    "Noreliq — digital & AI студия. Проектируем интерфейсы, собираем сайты и веб-сервисы с ИИ-функциями под задачи бизнеса.",
  /** Переопределяется NEXT_PUBLIC_SITE_URL — например, для демо на GitHub Pages. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://noreliq.com",
  email: "order@noreliq.ru",
  phone: "+7 (981) 890-88-69",
  phoneHref: "+79818908869",
  city: "Санкт-Петербург",
  timezone: "GMT+3",
  foundedYear: 2026,
  socials: [
    { label: "Telegram", href: "https://t.me/noreliq_dev", handle: "@noreliq_dev" },
  ] satisfies SocialLink[],
} as const;

export type Site = typeof site;
