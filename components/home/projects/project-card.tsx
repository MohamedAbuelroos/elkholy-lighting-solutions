import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";

import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative isolate aspect-[2.35/1] overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-primary/50 motion-reduce:transition-none [transform:translateZ(0)]">
      <Image
        src={project.image.src}
        alt={project.image.alt}
        fill
        sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover scale-[1.01] [backface-visibility:hidden] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px bg-gradient-to-t from-black/90 via-black/25 to-transparent [transform:translateZ(0)]"
      />

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 truncate text-[10px] font-medium text-[#E2B858]">
            {project.category_ar}
          </p>

          <h3 className="line-clamp-1 text-sm font-semibold leading-6 text-white sm:text-base">
            {project.title_ar}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs leading-5 text-white/75">
            {project.description_ar}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 group-hover:border-[#D6A744] group-hover:bg-[#D6A744] group-hover:text-[#05070B]"
        >
          <FaArrowLeft className="size-3" />
        </span>
      </div>
    </article>
  );
}
