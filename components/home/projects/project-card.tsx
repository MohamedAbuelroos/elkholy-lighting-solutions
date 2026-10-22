"use client";

import Image from "next/image";
import { FaArrowLeft, FaImage, FaImages } from "react-icons/fa6";

import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  onOpen: () => void;
};

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const cover = project.images[0];

  return (
    <article className="group relative isolate overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-primary/60 [transform:translateZ(0)]">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`عرض مشروع ${project.title_ar} وصوره`}
        className="relative block aspect-[2.35/1] w-full overflow-hidden text-start focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
      >
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt || project.title_ar}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="scale-[1.01] object-cover [backface-visibility:hidden] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-muted">
            <FaImage aria-hidden="true" className="size-8" />
          </span>
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px bg-gradient-to-t from-black/90 via-black/25 to-transparent [transform:translateZ(0)]"
        />

        <span className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm">
          <FaImages aria-hidden="true" className="size-3" />
          {project.images.length} صور
        </span>

        <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
          <span className="min-w-0">
            <span className="mb-1 block truncate text-[10px] font-medium text-[#E2B858]">
              {project.category_ar}
            </span>

            <span className="block truncate text-sm font-semibold leading-6 text-white sm:text-base">
              {project.title_ar}
            </span>

            {project.description_ar && (
              <span className="mt-1 block truncate text-xs leading-5 text-white/75">
                {project.description_ar}
              </span>
            )}
          </span>

          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary"
          >
            <FaArrowLeft className="size-3" />
          </span>
        </span>
      </button>
    </article>
  );
}
