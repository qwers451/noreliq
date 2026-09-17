/**
 * Готовит экраны проекта «Корт 01» под кейс: переводит PNG из public
 * в WebP и собирает обложку из верхней части дашборда.
 *
 * Запуск разовый: node scripts/prepare-court01.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/stitch_premium_table_tennis_platform/";
const OUT = "public/projects/court-01/";

const screens = [
  { from: "_1/screen.png", to: "dashboard.webp" },
  { from: "_3/screen.png", to: "booking.webp" },
  { from: "_4/screen.png", to: "schedule.webp" },
  { from: "_2/screen.png", to: "coaches.webp" },
];

await mkdir(OUT, { recursive: true });

for (const { from, to } of screens) {
  const info = await sharp(SRC + from)
    .resize({ width: 2400, withoutEnlargement: false })
    .webp({ quality: 92 })
    .toFile(OUT + to);
  console.log(to, `${info.width}×${info.height}`);
}

// Обложка 16:10 — верх дашборда, где видны приветствие и ближайшая бронь.
const meta = await sharp(SRC + "_1/screen.png").metadata();
const cover = await sharp(SRC + "_1/screen.png")
  .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.width * 0.625) })
  .resize({ width: 2400 })
  .webp({ quality: 92 })
  .toFile(OUT + "cover.webp");
console.log("cover.webp", `${cover.width}×${cover.height}`);
