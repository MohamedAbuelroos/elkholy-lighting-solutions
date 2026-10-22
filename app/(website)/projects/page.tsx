import type { Metadata } from "next";
import Link from "next/link";

import { ProjectsGrid } from "@/components/projects/projects-grid";
import { routes } from "@/config/routes";
import { getPublicProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "مشاريعنا | الخولي",
  description:
    "استكشف مشاريع الخولي في الإضاءة والتشطيبات الكهربائية والحلول المتكاملة، وشاهد تفاصيل كل مشروع بالصور.",
};

export const dynamic = "force-dynamic";

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;

  const requestedPage =
    typeof params.page === "string" && /^[1-9]\d*$/.test(params.page)
      ? Number(params.page)
      : 1;

  const { projects, total, page, hasMore } =
    await getPublicProjects(requestedPage);

  return (
    <div className="bg-background pb-16 pt-28 text-foreground sm:pb-24 lg:pt-32">
      <div className="site-container">
        <nav aria-label="مسار التنقل">
          <ol className="flex items-center gap-3 text-xs text-muted">
            <li>
              <Link
                href={routes.home}
                className="transition-colors hover:text-primary"
              >
                الرئيسية
              </Link>
            </li>

            <li aria-hidden="true">›</li>

            <li aria-current="page" className="text-foreground">
              مشاريعنا
            </li>
          </ol>
        </nav>

        <header className="border-b border-border pb-9 pt-9 sm:pb-12 sm:pt-12">
          <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
            من الفكرة إلى التنفيذ
          </p>

          <h1 className="text-4xl font-semibold leading-relaxed sm:text-5xl">
            تفاصيل نفخر بها،
            <span className="block text-primary">ومساحات تحكي شغلنا.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-8 text-muted sm:text-base">
            شاهد مجموعة من أعمال الخولي، وافتح أي مشروع لاستكشاف صوره والتفاصيل
            التي صنعت طابعه.
          </p>
        </header>

        <section
          id="projects-list"
          aria-labelledby="projects-list-title"
          className="pt-8 sm:pt-10"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 id="projects-list-title" className="text-base font-semibold">
              أعمال الخولي
            </h2>

            <p className="text-xs tabular-nums text-muted">
              عرض {projects.length} من {total} مشروع
            </p>
          </div>

          {projects.length > 0 ? (
            <ProjectsGrid
              projects={projects}
              nextPage={hasMore ? page + 1 : undefined}
            />
          ) : (
            <div className="rounded-card border border-dashed border-border bg-surface px-5 py-16 text-center">
              <h3 className="text-xl font-semibold">نجهّز معرض أعمالنا</h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                سنشارككم مشاريعنا هنا قريبًا. يسعدنا تواصلكم لمعرفة المزيد عن
                حلول الخولي.
              </p>

              <Link
                href={routes.links}
                className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-primary"
              >
                تواصل معنا
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
