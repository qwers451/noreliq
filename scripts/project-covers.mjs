/**
 * Обложки проектов в общем минималистичном ключе: светлый фон с осевой
 * разметкой и одна тёмная плитка-иконка по центру. Никакой детализации —
 * знак должен читаться в карточке шириной 300 px.
 *
 * Геометрия общая для всех проектов, меняются только цвета и глиф.
 *
 * Запуск: node scripts/project-covers.mjs
 */
import sharp from "sharp";

sharp.cache(false);

const W = 2400;
const H = 1500;
const CX = W / 2;
const CY = H / 2;
const R = 300;

/** Рамка одинакова у всех обложек: фон, крест осей, окружность. */
function frame({ bgFrom, bgTo, line }) {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgFrom}"/>
        <stop offset="100%" stop-color="${bgTo}"/>
      </linearGradient>
      <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="30" stdDeviation="42" flood-color="${line}" flood-opacity="0.22"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <g stroke="${line}" stroke-opacity="0.1" stroke-width="2">
      <line x1="${CX}" y1="0" x2="${CX}" y2="${H}"/>
      <line x1="0" y1="${CY}" x2="${W}" y2="${CY}"/>
      <circle cx="${CX}" cy="${CY}" r="${R + 200}" fill="none"/>
    </g>
  `;
}

/** Плитка-иконка со скруглением, как иконка приложения. */
function tile(from, to) {
  return `
    <defs>
      <linearGradient id="tile" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <g filter="url(#soft)">
      <rect x="${CX - R}" y="${CY - R}" width="${R * 2}" height="${R * 2}"
            rx="${R * 0.46}" fill="url(#tile)"/>
    </g>
  `;
}

const covers = [
  {
    // Meet Up: метка на карте — весь продукт строится вокруг неё.
    out: "public/projects/meet-up/cover.webp",
    frame: { bgFrom: "#fdf8f5", bgTo: "#eae2dc", line: "#5a2a16" },
    tile: ["#f2703a", "#d8431a"],
    glyph: `
      <g fill="#fff">
        <path d="M ${CX} ${CY - 150}
                 a 118 118 0 0 1 118 118
                 c 0 84 -118 214 -118 214
                 s -118 -130 -118 -214
                 a 118 118 0 0 1 118 -118 z"/>
      </g>
      <circle cx="${CX}" cy="${CY - 32}" r="46" fill="#d8431a"/>
    `,
  },
  {
    // Карточки для маркетплейсов: кадр товара и вспышка ИИ.
    out: "public/projects/marketplace-cards/cover.webp",
    frame: { bgFrom: "#f6f7f4", bgTo: "#e4e7e0", line: "#1a1e23" },
    tile: ["#2b3138", "#14181c"],
    glyph: `
      <rect x="${CX - 150}" y="${CY - 170}" width="300" height="300" rx="34"
            fill="none" stroke="#f3f4f2" stroke-width="20"/>
      <circle cx="${CX - 62}" cy="${CY - 92}" r="30" fill="#f3f4f2"/>
      <path d="M ${CX - 150} ${CY + 76} L ${CX - 42} ${CY - 22} L ${CX + 48} ${CY + 60}
               L ${CX + 96} ${CY + 18} L ${CX + 150} ${CY + 70} L ${CX + 150} ${CY + 130} L ${CX - 150} ${CY + 130} Z"
            fill="#f3f4f2"/>
      <path d="M ${CX + 150} ${CY - 210}
               l 26 62 62 26 -62 26 -26 62 -26 -62 -62 -26 62 -26 z"
            fill="#82cd28"/>
    `,
  },
];

for (const cover of covers) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${frame(cover.frame)}
      ${tile(cover.tile[0], cover.tile[1])}
      ${cover.glyph}
    </svg>
  `;

  const info = await sharp(Buffer.from(svg)).webp({ quality: 92 }).toFile(cover.out);
  console.log(cover.out.split("/").slice(-2).join("/"), `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} КБ`);
}
