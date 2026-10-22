"use client";

import Form from "next/form";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";

import type { AdminCategoryOption } from "@/lib/admin/queries/categories";
import type { AdminProductFilters } from "@/lib/admin/product-filters";

type ProductFiltersProps = {
  filters: AdminProductFilters;
  categories: AdminCategoryOption[];
};

const inputClassName =
  "mt-2 min-h-11 w-full min-w-0 rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

function getCategoryLabel(
  category: AdminCategoryOption,
  categoriesById: Map<string, AdminCategoryOption>,
): string {
  const names: string[] = [];
  const visited = new Set<string>();

  let current: AdminCategoryOption | undefined = category;
  let isHidden = false;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    names.unshift(current.name_ar);

    if (!current.is_active) isHidden = true;

    current = current.parent_id
      ? categoriesById.get(current.parent_id)
      : undefined;
  }

  return `${names.join(" / ")}${isHidden ? " — مخفية" : ""}`;
}

function FilterFields({ filters, categories }: ProductFiltersProps) {
  const { pending } = useFormStatus();

  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  );

  const hasFilters =
    Boolean(filters.query || filters.categoryId) || filters.status !== "all";

  return (
    <>
      <fieldset
        disabled={pending}
        className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_150px_auto]"
      >
        <legend className="sr-only">البحث وفلترة المنتجات</legend>

        <div>
          <label htmlFor="admin-product-search" className="text-xs font-medium">
            البحث عن منتج
          </label>

          <input
            id="admin-product-search"
            name="q"
            type="search"
            maxLength={120}
            defaultValue={filters.query}
            placeholder="اسم المنتج أو كوده..."
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="admin-product-category"
            className="text-xs font-medium"
          >
            الفئة
          </label>

          <select
            id="admin-product-category"
            name="category"
            defaultValue={filters.categoryId}
            className={inputClassName}
          >
            <option value="">جميع الفئات</option>

            {filters.categoryId && !categoriesById.has(filters.categoryId) && (
              <option value={filters.categoryId}>فئة غير متاحة</option>
            )}

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {getCategoryLabel(category, categoriesById)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="admin-product-status" className="text-xs font-medium">
            حالة المنتج
          </label>

          <select
            id="admin-product-status"
            name="status"
            defaultValue={filters.status}
            className={inputClassName}
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="hidden">مخفي</option>
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-control bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60"
        >
          <FaMagnifyingGlass aria-hidden="true" className="size-3.5" />
          {pending ? "جارٍ البحث..." : "تطبيق"}
        </button>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-xs leading-6 text-muted">
          {pending
            ? "جارٍ تحديث نتائج المنتجات..."
            : "اختيار فئة يشمل منتجات الأقسام المتفرعة منها."}
        </p>

        {hasFilters && (
          <Link
            href="/admin/products"
            scroll={false}
            className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
          >
            مسح الفلاتر
          </Link>
        )}
      </div>
    </>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  return (
    <Form
      action="/admin/products"
      scroll={false}
      aria-label="البحث وفلترة منتجات الإدارة"
      className="mb-6 rounded-card border border-border bg-surface p-5"
    >
      <FilterFields {...props} />
    </Form>
  );
}
