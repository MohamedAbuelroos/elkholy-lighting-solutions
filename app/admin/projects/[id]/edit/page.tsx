import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProject } from "@/app/admin/projects/actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import { ProjectForm } from "@/components/admin/projects/project-form";
import { getAdminProjectById } from "@/lib/admin/queries/projects";
import { ProjectImagesManager } from "@/components/admin/projects/project-images-manager";
import {
  getAdminProjectImages,
  getPendingProjectImageCleanupCount,
} from "@/lib/admin/queries/project-images";
import {
  DeleteProjectControl,
  ProjectPublicationControl,
} from "@/components/admin/projects/project-controls";

export const metadata: Metadata = {
  title: "تعديل المشروع",
};

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    success?: string | string[];
  }>;
};

export default async function EditProjectPage({
  params,
  searchParams,
}: EditProjectPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);

  const [project, images, pendingCleanupCount] = await Promise.all([
    getAdminProjectById(id),
    getAdminProjectImages(id),
    getPendingProjectImageCleanupCount(id),
  ]);

  if (!project) notFound();

  const success = typeof query.success === "string" ? query.success : undefined;

  const action = updateProject.bind(null, project.id);

  return (
    <section>
      {success === "created" && (
        <AdminSuccessNotice
          key={`created:${project.updated_at}`}
          title="تم إنشاء المشروع بنجاح."
          description="تم حفظه كمسودة."
        />
      )}

      {success === "updated" && (
        <AdminSuccessNotice
          key={`updated:${project.updated_at}`}
          title="تم حفظ تعديلات المشروع."
        />
      )}

      <Link
        href="/admin/projects"
        className="text-sm text-muted transition-colors hover:text-primary"
      >
        المشاريع / تعديل المشروع
      </Link>

      <div className="mb-8 mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-medium text-primary">أعمال الخولي</p>

          <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] text-muted">
            {project.is_active ? "منشور" : "مسودة"}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          تعديل {project.title_ar}
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted">
          حدّث بيانات المشروع وترتيبه واختياره للصفحة الرئيسية.
        </p>
      </div>

      <ProjectPublicationControl
        projectId={project.id}
        isActive={project.is_active}
      />
      <ProjectForm
        key={`${project.id}:${project.updated_at}`}
        action={action}
        submitLabel="حفظ التعديلات"
        initialValues={{
          title_ar: project.title_ar,
          title_en: project.title_en ?? "",
          category_ar: project.category_ar,
          category_en: project.category_en ?? "",
          description_ar: project.description_ar,
          description_en: project.description_en ?? "",
          sort_order: String(project.sort_order),
          is_featured: project.is_featured,
        }}
      />
      <ProjectImagesManager
        key={project.id}
        projectId={project.id}
        projectName={project.title_ar}
        images={images}
        pendingCleanupCount={pendingCleanupCount}
      />
      <DeleteProjectControl
        projectId={project.id}
        projectName={project.title_ar}
        isActive={project.is_active}
      />
    </section>
  );
}
