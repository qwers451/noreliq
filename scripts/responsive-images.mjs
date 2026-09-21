/**
 * Нарезает адаптивные версии снимков проектов.
 *
 * Зачем: статический экспорт отдаёт файлы как есть, оптимизатора next/image
 * на GitHub Pages нет. Без нарезки телефон качал те же 2000-пиксельные
 * снимки, что и десктоп, — на кейсе Корт 01 это 698 КБ картинок ради
 * слотов шириной 300 px.
 *
 * Исходник остаётся самым большим кандидатом и не пережимается: повторное
 * сжатие уже сжатого webp заметно портит мелкий текст интерфейсов.
 *
 * Запуск: node scripts/responsive-images.mjs
 */
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Совпадает с images.deviceSizes в next.config.ts: загрузчик подставляет
// ровно эти файлы, поэтому списки должны сходиться.
const WIDTHS = [480, 960, 1440, 2000];
const ROOT = "public/projects";
const VARIANT = /-(\d+)\.webp$/;

sharp.cache(false);

const sources = [];
for (const dir of await readdir(ROOT)) {
  for (const file of await readdir(path.join(ROOT, dir))) {
    if (file.endsWith(".webp") && !VARIANT.test(file)) {
      sources.push(path.join(ROOT, dir, file));
    }
  }
}

let made = 0;
let bytes = 0;
/** Ширина исходника по каждому файлу: по ней загрузчик понимает,
    какие варианты вообще существуют. */
const manifest = {};

for (const source of sources) {
  const original = await readFile(source);
  const { width } = await sharp(original).metadata();
  const url = source.split(path.sep).join("/").replace(/^public/, "");
  manifest[url] = width;

  // Режем только то, что действительно меньше исходника: копии оригинала
  // под именем «-2000» раздували репозиторий втрое и ничего не давали.
  for (const target of WIDTHS.filter((w) => w < width)) {
    const data = await sharp(original)
      .resize({ width: target, fit: "inside", kernel: "lanczos3" })
      .webp({ quality: 86, effort: 6 })
      .toBuffer();

    await writeFile(source.replace(/\.webp$/, `-${target}.webp`), data);
    made += 1;
    bytes += data.length;
  }
}

await writeFile(
  "src/content/image-widths.json",
  `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2)}
`,
);

console.log(`Исходников: ${sources.length}. Вариантов: ${made} (${(bytes / 1024).toFixed(0)} КБ).`);
