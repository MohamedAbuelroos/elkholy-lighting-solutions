import type { Metadata } from "next";

import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { getAdminCategories } from "@/lib/admin/queries/categories";
import Link from "next/link";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import { CategoryImageCleanupControl } from "@/components/admin/categories/category-image-cleanup-control";

export const metadata: Metadata = {
  title: "فئات المنتجات",
};

type CategoriesPageProps = {
  searchParams: Promise<{
    success?: string | string[];
  }>;
};

export default async function AdminCategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;
  const categories = await getAdminCategories();

  const stats = [
    {
      label: "إجمالي الفئات",
      value: categories.length,
    },
    {
      label: "فئات رئيسية",
      value: categories.filter((category) => category.parent_id === null)
        .length,
    },
    {
      label: "فئات فرعية",
      value: categories.filter((category) => category.parent_id !== null)
        .length,
    },
  ];

  return (
    <section>
      <header>
        <p className="text-xs font-medium text-primary">تنظيم الكتالوج</p>

        <h1 className="mt-3 text-2xl font-semibold">فئات المنتجات</h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          استعرض تقسيم الفئات والعلاقة بين الفئات الرئيسية والفرعية.
        </p>
      </header>
      {(params.success === "created" ||
        params.success === "updated" ||
        params.success === "deleted") && (
        <AdminSuccessNotice
          key={params.success}
          title={
            params.success === "created"
              ? "تمت إضافة الفئة بنجاح"
              : params.success === "updated"
                ? "تم حفظ تعديلات الفئة بنجاح"
                : "تم حذف الفئة بنجاح"
          }
          description="تم تحديث بيانات الكتالوج."
        />
      )}
      <div className="mt-3">
        <Link
          href="/admin/categories/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          <span aria-hidden="true">+</span>
          إضافة فئة جديدة
        </Link>
      </div>
      <dl className="my-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <dt className="text-xs text-muted">{stat.label}</dt>
            <dd className="mt-3 text-2xl font-semibold tabular-nums text-primary">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <CategoriesTable categories={categories} />
      <CategoryImageCleanupControl />

      <p className="mt-4 text-xs leading-7 text-muted">
        عدد المنتجات يخص المنتجات المرتبطة بالفئة مباشرة، بما فيها غير النشطة.
        وحالة التفعيل هي حالة الفئة نفسها؛ تعطيل أحد الآباء يمنع ظهورها للزوار
        حتى لو كانت مفعّلة.
      </p>
    </section>
  );
}
