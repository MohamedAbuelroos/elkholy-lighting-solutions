import { CatalogResults } from "@/components/products/catalog/catalog-results";
import { getCatalog, type CatalogSort } from "@/lib/queries/products";

export type CatalogPromise = ReturnType<typeof getCatalog>;

type CatalogContentProps = {
  catalogPromise: CatalogPromise;
  categorySlug?: string;
  subcategorySlug?: string;
  searchQuery: string;
  sort: CatalogSort;
};

export async function CatalogContent({
  catalogPromise,
  categorySlug,
  subcategorySlug,
  searchQuery,
  sort,
}: CatalogContentProps) {
  const catalog = await catalogPromise;

  const params = new URLSearchParams();

  if (categorySlug) params.set("category", categorySlug);
  if (subcategorySlug) params.set("subcategory", subcategorySlug);
  if (searchQuery) params.set("q", searchQuery);
  if (sort !== "default") params.set("sort", sort);

  params.set("page", String(catalog.page + 1));

  return (
    <CatalogResults
      products={catalog.products}
      categories={catalog.categories}
      invalidCategory={catalog.invalidCategory || catalog.invalidSubcategory}
      sort={sort}
      totalResults={catalog.totalResults}
      hasMore={catalog.hasMore}
      loadMoreHref={`/products?${params.toString()}`}
      searchQuery={searchQuery}
      subcategories={catalog.subcategories}
      selectedSubcategorySlug={subcategorySlug ?? ""}
      transitionKey={JSON.stringify([
        categorySlug,
        subcategorySlug,
        searchQuery,
        sort,
      ])}
    />
  );
}
