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

  const imageCountLabel =
    imageCount === 1
      ? "صورة واحدة"
      : imageCount === 2
        ? "صورتان"
        : imageCount <= 10
          ? `${countFormatter.format(imageCount)} صور`
          : `${countFormatter.format(imageCount)} صورة`;

  return (
    <article className="h-full min-w-0">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`عرض مشروع ${project.title_ar} وصوره`}
        className="group/project flex h-full w-full min-w-0 flex-col rounded-[1.5rem] text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        {/* Cover */}
        <span className="relative isolate block aspect-[4/3] lg:aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] border border-border bg-surface-elevated transition-colors duration-300 group-hover/project:border-primary/45 group-focus-visible/project:border-primary/45 motion-reduce:transition-none">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt || project.title_ar}
              fill
              sizes="(min-width: 1360px) 430px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover/project:scale-[1.045] motion-safe:group-focus-visible/project:scale-[1.045]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-muted">
              <FaImage aria-hidden="true" className="size-10 opacity-40" />
            </span>
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070B]/75 via-transparent to-[#05070B]/15"
          />

          {/* Quiet inner frame */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[1rem] border border-white/15 transition-colors duration-300 group-hover/project:border-white/30 motion-reduce:transition-none sm:inset-3"
          />

          {project.category_ar && (
            <span className="absolute start-5 top-5 max-w-[calc(100%-2.5rem)] truncate rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-medium leading-5 text-white sm:start-6 sm:top-6">
              {project.category_ar}
            </span>
          )}

          <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
            <span className="min-w-0">
              <span className="block text-[9px] font-medium tracking-[0.16em] text-[#E8CC91]">
                ELKHOLY PROJECTS
              </span>

              <span className="mt-2 flex items-center gap-2 text-[11px] leading-6 text-white/85">
                <FaImages aria-hidden="true" className="size-3.5 shrink-0" />

                {imageCount > 0
                  ? `${imageCountLabel} من المشروع`
                  : "اكتشف تفاصيل المشروع"}
              </span>
              <span className="mt-1 block text-[10px] leading-5 text-white/65">
                عرض الصور والتفاصيل
              </span>
            </span>

            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-black/15 text-white transition-colors duration-300 group-hover/project:border-[#D6A744] group-hover/project:bg-[#D6A744] group-hover/project:text-[#17120A] group-focus-visible/project:border-[#D6A744] group-focus-visible/project:bg-[#D6A744] group-focus-visible/project:text-[#17120A] motion-reduce:transition-none"
            >
              <FaArrowLeft className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/project:-translate-x-0.5 motion-safe:group-hover/project:-translate-y-0.5" />
            </span>
          </span>
        </span>

        {/* Information */}
        <span className="flex w-full flex-1 flex-col px-1 pt-5">
          <span className="flex items-start justify-between gap-4">
            <span className="line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-foreground transition-colors duration-300 group-hover/project:text-primary group-focus-visible/project:text-primary motion-reduce:transition-none">
              {project.title_ar}
            </span>

            <span
              aria-hidden="true"
              className="mt-3 h-px w-8 shrink-0 bg-primary/45"
            />
          </span>

          <span className="mt-1 block min-h-6">
            {project.description_ar && (
              <span className="line-clamp-1 text-xs leading-6 text-muted">
                {project.description_ar}
              </span>
            )}
          </span>
        </span>
      </button>
    </article>
  );
}
