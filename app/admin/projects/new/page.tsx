import type { Metadata } from "next";
import Link from "next/link";

import { createProject } from "@/app/admin/projects/actions";
import { ProjectForm } from "@/components/admin/projects/project-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "إضافة مشروع",
};

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <section>
      <Link
        href="/admin/projects"
        className="text-sm text-muted transition-colors hover:text-primary"
      >
        المشاريع / إضافة مشروع
      </Link>

      <div className="mb-8 mt-6">
        <p className="text-xs font-medium text-primary">أعمال الخولي</p>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          إضافة مشروع جديد
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          ابدأ ببيانات المشروع. سيتم حفظه كمسودة، ثم يمكنك إضافة صوره وتجهيزه
          للنشر.
        </p>
      </div>

      <ProjectForm action={createProject} submitLabel="إنشاء مسودة المشروع" />
    </section>
  );
}
