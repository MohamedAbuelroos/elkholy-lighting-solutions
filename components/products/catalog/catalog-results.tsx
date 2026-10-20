import Link from "next/link";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { ProductCard } from "@/components/home/products/product-card";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { CatalogSort } from "@/components/products/catalog/catalog-sort";
import type { CatalogSort as CatalogSortValue } from "@/lib/queries/products";
import { CatalogSearch } from "@/components/products/catalog/catalog-search";
import { CatalogSubcategory } from "@/components/products/catalog/catalog-subcategory";
import { LightTrails } from "@/components/ui/light-trails";

type CatalogResultsProps = {
  products: Product[];
  categories: Category[];
  invalidCategory: boolean;
  sort: CatalogSortValue;
  totalResults: number;
  hasMore: boolean;
  loadMoreHref: string;
  searchQuery: string;
  transitionKey: string;
  subcategories: Category[];
  selectedSubcategorySlug: string;
};

export function CatalogResults({
  products,
  categories,
  invalidCategory,
  sort,
  totalResults,
  hasMore,
  loadMoreHref,
  searchQuery,
  transitionKey,
  subcategories,
  selectedSubcategorySlug,
}: CatalogResultsProps) {
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name_ar]),
  );

  return (
    <section aria-labelledby="catalog-results-title" className="py-8 sm:py-10">
      <div className="site-container relative isolate overflow-hidden rounded-2xl border border-primary/20 bg-surface px-6 py-8 sm:px-8 sm:py-10">
        <LightTrails variant="flow" />
        <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
          <h2
            id="catalog-results-title"
            className="text-sm font-semibold text-foreground"
          >
            {invalidCategory ? "الفئة غير متاحة" : "اكتشف المنتجات"}
          </h2>

          <p role="status" className="mt-1 text-xs text-muted">
            عدد النتائج:{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {totalResults}
            </span>
          </p>
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CatalogSearch initialQuery={searchQuery} />

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {subcategories.length > 0 && (
              <CatalogSubcategory
                key={JSON.stringify(subcategories.map((item) => item.id))}
                items={subcategories.map((category) => ({
                  slug: category.slug,
                  name: category.name_ar,
                }))}
                value={selectedSubcategorySlug}
              />
            )}

            <CatalogSort value={sort} />
          </div>
        </div>

        {products.length > 0 ? (
          <div
            key={transitionKey}
            className="catalog-enter grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={
                  categoryNames.get(product.category_id) ?? "منتجات الخولي"
                }
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <FaMagnifyingGlass
              aria-hidden="true"
              className="mx-auto mb-4 size-7 text-primary"
            />

            <h3 className="text-lg font-semibold text-foreground">
              {invalidCategory
                ? "لم نجد الفئة المطلوبة"
                : searchQuery
                  ? "لا توجد منتجات تطابق بحثك"
                  : "لا توجد منتجات في هذه الفئة حاليًا"}
            </h3>

            <p className="mt-3 text-sm leading-7 text-muted">
              يمكنك اختيار فئة أخرى أو استعراض جميع المنتجات.
            </p>

            <Link
              href="/products"
              scroll={false}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              جميع المنتجات
            </Link>
          </div>
        )}
        {products.length > 0 && (
          <div className="mt-9 flex flex-col items-center gap-4">
            <p className="text-xs text-muted">
              عرض{" "}
              <span className="font-semibold text-foreground">
                {products.length}
              </span>{" "}
              من أصل{" "}
              <span className="font-semibold text-foreground">
                {totalResults}
              </span>{" "}
              منتجًا
            </p>

            {hasMore && (
              <Link
                href={loadMoreHref}
                scroll={false}
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-primary/40 bg-surface px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                عرض المزيد
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
