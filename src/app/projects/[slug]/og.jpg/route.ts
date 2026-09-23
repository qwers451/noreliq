import path from "node:path";
import sharp from "sharp";

import { getProject, projects } from "@/content/projects";

// Статический экспорт: маршрут ложится файлом projects/<slug>/og.jpg.
export const dynamic = "force-static";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * Превью кейса для соцсетей — его обложка в пропорции 1200×630. Обложки
 * хранятся в webp, а его понимают не все площадки (и сам next/og), поэтому
 * отдаём JPEG. Нарезается на сборке из той же обложки, отдельных файлов в
 * репозитории нет.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new Response("Not found", { status: 404 });

  const image = await sharp(path.join(process.cwd(), "public", project.cover))
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/jpeg" } });
}
