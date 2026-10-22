import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogHero } from "@/components/products/catalog/catalog-hero";
import { CatalogContent } from "@/components/products/catalog/catalog-content";
import { CatalogCategoryNavigation } from "@/components/products/catalog/catalog-category-navigation";
import { CatalogSkeleton } from "@/components/products/catalog/catalog-skeleton";
import { CatalogHelpBanner } from "@/components/products/catalog/catalog-help-banner";

import { getActiveCategories } from "@/lib/queries/categories";
import { getCatalog, type CatalogSort } from "@/lib/queries/products";

export const metadata: Metadata = {
  title: "المنتجات | الخولي",
  description:
    "استكشف منتجات الخولي للإضاءة والتشطيبات الكهربائية والأنظمة الذكية والصوتية.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    subcategory?: string | string[];
    q?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};

function readParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() || undefined : undefined;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const categorySlug = readParam(params.category);
  const subcategorySlug = readParam(params.subcategory);
  const searchQuery = (readParam(params.q) ?? "").slice(0, 100);

  const sort: CatalogSort =
    params.sort === "price-asc" || params.sort === "price-desc"
      ? params.sort
      : "default";

  const rawPage = readParam(params.page);

  const requestedPage =
    rawPage && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1;

  // Start the request without waiting for the catalog results here.
  const catalogPromise = getCatalog({
    categorySlug,
    subcategorySlug,
    query: searchQuery,
    sort,
    page: requestedPage,
  });

  const categories = await getActiveCategories();

  const selectedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  const selectedSubcategory = selectedCategory
    ? categories.find(
        (category) =>
          category.slug === subcategorySlug &&
          category.parent_id === selectedCategory.id,
      )
    : undefined;

  const invalidCategory = Boolean(categorySlug && !selectedCategory);

  const title = invalidCategory
    ? "الفئة غير موجودة"
    : (selectedCategory?.name_ar ?? "جميع المنتجات");

  const description = invalidCategory
    ? "الفئة المطلوبة غير متاحة. استكشف بقية منتجات الخولي."
    : (selectedCategory?.description_ar ??
      "اكتشف حلول الإضاءة والتشطيبات الكهربائية والأنظمة الذكية، واختر التفاصيل التي تكمل مساحتك.");

  const resultsKey = JSON.stringify([
    categorySlug,
    subcategorySlug,
    searchQuery,
    sort,
  ]);

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <CatalogHero
        title={title}
        description={description}
        transitionKey={categorySlug ?? "all"}
        selectedCategoryName={
          selectedCategory?.name_ar ??
          (invalidCategory ? "فئة غير موجودة" : undefined)
        }
        imageSrc={selectedCategory?.image_path ?? undefined}
      />

      <Suspense
        fallback={
          <div role="status" className="border-b border-border py-5">
            <span className="sr-only">جارٍ تحميل الفئات…</span>

            <div
              aria-hidden="true"
              className="site-container flex gap-3 overflow-hidden motion-safe:animate-pulse"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-28 min-w-44 flex-1 rounded-xl bg-surface-elevated"
                />
              ))}
            </div>
          </div>
        }
      >
        <CatalogCategoryNavigation
          catalogPromise={catalogPromise}
          selectedSlug={categorySlug}
        />
      </Suspense>

      <Suspense
        key={resultsKey}
        fallback={
          <div className="site-container py-8 sm:py-10">
            <CatalogSkeleton />
          </div>
        }
      >
        <CatalogContent
          catalogPromise={catalogPromise}
          categorySlug={categorySlug}
          subcategorySlug={subcategorySlug}
          searchQuery={searchQuery}
          sort={sort}
        />
      </Suspense>

      <CatalogHelpBanner
        categoryName={selectedSubcategory?.name_ar ?? selectedCategory?.name_ar}
      />
    </div>
  );
}
