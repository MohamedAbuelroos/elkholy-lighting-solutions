import type { Metadata } from "next";
import Link from "next/link";

import { createProduct } from "@/app/admin/products/actions";
import { ProductForm } from "@/components/admin/products/product-form";
import { getAdminCategories } from "@/lib/admin/queries/categories";

export const metadata: Metadata = {
  title: "إضافة منتج",
};

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <section>
      <Link
        href="/admin/products"
        className="text-sm text-muted transition-colors hover:text-primary"
      >
        المنتجات / إضافة منتج
      </Link>

      <div className="mb-8 mt-6">
        <p className="text-xs font-medium text-primary">إدارة الكتالوج</p>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">إضافة منتج جديد</h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          ابدأ ببيانات المنتج وفئته وسعره، واحفظه كمسودة لاستكمال صوره.
        </p>
      </div>

      {categories.length > 0 ? (
        <ProductForm action={createProduct} categories={categories} />
      ) : (
        <div className="rounded-card border border-border bg-surface p-6">
          <p className="text-sm leading-7 text-muted">
            أضف فئة أولًا حتى تتمكن من ربط المنتج بها.
          </p>

          <Link
            href="/admin/categories/new"
            className="mt-4 inline-flex min-h-11 items-center rounded-control bg-primary px-5 text-sm font-semibold text-on-primary"
          >
            إضافة فئة
          </Link>
        </div>
      )}
    </section>
  );
}
