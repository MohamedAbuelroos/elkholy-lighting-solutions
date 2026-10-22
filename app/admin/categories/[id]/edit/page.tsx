import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateCategory } from "@/app/admin/categories/actions";
import { CategoryForm } from "@/components/admin/categories/category-form";
import { getAdminCategories } from "@/lib/admin/queries/categories";
import { CategoryImageManager } from "@/components/admin/categories/category-image-manager";

export const metadata: Metadata = {
  title: "تعديل الفئة",
};

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const categories = await getAdminCategories();

  const category = categories.find((item) => item.id === id);

  if (!category) notFound();

  // استبعاد الفئة نفسها وكل الفئات المتفرعة منها من قائمة الفئة الأم.
  const excludedIds = new Set<string>([category.id]);
  const pendingIds = [category.id];

  while (pendingIds.length > 0) {
    const parentId = pendingIds.pop();

    for (const item of categories) {
      if (item.parent_id === parentId && !excludedIds.has(item.id)) {
        excludedIds.add(item.id);
        pendingIds.push(item.id);
      }
    }
  }

  const parentOptions = categories.filter((item) => !excludedIds.has(item.id));

  const action = updateCategory.bind(null, category.id);

  return (
    <section>
      <Link
        href="/admin/categories"
        className="text-sm text-muted transition-colors hover:text-primary"
      >
        فئات المنتجات / تعديل الفئة
      </Link>

      <div className="mb-8 mt-6">
        <p className="text-xs font-medium text-primary">تنظيم الكتالوج</p>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          تعديل {category.name_ar}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          تغيير الفئة الأم ينقل الفئة وكل الأقسام المتفرعة منها. إخفاء الفئة
          يخفي أقسامها ومنتجاتها عن الزوار.
        </p>
      </div>

      <CategoryForm
        key={category.id}
        action={action}
        categories={parentOptions}
        submitLabel="حفظ التعديلات"
        initialValues={{
          name_ar: category.name_ar,
          name_en: category.name_en ?? "",
          slug: category.slug,
          description_ar: category.description_ar ?? "",
          description_en: category.description_en ?? "",
          parent_id: category.parent_id ?? "",
          sort_order: String(category.sort_order),
          is_active: category.is_active,
        }}
      />
      <CategoryImageManager
        key={`${category.id}:${category.image_path ?? "empty"}`}
        categoryId={category.id}
        categoryName={category.name_ar}
        imageSrc={category.image_path}
      />
    </section>
  );
}
