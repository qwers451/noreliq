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
  email: "info@noreliq.ru",
  phone: "+7 (981) 890-88-69",
  phoneHref: "+79818908869",
  city: "Санкт-Петербург",
  timezone: "GMT+3",
  foundedYear: 2019,
  /** Заглушка — заменить на реальные реквизиты. */
  legal: [
    { label: "Юр. лицо", value: "Нарлик" },
    { label: "ИНН", value: "0000000000" },
    { label: "ОГРН", value: "0000000000000" },
    { label: "Адрес", value: "Санкт-Петербург, ул. Примерная, 1, офис 000" },
  ],
  socials: [
    { label: "Telegram", href: "https://t.me/noreliq", handle: "@noreliq" },
    { label: "Behance", href: "https://behance.net/noreliq", handle: "/noreliq" },
    { label: "GitHub", href: "https://github.com/noreliq", handle: "/noreliq" },
    { label: "LinkedIn", href: "https://linkedin.com/company/noreliq", handle: "/noreliq" },
  ] satisfies SocialLink[],
} as const;

export type Site = typeof site;
