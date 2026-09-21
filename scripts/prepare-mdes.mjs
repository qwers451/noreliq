/**
 * Готовит снимки сайта M-Des под кейс: переводит PNG из Playwright в WebP.
 * Исходники снимаются с живого m-des.ru в окне 1600 × 1000 (плюс один кадр
 * мобильной версии), поэтому шаг разовый.
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
  const info = await sharp(`${SRC}/${from}`)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(OUT + to);
  console.log(to, `${info.width}×${info.height}`);
}
