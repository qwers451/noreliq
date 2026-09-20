/**
 * Цветовые поля разделов. У референса каждая страница залита своим цветом —
 * здесь то же самое, но палитра собрана вокруг фирменного лайма, чтобы
 * логотип и акценты оставались своими.
 *
 * ink — цвет текста поверх заливки, accent — цвет курсивной строки.
 */
export type Field = {
  key: string;
  bg: string;
  ink: string;
  accent: string;
  line: string;
  /**
   * Свечение вверху страницы. Свой цвет у каждого поля: лайм красиво
   * ложится на серое и зелёное, но на синем даёт грязный оливковый
   * отлив, а на светлом поле любое свечение читается как тень.
   */
  glow: string;
  /** Тёмное поле: на нём нужен светлый вариант логотипа. */
  dark: boolean;
};

export const fields = {
  moss: { key: "moss", bg: "#17472f", ink: "#f1f5ef", accent: "#9ae63c", line: "rgba(241,245,239,0.22)", glow: "rgba(154,230,60,0.12)", dark: true },
  // Главная: глубокая синяя ночь. Графит слишком похож на «Проекты»,
  // а насыщенный тёмно-синий держит лайм логотипа и читается дороже.
  midnight: { key: "midnight", bg: "#111c3b", ink: "#eef1fa", accent: "#9ae63c", line: "rgba(238,241,250,0.22)", glow: "rgba(120,150,235,0.16)", dark: true },
  carbon: { key: "carbon", bg: "#212121", ink: "#f2f2f0", accent: "#9ae63c", line: "rgba(242,242,240,0.2)", glow: "rgba(154,230,60,0.09)", dark: true },
  indigo: { key: "indigo", bg: "#2f3bd0", ink: "#f2f3ff", accent: "#9ae63c", line: "rgba(242,243,255,0.25)", glow: "rgba(255,255,255,0.14)", dark: true },
  bone: { key: "bone", bg: "#efece4", ink: "#14171a", accent: "#4a7d10", line: "rgba(20,23,26,0.18)", glow: "transparent", dark: false },
} satisfies Record<string, Field>;

export type FieldKey = keyof typeof fields;

/** Какому маршруту какое поле. Вложенные пути наследуют раздел. */
const byRoute: [string, FieldKey][] = [
  ["/about", "bone"],
  ["/services", "moss"],
  ["/projects", "carbon"],
  ["/contacts", "indigo"],
];

export function fieldForPath(pathname: string): FieldKey {
  const match = byRoute.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : "midnight";
}
