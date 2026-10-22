import type { Metadata } from "next";
import Link from "next/link";

import { createCategory } from "@/app/admin/categories/actions";
import { CategoryForm } from "@/components/admin/categories/category-form";
import { getAdminCategories } from "@/lib/admin/queries/categories";

export const metadata: Metadata = {
  title: "إضافة فئة",
};

export default async function NewCategoryPage() {
  const categories = await getAdminCategories();

  return (
    <section>
      <Link
        href="/admin/categories"
        className="text-sm text-muted transition-colors hover:text-primary"
      >
        فئات المنتجات / إضافة فئة
      </Link>

      <div className="mb-8 mt-6">
        <p className="text-xs font-medium text-primary">تنظيم الكتالوج</p>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">إضافة فئة جديدة</h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          أضف فئة أساسية أو اختر الفئة الأم لإنشاء قسم فرعي داخلها.
        </p>
      </div>

      <CategoryForm
        action={createCategory}
        categories={categories}
        submitLabel="إضافة الفئة"
      />
    </section>
  );
}
