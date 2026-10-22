import { CatalogCategories } from "@/components/products/catalog/catalog-categories";
import type { CatalogPromise } from "@/components/products/catalog/catalog-content";

type CatalogCategoryNavigationProps = {
  catalogPromise: CatalogPromise;
  selectedSlug?: string;
};

export async function CatalogCategoryNavigation({
  catalogPromise,
  selectedSlug,
}: CatalogCategoryNavigationProps) {
  const catalog = await catalogPromise;

  return (
    <CatalogCategories
      categories={catalog.categories.filter(
        (category) => category.parent_id === null,
      )}
      selectedSlug={selectedSlug}
      categoryCounts={catalog.categoryCounts}
      totalProducts={catalog.totalProducts}
    />
  );
}
