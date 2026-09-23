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

// Все поля тёмные и одной глубины, как экраны у референса: сайт читается
// одной семьёй, а разделы различаются оттенком, а не яркостью.
export const fields = {
  // Главная: глубокий ультрамарин. Прежняя тёмно-синяя ночь по яркости
  // совпадала с графитом «Проектов», и два раздела выглядели одинаково.
  ultramarine: { key: "ultramarine", bg: "#241a86", ink: "#eeecff", accent: "#9ae63c", line: "rgba(238,236,255,0.22)", glow: "rgba(150,130,255,0.18)", dark: true },
  // «О нас»: глубокий бирюзовый. Бордо было единственным тёплым цветом
  // в холодной палитре и спорило с лаймовым акцентом.
  teal: { key: "teal", bg: "#085066", ink: "#eef8fa", accent: "#9ae63c", line: "rgba(238,248,250,0.22)", glow: "rgba(110,210,230,0.14)", dark: true },
  moss: { key: "moss", bg: "#17472f", ink: "#f1f5ef", accent: "#9ae63c", line: "rgba(241,245,239,0.22)", glow: "rgba(154,230,60,0.12)", dark: true },
  carbon: { key: "carbon", bg: "#212121", ink: "#f2f2f0", accent: "#9ae63c", line: "rgba(242,242,240,0.2)", glow: "rgba(154,230,60,0.09)", dark: true },
  cobalt: { key: "cobalt", bg: "#1a47a8", ink: "#eef3ff", accent: "#9ae63c", line: "rgba(238,243,255,0.24)", glow: "rgba(140,180,255,0.16)", dark: true },
} satisfies Record<string, Field>;

export type FieldKey = keyof typeof fields;

/** Какому маршруту какое поле. Вложенные пути наследуют раздел. */
const byRoute: [string, FieldKey][] = [
  ["/about", "teal"],
  ["/services", "moss"],
  ["/projects", "carbon"],
  ["/contacts", "cobalt"],
];

export function fieldForPath(pathname: string): FieldKey {
  const match = byRoute.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : "ultramarine";
}
