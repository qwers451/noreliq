// Генерирует локальные SVG-плейсхолдеры в public/placeholders.
// Запуск: node scripts/generate-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/placeholders");
mkdirSync(outDir, { recursive: true });

// Гамма выведена из логотипа: холодный графит + лаймовые подмешивания.
const palettes = [
  ["#dfe3dd", "#b6c0b4"],
  ["#dde1e4", "#aeb8c0"],
  ["#e2e7d9", "#bccfa0"],
  ["#d8dcdd", "#a8b2b6"],
  ["#e4e6e0", "#c3ccb6"],
  ["#d7dee0", "#a6b6b8"],
];

function card({ width, height, label, index, seed }) {
  const [from, to] = palettes[seed % palettes.length];
  const fontSize = Math.round(Math.min(width, height) * 0.18);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g${seed})"/>
  <g fill="none" stroke="#1a1e2314" stroke-width="1">
    <path d="M0 ${height * 0.5}H${width}"/>
    <path d="M${width * 0.5} 0V${height}"/>
  </g>
  <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.28}" fill="none" stroke="#1a1e231c" stroke-width="1"/>
  <text x="${width * 0.5}" y="${height * 0.5}" text-anchor="middle" dominant-baseline="central"
    font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="600" fill="#1a1e2333">${index}</text>
</svg>
`;
}

const files = [];

for (let i = 1; i <= 6; i += 1) {
  const n = String(i).padStart(2, "0");
  files.push([`project-${n}.svg`, card({ width: 1200, height: 900, label: `Проект ${n}`, index: n, seed: i })]);
  files.push([`project-${n}-a.svg`, card({ width: 1600, height: 900, label: `Проект ${n}, кадр A`, index: `${n}A`, seed: i + 1 })]);
  files.push([`project-${n}-b.svg`, card({ width: 1200, height: 1500, label: `Проект ${n}, кадр B`, index: `${n}B`, seed: i + 2 })]);
}

for (let i = 1; i <= 4; i += 1) {
  const n = String(i).padStart(2, "0");
  files.push([`team-${n}.svg`, card({ width: 800, height: 1000, label: `Портрет ${n}`, index: n, seed: i + 3 })]);
}

files.push(["og-cover.svg", card({ width: 1200, height: 630, label: "noreliq", index: "no", seed: 2 })]);

for (const [name, content] of files) {
  writeFileSync(resolve(outDir, name), content, "utf8");
}

console.log(`Готово: ${files.length} файлов в public/placeholders`);
