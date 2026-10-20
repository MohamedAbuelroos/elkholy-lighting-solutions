import type { Metadata } from "next";

import { CatalogHero } from "@/components/products/catalog/catalog-hero";
import { CatalogCategories } from "@/components/products/catalog/catalog-categories";
import { CatalogResults } from "@/components/products/catalog/catalog-results";
import { getCatalog, type CatalogSort } from "@/lib/queries/products";
import { CatalogHelpBanner } from "@/components/products/catalog/catalog-help-banner";

export const metadata: Metadata = {
  title: "المنتجات | الخولي",
  description:
    "استكشف منتجات الخولي للإضاءة والتشطيبات الكهربائية والأنظمة الذكية والصوتية.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    sort?: string | string[];
    page?: string | string[];
    q?: string | string[];
    subcategory?: string | string[];
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const searchQuery =
    typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";

  const categorySlug =
    typeof params.category === "string"
      ? params.category.trim() || undefined
      : undefined;

  const subcategorySlug =
    typeof params.subcategory === "string"
      ? params.subcategory.trim() || undefined
      : undefined;

  const sort: CatalogSort =
    params.sort === "price-asc" || params.sort === "price-desc"
      ? params.sort
      : "default";

  const requestedPage =
    typeof params.page === "string" && /^[1-9]\d*$/.test(params.page)
      ? Number(params.page)
      : 1;

  const catalog = await getCatalog({
    categorySlug,
    subcategorySlug,
    sort,
    page: requestedPage,
    query: searchQuery,
  });

  const nextParams = new URLSearchParams();

  if (categorySlug) nextParams.set("category", categorySlug);
  if (sort !== "default") nextParams.set("sort", sort);

  if (searchQuery) nextParams.set("q", searchQuery);

  if (subcategorySlug) {
    nextParams.set("subcategory", subcategorySlug);
  }
  nextParams.set("page", String(catalog.page + 1));

  const loadMoreHref = `/products?${nextParams.toString()}`;

  const title = catalog.invalidCategory
    ? "الفئة غير موجودة"
    : (catalog.selectedCategory?.name_ar ?? "جميع المنتجات");

  const description = catalog.invalidCategory
    ? "الفئة المطلوبة غير متاحة. استكشف بقية فئات ومنتجات الخولي."
    : (catalog.selectedCategory?.description_ar ??
      "اكتشف حلول الإضاءة والتشطيبات الكهربائية والأنظمة الذكية، واختر التفاصيل التي تكمل مساحتك.");

  const transitionKey = categorySlug ?? "all";

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <CatalogHero
        title={title}
        description={description}
        transitionKey={transitionKey}
        selectedCategoryName={
          catalog.selectedCategory?.name_ar ??
          (catalog.invalidCategory ? "فئة غير موجودة" : undefined)
        }
        imageSrc={catalog.selectedCategory?.image_path ?? undefined}
      />

      <CatalogCategories
        categories={catalog.categories.filter(
          (category) => category.parent_id === null,
        )}
        selectedSlug={categorySlug}
        categoryCounts={catalog.categoryCounts}
        totalProducts={catalog.totalProducts}
      />

      <CatalogResults
        products={catalog.products}
        categories={catalog.categories}
        invalidCategory={catalog.invalidCategory || catalog.invalidSubcategory}
        sort={sort}
        totalResults={catalog.totalResults}
        hasMore={catalog.hasMore}
        loadMoreHref={loadMoreHref}
        searchQuery={searchQuery}
        transitionKey={`${transitionKey}-${subcategorySlug ?? "all-types"}-${sort}-${searchQuery}`}
        subcategories={catalog.subcategories}
        selectedSubcategorySlug={subcategorySlug ?? ""}
      />

      <CatalogHelpBanner
        categoryName={
          catalog.selectedSubcategory?.name_ar ??
          catalog.selectedCategory?.name_ar
        }
      />
    </div>
  );
}
