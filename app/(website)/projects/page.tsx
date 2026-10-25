import type { Metadata } from "next";

import { ProjectsGallery } from "@/components/projects/projects-gallery";
import { ProjectsHero } from "@/components/projects/projects-hero";
import { getPublicProjects } from "@/lib/queries/projects";
import { ProjectsContactBanner } from "@/components/projects/projects-contact-banner";

export const metadata: Metadata = {
  title: "مشاريعنا | الخولي",
  description:
    "استكشف مشاريع الخولي في الإضاءة والتشطيبات الكهربائية، وافتح معرض صور كل مشروع للتعرّف على تفاصيله.",
};

export const dynamic = "force-dynamic";

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function parsePage(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return 1;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) ? page : 1;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const requestedPage = parsePage(params.page);

  const { projects, total, page, hasMore } =
    await getPublicProjects(requestedPage);

  return (
    <div className="bg-background text-foreground">
      <ProjectsHero />

      <ProjectsGallery
        projects={projects}
        total={total}
        nextPage={hasMore ? page + 1 : undefined}
      />

      {projects.length > 0 && <ProjectsContactBanner />}
    </div>
  );
}
