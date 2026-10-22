import { ProjectCard } from "@/components/home/projects/project-card";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  const featuredProjects = projects
    .filter((project) => project.is_active && project.is_featured)
    .sort((first, second) => first.sort_order - second.sort_order)
    .slice(0, 3);

  if (featuredProjects.length === 0) return null;

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
              className="text-4xl font-bold leading-[1.4] text-foreground sm:text-5xl"
            >
              مشاريعنا，
              <span className="mt-1 block text-primary">تفاصيل تتحدث عنا.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted">
            إضاءة وتشطيبات وحلول تتكامل مع التصميم، لتمنح كل مساحة طابعها الخاص.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
