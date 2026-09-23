import { ImageResponse } from "next/og";

import { site } from "@/content/site";

// Статический экспорт требует явной пометки: маршрут ляжет файлом og.png.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

/**
 * Общая OG-картинка для всего сайта. Маршрут, а не opengraph-image.tsx:
 * тот в экспорте ложился файлом без расширения, и хостинг отдавал его без
 * типа image/png. Текст латиницей: встроенный в next/og шрифт не содержит
 * кириллицы. Заменить на фирменную обложку при ребрендинге.
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a1e23",
          color: "#f3f4f2",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#82cd28" }}>
          DIGITAL PRODUCT STUDIO
        </div>
        <div style={{ display: "flex", fontSize: 180, letterSpacing: -6, lineHeight: 1 }}>
          {site.name}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <span>{site.email}</span>
          <span style={{ color: "#82cd28" }}>{site.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    size,
  );
}
