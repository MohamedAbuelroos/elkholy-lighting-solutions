import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

import { ProjectsGrid } from "@/components/projects/projects-grid";
import { routes } from "@/config/routes";
import { getFeaturedProjects } from "@/lib/queries/projects";

export async function ProjectsSection() {
  const projects = await getFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="section-space relative isolate overflow-hidden border-t border-border bg-surface"
    >
      <div className="site-container">
        <div className="mb-9 grid gap-6 lg:mb-12 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
              <span
                aria-hidden="true"
                className="h-px w-8 shrink-0 bg-primary/70"
              />
              من الفكرة إلى المكان
            </p>

            <h2
              id="projects-title"
              className="text-[clamp(1.875rem,3vw,2.75rem)] font-bold leading-[1.55] text-foreground"
            >
              هنا، تكتمل الصورة.
              <span className="block text-primary">وتظهر حكاية التفاصيل.</span>
            </h2>
          </div>

          <div className="max-w-md lg:justify-self-end">
            <p className="text-sm leading-8 text-muted">
              مساحات مختلفة، ولكل منها طابعها. شاهد كيف تتكامل الإضاءة
              والتشطيبات مع التصميم، واكتشف التفاصيل من داخل كل مشروع.
            </p>

            <Link
              href={routes.projects}
              className="group mt-5 inline-flex min-h-11 items-center gap-4 rounded-full border border-border bg-background px-5 text-xs font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
            >
              استكشف جميع المشاريع
              <FaArrowLeft
                aria-hidden="true"
                className="size-3 transition-transform duration-300 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>

        <ProjectsGrid projects={projects} />

        <div
          aria-hidden="true"
          className="mt-8 flex items-center gap-4 sm:mt-10"
        >
          <span className="h-px flex-1 bg-border" />

          <span className="size-1 rotate-45 bg-primary/60" />

          <span className="h-px w-12 bg-primary/40" />
        </div>
      </div>
    </section>
  );
}
