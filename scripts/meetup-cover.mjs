/**
 * Собирает обложку кейса Meet Up: три экрана приложения на фирменном графите.
 * Выход — 2560 × 1440 (16/9), как просит вёрстка страницы проекта.
 *
 * Телефоны держатся в центральных двух третях кадра: на главной та же
 * обложка кадрируется до 4/3 и увеличивается на 10%, то есть по краям
 * срезается примерно по 17% ширины.
 *
 * Разовый скрипт: node scripts/meetup-cover.mjs
 * sharp приходит вместе с next (оптимизация картинок), отдельная установка
 * не нужна.
 */
import sharp from "sharp";

const DIR = "public/projects/meet-up/";
const W = 2560;
const H = 1440;
/** Пропорция исходных экранов: 786 × 1704. */
const RATIO = 1704 / 786;

const phones = [
  { file: "menu.webp", width: 430, lift: 56 },
  { file: "map.webp", width: 486, lift: -24 },
  { file: "booking.webp", width: 430, lift: 56 },
];
const GAP = 64;

const background = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#82cd28" stop-opacity="0.12" />
        <stop offset="70%" stop-color="#82cd28" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="#1a1e23" />
    <rect width="${W}" height="${H}" fill="url(#glow)" />
  </svg>`);

/** Скругляет углы экрана: маска по альфе вместо рамки телефона. */
async function roundedPhone(file, width) {
  const height = Math.round(width * RATIO);
  const radius = Math.round(width * 0.11);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
       <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff" />
     </svg>`,
  );

  return sharp(DIR + file)
    .resize(width, height, { fit: "fill" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/** Мягкая тень под экраном — размытый чёрный прямоугольник той же формы. */
async function shadow(width) {
  const height = Math.round(width * RATIO);
  const radius = Math.round(width * 0.11);
  const pad = 80;
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width + pad * 2}" height="${height + pad * 2}">
       <rect x="${pad}" y="${pad}" width="${width}" height="${height}"
             rx="${radius}" ry="${radius}" fill="#000" fill-opacity="0.55" />
     </svg>`,
  );
  return sharp(svg).blur(38).png().toBuffer();
}

const totalWidth =
  phones.reduce((sum, p) => sum + p.width, 0) + GAP * (phones.length - 1);
let x = Math.round((W - totalWidth) / 2);

const layers = [];
for (const { file, width, lift } of phones) {
  const height = Math.round(width * RATIO);
  const top = Math.round((H - height) / 2 + lift);
  const pad = 80;

  layers.push({ input: await shadow(width), left: x - pad, top: top - pad + 40 });
  layers.push({ input: await roundedPhone(file, width), left: x, top });
  x += width + GAP;
}

const info = await sharp(background)
  .composite(layers)
  .webp({ quality: 88 })
  .toFile(DIR + "cover.webp");

console.log(`cover.webp: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
