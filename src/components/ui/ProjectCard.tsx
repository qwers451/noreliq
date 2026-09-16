import { TransitionLink } from "@/components/motion/TransitionLink";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { Project } from "@/content/projects";

type ProjectCardProps = {
  project: Project;
  /** Порядковый номер для мелкого индекса над названием. */
  index: number;
  priority?: boolean;
  sizes?: string;
};

export function ProjectCard({
  project,
  index,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProjectCardProps) {
  return (
    <article className="group">
      <TransitionLink href={`/projects/${project.slug}`} className="block">
        <ParallaxImage
          src={project.cover}
          alt={`Обложка проекта ${project.title}`}
          sizes={sizes}
          priority={priority}
          className="aspect-[4/3] w-full"
        />

        <div className="mt-5 flex items-baseline justify-between gap-6">
          <h3 className="font-display text-h3 transition-colors duration-300 group-hover:text-accent-ink">
            <span className="label mr-3 align-middle">
              {String(index + 1).padStart(2, "0")}
            </span>
            {project.title}
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
