"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ProjectCard } from "@/components/home/projects/project-card";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { routes } from "@/config/routes";

import type { Project } from "@/types/project";

type ProjectsGridProps = {
  projects: Project[];
  nextPage?: number;
};

export function ProjectsGrid({ projects, nextPage }: ProjectsGridProps) {
  const router = useRouter();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {nextPage !== undefined && (
        <div className="mt-9 text-center">
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              startTransition(() => {
                router.push(`${routes.projects}?page=${nextPage}`, {
                  scroll: false,
                });
              });
            }}
            className="inline-flex min-h-12 min-w-44 items-center justify-center rounded-full border border-primary/40 bg-surface px-7 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-wait disabled:opacity-60"
          >
            {isPending ? "جارٍ تحميل المشاريع..." : "عرض المزيد"}
          </button>

          <p role="status" className="sr-only">
            {isPending ? "جارٍ تحميل المزيد من المشاريع." : ""}
          </p>
        </div>
      )}

      {selectedProject && (
        <ProjectDialog
          key={selectedProject.id}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
