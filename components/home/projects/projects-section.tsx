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
      className="section-space border-t border-border bg-background"
    >
      <div className="site-container">
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-medium text-primary sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              من الفكرة إلى المكان
            </p>

            <h2
              id="projects-title"
              className="text-4xl font-bold leading-[1.4] sm:text-5xl"
            >
              مشاريعنا،
              <span className="mt-1 block text-primary">تفاصيل تتحدث عنا.</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm leading-7 text-muted">
              إضاءة وتشطيبات وحلول تتكامل مع التصميم، لتمنح كل مساحة طابعها
              الخاص.
            </p>

            <Link
              href={routes.projects}
              className="mt-4 inline-flex min-h-10 items-center gap-3 text-sm font-medium text-primary"
            >
              جميع المشاريع
              <FaArrowLeft aria-hidden="true" className="size-3" />
            </Link>
          </div>
        </div>

        <ProjectsGrid projects={projects} />
      </div>
    </section>
  );
}
