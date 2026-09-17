/**
 * Готовит лёгкие версии логотипов и ужимает снимки интерфейса.
 *
 * Зачем: на GitHub Pages статический экспорт отдаёт файлы как есть,
 * без оптимизации next/image. Исходный logo-full.png весил 432 КБ
 * и грузился на каждой странице ради картинки 120×44 px.
 *
 * Запуск: node scripts/optimize-assets.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// На Windows sharp держит исходник открытым и не даёт перезаписать его.
sharp.cache(false);

const BRAND = "public/brand/";

// Логотип в шапке показывается шириной до 120 px, в прелоадере — до 320 px.
// Берём тройной запас под плотные экраны.
const logos = [
  { from: "logo-full.png", to: "logo-full.webp", width: 420 },
  { from: "logo-full-light.png", to: "logo-full-light.webp", width: 960 },
];

for (const { from, to, width } of logos) {
  const info = await sharp(BRAND + from)
    .resize({ width })
    .webp({ quality: 90 })
    .toFile(BRAND + to);
  console.log(to, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} КБ`);
}

// Снимки интерфейса: 2400 px избыточны, ширина показа — около 1300 px.
const shots = [
  "projects/devcontest/contests.webp",
  "projects/devcontest/solution.webp",
  "projects/devcontest/wallet.webp",
  "projects/devcontest/create.webp",
  "projects/devcontest/contest.webp",
  "projects/devcontest/login.webp",
  "projects/court-01/dashboard.webp",
  "projects/court-01/booking.webp",
  "projects/court-01/schedule.webp",
  "projects/court-01/coaches.webp",
];

await mkdir("public/.tmp", { recursive: true });

for (const rel of shots) {
  const src = "public/" + rel;
  const meta = await sharp(src).metadata();
  if (meta.width <= 2000) {
    console.log(rel, "уже ужат, пропускаю");
    continue;
  }
  const tmp = "public/.tmp/" + rel.split("/").pop();
  const info = await sharp(src)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(tmp);
  await sharp(tmp).toFile(src);
  console.log(rel, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} КБ`);
}
