/**
 * Готовит экраны DevContest под кейс: переводит скриншоты из PNG в WebP
 * и делает обложку. Исходники снимаются Playwright в демо-режиме
 * приложения (VITE_DEMO=1), поэтому шаг разовый.
 *
 * Запуск: node scripts/prepare-devcontest.mjs <папка-с-png>
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Укажите папку с исходными PNG");
  process.exit(1);
}

const OUT = "public/projects/devcontest/";

const screens = [
  { from: "final-contests.png", to: "contests.webp" },
  { from: "final-contest.png", to: "contest.webp" },
  { from: "final-solution.png", to: "solution.webp" },
  { from: "final-create.png", to: "create.webp" },
  { from: "final-wallet.png", to: "wallet.webp" },
  { from: "final-login.png", to: "login.webp" },
];

await mkdir(OUT, { recursive: true });

for (const { from, to } of screens) {
  const info = await sharp(`${SRC}/${from}`)
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(OUT + to);
  console.log(to, `${info.width}×${info.height}`);
}

// Обложка: список конкурсов, кадрированный под 16:9 карточки проекта.
const cover = await sharp(`${SRC}/final-contests.png`)
  .resize({ width: 2400, withoutEnlargement: true })
  .extract({ left: 0, top: 0, width: 2400, height: 1350 })
  .webp({ quality: 88 })
  .toFile(OUT + "cover.webp");
console.log("cover.webp", `${cover.width}×${cover.height}`);
