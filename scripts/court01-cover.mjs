/**
 * Собирает стилизованную обложку для кейса «Корт 01» — по той же логике,
 * что карточка DevContest: спокойный фон, тонкая разметка и знак по центру.
 *
 * Цвета взяты из дизайн-системы клуба (DESIGN.md проекта):
 * тёплый светлый фон #fcf9f8 и тёмно-зелёный #002517 / #183b2b.
 *
 * Запуск: node scripts/court01-cover.mjs
 */
import sharp from "sharp";

const W = 2400;
const H = 1500;
const CX = W / 2;
const CY = H / 2;
const R = 300;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fcf9f8"/>
      <stop offset="55%" stop-color="#f2efee"/>
      <stop offset="100%" stop-color="#e5e2e1"/>
    </linearGradient>
    <linearGradient id="tile" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0%" stop-color="#20503a"/>
      <stop offset="55%" stop-color="#183b2b"/>
      <stop offset="100%" stop-color="#002517"/>
    </linearGradient>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="30" stdDeviation="42" flood-color="#002517" flood-opacity="0.24"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Разметка кадра: те же осевые линии, что на карточке DevContest. -->
  <g stroke="#002517" stroke-opacity="0.1" stroke-width="2">
    <line x1="${CX}" y1="0" x2="${CX}" y2="${H}"/>
    <line x1="0" y1="${CY}" x2="${W}" y2="${CY}"/>
    <circle cx="${CX}" cy="${CY}" r="${R + 200}" fill="none"/>
  </g>

  <!-- Знак клуба: тёмная плитка со скруглением, как иконка приложения. -->
  <g filter="url(#soft)">
    <rect x="${CX - R}" y="${CY - R}" width="${R * 2}" height="${R * 2}" rx="${R * 0.46}" fill="url(#tile)"/>
  </g>

  <!-- Ракетка: лопасть с ручкой, наклон как при ударе. -->
  <g transform="translate(${CX - 34} ${CY + 18}) rotate(-28)">
    <rect x="-26" y="70" width="52" height="150" rx="26" fill="#a9cfb9"/>
    <ellipse cx="0" cy="-10" rx="118" ry="130" fill="#e8f0ea"/>
    <ellipse cx="0" cy="-10" rx="92" ry="104" fill="none" stroke="#002517" stroke-opacity="0.16" stroke-width="6"/>
  </g>

  <!-- Мяч и след от удара. -->
  <path d="M ${CX + 40} ${CY + 120} Q ${CX + 128} ${CY + 30} ${CX + 150} ${CY - 92}"
        fill="none" stroke="#a9cfb9" stroke-opacity="0.5" stroke-width="8"
        stroke-linecap="round" stroke-dasharray="4 30"/>
  <circle cx="${CX + 152}" cy="${CY - 126}" r="52" fill="#fcf9f8"/>
</svg>
`;


const info = await sharp(Buffer.from(svg))
  .webp({ quality: 92 })
  .toFile("public/projects/court-01/cover.webp");

console.log("cover.webp", `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} КБ`);
