import clsx from "clsx";

import { TransitionLink } from "@/components/motion/TransitionLink";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { Project } from "@/content/projects";

type ProjectCardProps = {
  project: Project;
  /** Порядковый номер для мелкого индекса над названием. */
  index: number;
  priority?: boolean;
  sizes?: string;
  /** Карточка во всю ширину сетки: обложка кадрируется положе, иначе она выше экрана. */
  wide?: boolean;
};

export function ProjectCard({
  project,
  index,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  wide = false,
}: ProjectCardProps) {
  return (
    <article className="group">
      <TransitionLink href={`/projects/${project.slug}`} className="block">
        {/* hover-эффекты только с md: на тач-устройствах состояние залипает. */}
        <ParallaxImage
          src={project.cover}
          alt={`Обложка проекта ${project.title}`}
          sizes={sizes}
          priority={priority}
          className={clsx("w-full", wide ? "aspect-[16/9]" : "aspect-[4/3]")}
          innerClassName="transition-transform duration-700 ease-[var(--ease-out-expo)] md:group-hover:scale-[1.04]"
        />

        <div className="mt-5 flex items-baseline justify-between gap-6">
          <h3 className="flex items-baseline font-display text-h3 transition-colors duration-300 group-hover:text-accent-ink">
            <span className="label mr-3">{String(index + 1).padStart(2, "0")}</span>
            <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] md:group-hover:translate-x-2">
              {project.title}
            </span>
            <span
              aria-hidden="true"
              className="ml-3 hidden text-accent-ink opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] md:inline-block md:-translate-x-2 md:group-hover:translate-x-0 md:group-hover:opacity-100"
            >
              ↗
            </span>
          </h3>
          <span className="label shrink-0">{project.year}</span>
        </div>

        <p className="mt-3 max-w-[48ch] text-muted">{project.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </TransitionLink>
    </article>
  );
}
