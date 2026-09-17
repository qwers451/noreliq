/**
 * Готовит экраны Meet Up под кейс: кадрирует сверху до пропорции экрана
 * телефона (393 × 852) и переводит в WebP. Исходники из Figma разной
 * высоты — длинные скролл-фреймы обрезаются по верхнему экрану.
 *
 * Запуск разовый: node scripts/prepare-meetup.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/Для заказчика_Обновленная версия Meet UP/";
const OUT = "public/projects/meet-up/";

/** Ширина исходников — 786 (2× от 393). Высота экрана телефона — 1704. */
const W = 786;
const H = 1704;

const screens = [
  { from: "Map/Default.png", to: "map.webp" },
  { from: "search by dishes.png", to: "search-dish.webp" },
  { from: "Страница бронирований-1.png", to: "menu.webp" },
  { from: "Page food.png", to: "dish.webp" },
  { from: "Подтверждение брони.png", to: "booking.webp" },
  { from: "the route of the institution/default.png", to: "route.webp" },
];

await mkdir(OUT, { recursive: true });

for (const { from, to } of screens) {
  const image = sharp(SRC + from);
  const meta = await image.metadata();
  const info = await image
    .extract({ left: 0, top: 0, width: W, height: Math.min(H, meta.height) })
    .webp({ quality: 82 })
    .toFile(OUT + to);
  console.log(
    `${to}: ${meta.width}×${meta.height} → ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`,
  );
}
