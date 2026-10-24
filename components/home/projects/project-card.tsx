"use client";

import Image from "next/image";
import { FaArrowLeft, FaImage, FaImages } from "react-icons/fa6";

import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  onOpen: () => void;
};

const countFormatter = new Intl.NumberFormat("ar-EG");

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const cover = project.images[0];
  const imageCount = project.images.length;

  return (
    <article className="h-full min-w-0">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`عرض مشروع ${project.title_ar} وصوره`}
        className="group/project flex h-full w-full min-w-0 flex-col rounded-2xl text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        {/* Project cover */}
        <span className="relative isolate block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated transition-colors duration-300 group-hover/project:border-primary/50 group-focus-visible/project:border-primary/50 motion-reduce:transition-none [transform:translateZ(0)]">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt || project.title_ar}
              fill
              sizes="(min-width: 1360px) 430px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="scale-[1.01] object-cover [backface-visibility:hidden] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover/project:scale-[1.05] motion-safe:group-focus-visible/project:scale-[1.05] motion-reduce:transition-none"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-muted">
              <FaImage aria-hidden="true" className="size-10 opacity-40" />
            </span>
          )}

          {/* Fixed overlay to avoid moving edges */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px bg-gradient-to-b from-black/35 via-transparent to-black/55 [transform:translateZ(0)]"
          />

          {/* Category */}
          {project.category_ar && (
            <span className="absolute start-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-medium leading-5 text-white sm:start-5 sm:top-5">
              {project.category_ar}
            </span>
          )}

          {/* Gallery information */}
          <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 sm:inset-x-5 sm:bottom-5">
            <span className="inline-flex items-center gap-2 text-[11px] font-medium text-white/90">
              <FaImages
                aria-hidden="true"
                className="size-3.5 text-[#E2B858]"
              />

              {imageCount > 0
                ? `${countFormatter.format(imageCount)} صور للمشروع`
                : "اكتشف المشروع"}
            </span>

            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-black/20 text-white transition-colors duration-300 group-hover/project:border-[#E2B858] group-hover/project:bg-[#E2B858] group-hover/project:text-[#05070B] group-focus-visible/project:border-[#E2B858] group-focus-visible/project:bg-[#E2B858] group-focus-visible/project:text-[#05070B] motion-reduce:transition-none"
            >
              {/* <FaArrowUpLeft className="size-3.5 transition-transform duration-300 motion-safe:group-hover/project:-translate-x-0.5 motion-safe:group-hover/project:-translate-y-0.5 motion-reduce:transition-none" /> */}
            </span>
          </span>
        </span>

        {/* Project information */}
        <span className="flex w-full flex-1 flex-col px-1 pb-1 pt-5">
          <span className="flex items-start justify-between gap-4">
            <span className="line-clamp-2 min-h-14 text-lg font-medium leading-7 text-foreground transition-colors duration-300 group-hover/project:text-primary group-focus-visible/project:text-primary motion-reduce:transition-none">
              {project.title_ar}
            </span>

            <span
              aria-hidden="true"
              className="mt-1.5 h-px w-7 shrink-0 bg-primary/50 transition-[width] duration-300 motion-safe:group-hover/project:w-11 motion-reduce:transition-none"
            />
          </span>

          <span className="mt-2 block min-h-12">
            {project.description_ar && (
              <span className="line-clamp-2 text-xs leading-6 text-muted">
                {project.description_ar}
              </span>
            )}
          </span>

          <span className="mt-auto block pt-5">
            <span className="flex items-center justify-between gap-3 border-t border-border pt-3">
              <span className="text-[11px] font-medium text-muted transition-colors duration-300 group-hover/project:text-primary group-focus-visible/project:text-primary motion-reduce:transition-none">
                شاهد تفاصيل المكان
              </span>

              <FaArrowLeft
                aria-hidden="true"
                className="size-3 text-primary transition-transform duration-300 motion-safe:group-hover/project:-translate-x-1 motion-reduce:transition-none"
              />
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}
