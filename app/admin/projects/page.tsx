import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminProjects } from "@/lib/admin/queries/projects";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import { ProjectCleanupNotice } from "@/components/admin/projects/project-cleanup-notice";
import { getAllPendingProjectImageCleanupCount } from "@/lib/admin/queries/project-images";

export const metadata: Metadata = {
  title: "المشاريع",
};

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    success?: string | string[];
  }>;
};

export default async function AdminProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const query = await searchParams;

  const requestedPage =
    typeof query.page === "string" && /^\d+$/.test(query.page)
      ? Number(query.page)
      : 1;

  const [projectsResult, pendingCleanupCount] = await Promise.all([
    getAdminProjects(requestedPage),
    getAllPendingProjectImageCleanupCount(),
  ]);

  const { projects, total, page, pageSize } = projectsResult;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (page > totalPages) {
    redirect(`/admin/projects?page=${totalPages}`);
  }

  return (
    <section>
      {query.success === "deleted" && (
        <AdminSuccessNotice title="تم حذف المشروع." />
      )}

      <ProjectCleanupNotice pendingCount={pendingCleanupCount} />
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-medium text-primary">أعمال الخولي</p>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">المشاريع</h1>

          <p className="mt-3 text-sm leading-7 text-muted">
            إدارة بيانات المشاريع وصورها وظهورها على الموقع.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          إضافة مشروع
        </Link>
      </div>

      <p className="mb-4 mt-8 text-xs text-muted">إجمالي المشاريع: {total}</p>

      {projects.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface px-5 py-14 text-center">
          <h2 className="text-lg font-semibold">أضف أول مشروع للخولي</h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
            احفظ بيانات المشروع أولًا، ثم جهّز صوره للنشر.
          </p>

          <Link
            href="/admin/projects/new"
            className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-primary"
          >
            إضافة مشروع جديد
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full min-w-[720px] text-start text-sm">
            <caption className="sr-only">
              قائمة المشاريع وحالة نشرها وعدد صورها
            </caption>

            <thead className="border-b border-border bg-background text-xs text-muted">
              <tr>
                <th scope="col" className="px-5 py-4 text-start">
                  المشروع
                </th>
                <th scope="col" className="px-5 py-4 text-start">
                  الحالة
                </th>
                <th scope="col" className="px-5 py-4 text-start">
                  الرئيسية
                </th>
                <th scope="col" className="px-5 py-4 text-start">
                  الصور
                </th>
                <th scope="col" className="px-5 py-4 text-start">
                  الترتيب
                </th>
                <th scope="col" className="px-5 py-4 text-start">
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-5 py-4">
                    <p className="max-w-xs break-words font-medium">
                      {project.title_ar}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      {project.category_ar}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] ${
                        project.is_active
                          ? "border-emerald-500/25 bg-emerald-500/10 text-foreground"
                          : "border-border bg-background text-muted"
                      }`}
                    >
                      {project.is_active ? "منشور" : "مسودة"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-muted">
                    {project.is_featured ? "مختار" : "—"}
                  </td>

                  <td className="px-5 py-4 text-xs tabular-nums text-muted">
                    {project.imageCount} / 10
                  </td>

                  <td className="px-5 py-4 tabular-nums">
                    {project.sort_order}
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      aria-label={`تعديل ${project.title_ar}`}
                      className="inline-flex min-h-10 items-center text-xs font-medium text-primary"
                    >
                      تعديل المشروع
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="صفحات المشاريع"
          className="mt-6 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="text-xs text-muted">
            الصفحة {page} من {totalPages}
          </p>

          <div className="flex gap-3">
            {page > 1 && (
              <Link
                href={`/admin/projects?page=${page - 1}`}
                className="inline-flex min-h-10 items-center rounded-control border border-border px-4 text-xs"
              >
                السابق
              </Link>
            )}

            {page < totalPages && (
              <Link
                href={`/admin/projects?page=${page + 1}`}
                className="inline-flex min-h-10 items-center rounded-control border border-border px-4 text-xs"
              >
                التالي
              </Link>
            )}
          </div>
        </nav>
      )}
    </section>
  );
}
