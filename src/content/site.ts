export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export const site = {
  name: "Noreliq",
  legalName: "ООО «Норелик»",
  tagline: "Студия цифровой разработки",
  /** Короткое позиционирование — используется в hero и SEO-описании. */
  intro:
    "Проектируем и собираем цифровые продукты: сайты, интерфейсы и сервисы, которые работают на результат.",
  description:
    "Noreliq — студия цифровой разработки. Проектируем интерфейсы, собираем сайты и веб-сервисы под задачи бизнеса.",
  url: "https://noreliq.com",
  email: "hello@noreliq.com",
  phone: "+7 (000) 000-00-00",
  phoneHref: "+70000000000",
  city: "Санкт-Петербург",
  timezone: "GMT+3",
  foundedYear: 2019,
  /** Заглушка — заменить на реальные реквизиты. */
  legal: [
    { label: "Юр. лицо", value: "ООО «Нарелик»" },
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
