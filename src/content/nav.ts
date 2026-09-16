export type NavItem = {
  label: string;
  href: string;
  /** Порядковый номер в меню — выводится мелким моноширинным индексом. */
  index: string;
};

export const nav: NavItem[] = [
  { label: "О нас", href: "/about", index: "01" },
  { label: "Услуги", href: "/services", index: "02" },
  { label: "Проекты", href: "/projects", index: "03" },
  { label: "Контакты", href: "/contacts", index: "04" },
];

export const homeHref = "/";
