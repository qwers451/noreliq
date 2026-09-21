/**
 * Собирает обложку кейса M-Des в общем ключе ленты работ: светлый фон
 * с осевой разметкой и тёмная плитка-иконка по центру — та же геометрия,
 * что в scripts/project-covers.mjs и scripts/court01-cover.mjs.
 *
 * Вместо нарисованного глифа на плитке стоит логотип студии — словесный
 * знак «M—Des». Своего SVG у него нет: на сайте это текст в Cormorant
 * Garamond, поэтому знак один раз отрисован тем же шрифтом с живого
 * m-des.ru (design/m-des-src/render-wordmark.mjs) и лежит рядом как PNG.
 *
 * Цвета взяты с сайта: фон #f3f1eb, текст #172932, тёмная карточка цен
 * #122533 / #10212b.
 *
 * Запуск: node scripts/mdes-cover.mjs [путь-к-wordmark.png]
 */
import sharp from "sharp";

const WORDMARK = process.argv[2] ?? "design/m-des-src/wordmark.png";

const W = 2400;
const H = 1500;
const CX = W / 2;
const CY = H / 2;
const R = 300;

/** Ширина знака на плитке: словесный логотип длинный, но должен
    оставлять поля, иначе плитка читается как плашка с текстом. */
const MARK_W = 470;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7f5ef"/>
      <stop offset="100%" stop-color="#e3dfd5"/>
    </linearGradient>
    <linearGradient id="tile" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0%" stop-color="#1b3446"/>
      <stop offset="100%" stop-color="#10212b"/>
    </linearGradient>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="30" stdDeviation="42" flood-color="#172932" flood-opacity="0.22"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <g stroke="#172932" stroke-opacity="0.1" stroke-width="2">
    <line x1="${CX}" y1="0" x2="${CX}" y2="${H}"/>
    <line x1="0" y1="${CY}" x2="${W}" y2="${CY}"/>
    <circle cx="${CX}" cy="${CY}" r="${R + 200}" fill="none"/>
  </g>

  <g filter="url(#soft)">
    <rect x="${CX - R}" y="${CY - R}" width="${R * 2}" height="${R * 2}"
          rx="${R * 0.46}" fill="url(#tile)"/>
  </g>
</svg>
`;

// Знак снят белым на прозрачном фоне: обрезаем поля скриншота, чтобы
// центрировать по самим буквам, а не по рамке элемента.
const mark = await sharp(WORDMARK)
  .trim({ threshold: 1 })
  .resize({ width: MARK_W })
  .png()
  .toBuffer();
const { height: markH } = await sharp(mark).metadata();

const info = await sharp(Buffer.from(svg))
  .composite([
    {
      input: mark,
      left: Math.round(CX - MARK_W / 2),
      // Оптическая середина плитки: у Cormorant верхние выносные длиннее
      // нижних, поэтому знак опускаем на пару пикселей.
      top: Math.round(CY - markH / 2 + 6),
    },
  ])
  .webp({ quality: 92 })
  .toFile("public/projects/m-des/cover.webp");

console.log("cover.webp", `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} КБ`);
