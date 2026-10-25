import { ProjectsEmpty } from "@/components/projects/projects-empty";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import type { Project } from "@/types/project";

type ProjectsGalleryProps = {
  projects: Project[];
  total: number;
  nextPage?: number;
};

const countFormatter = new Intl.NumberFormat("ar-EG");

export function ProjectsGallery({
  projects,
  total,
  nextPage,
}: ProjectsGalleryProps) {
  const hasProjects = projects.length > 0;

  return (
    <section
      id="projects-list"
      aria-labelledby="projects-list-title"
      className="section-space scroll-mt-28"
    >
      <div className="site-container">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <h2
              id="projects-list-title"
              className="text-base font-medium text-foreground"
            >
              معرض الأعمال
            </h2>

            <span
              aria-label={`${total} مشروع في المعرض`}
              className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-2 text-[11px] font-medium tabular-nums text-primary"
            >
              {countFormatter.format(total)}
            </span>
          </div>

          {hasProjects && (
            <p className="text-[11px] leading-6 tabular-nums text-muted">
              عرض {countFormatter.format(projects.length)} من{" "}
              {countFormatter.format(total)} مشروع
            </p>
          )}
        </div>

        {hasProjects ? (
          <ProjectsGrid projects={projects} nextPage={nextPage} />
        ) : (
          <ProjectsEmpty />
        )}
      </div>
    </section>
  );
}
