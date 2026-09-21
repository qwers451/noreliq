/**
 * Готовит снимки сайта M-Des под кейс: переводит PNG из Playwright в WebP.
 * Исходники снимаются с живого m-des.ru, поэтому шаг разовый.
 *
 * Окно съёмки — 1280 × 800 при DPR 2 (плюс один кадр мобильной версии).
 * Ширина важна: в кадре кейса снимок показывается примерно на 864 px, и
 * снятый в окне 1600 макет ужимался до 54% — мелкий шрифт сайта переставал
 * читаться. При 1280 масштаб выходит 68%, и текст держится.
 *
 * Запуск: node scripts/prepare-mdes.mjs <папка-с-png>
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Укажите папку с исходными PNG");
  process.exit(1);
}

const OUT = "public/projects/m-des/";

const screens = [
  { from: "home.png", to: "home.webp" },
  { from: "portfolio.png", to: "portfolio.webp" },
  { from: "uslugi.png", to: "uslugi.webp" },
  { from: "prices.png", to: "prices.webp" },
  { from: "contacts.png", to: "contacts.webp" },
  { from: "mobile.png", to: "mobile.webp" },
];

await mkdir(OUT, { recursive: true });

for (const { from, to } of screens) {
  // Качество выше обычных 88: на снимках сайта мелкая антиква, и артефакты
  // сжатия на засечках заметнее, чем на плотном интерфейсе приложения.
  const info = await sharp(`${SRC}/${from}`)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(OUT + to);
  console.log(to, `${info.width}×${info.height}`);
}
