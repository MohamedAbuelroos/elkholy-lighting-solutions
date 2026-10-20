import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export type CatalogSort = "default" | "price-asc" | "price-desc";

export const CATALOG_PAGE_SIZE = 12;
type GetCatalogInput = {
  categorySlug?: string;
  sort?: CatalogSort;
  page?: number;
  query?: string;
  subcategorySlug?: string;
};

type CatalogResult = {
  products: Product[];
  categories: Category[];
  selectedCategory: Category | null;
  invalidCategory: boolean;
  categoryCounts: Record<string, number>;
  totalProducts: number;
  totalResults: number;
  visibleCount: number;
  hasMore: boolean;
  page: number;
  subcategories: Category[];
  selectedSubcategory: Category | null;
  invalidSubcategory: boolean;
};

function normalizeSearch(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .toLowerCase()
    .trim();
}

export async function getCatalog({
  categorySlug,
  subcategorySlug,
  sort = "default",
  page = 1,
  query = "",
}: GetCatalogInput = {}): Promise<CatalogResult> {
  const activeCategories = categories
    .filter((category) => category.is_active)
    .sort((first, second) => first.sort_order - second.sort_order);

  const selectedCategory = categorySlug
    ? (activeCategories.find((category) => category.slug === categorySlug) ??
      null)
    : null;

  const invalidCategory = Boolean(categorySlug && !selectedCategory);
  const subcategories = selectedCategory
    ? activeCategories.filter(
        (category) => category.parent_id === selectedCategory.id,
      )
    : [];

  const selectedSubcategory = subcategorySlug
    ? (subcategories.find((category) => category.slug === subcategorySlug) ??
      null)
    : null;

  const invalidSubcategory = Boolean(subcategorySlug && !selectedSubcategory);

  const selectedSubcategoryIds = new Set<string>();

  if (selectedSubcategory) {
    selectedSubcategoryIds.add(selectedSubcategory.id);

    let changed = true;

    while (changed) {
      changed = false;

      for (const category of activeCategories) {
        if (
          category.parent_id &&
          selectedSubcategoryIds.has(category.parent_id) &&
          !selectedSubcategoryIds.has(category.id)
        ) {
          selectedSubcategoryIds.add(category.id);
          changed = true;
        }
      }
    }
  }
  // Include active subcategories when a parent category is selected.
  const selectedIds = new Set<string>();

  if (selectedCategory) {
    selectedIds.add(selectedCategory.id);

    let addedCategory = true;

    while (addedCategory) {
      addedCategory = false;

      for (const category of activeCategories) {
        if (
          category.parent_id &&
          selectedIds.has(category.parent_id) &&
          !selectedIds.has(category.id)
        ) {
          selectedIds.add(category.id);
          addedCategory = true;
        }
      }
    }
  }

  const activeCategoryIds = new Set(
    activeCategories.map((category) => category.id),
  );

  const activeProducts = products.filter(
    (product) =>
      product.is_active && activeCategoryIds.has(product.category_id),
  );

  const categoryCounts: Record<string, number> = {};

  for (const category of activeCategories) {
    const includedIds = new Set<string>([category.id]);

    let changed = true;

    while (changed) {
      changed = false;

      for (const child of activeCategories) {
        if (
          child.parent_id &&
          includedIds.has(child.parent_id) &&
          !includedIds.has(child.id)
        ) {
          includedIds.add(child.id);
          changed = true;
        }
      }
    }

    categoryCounts[category.id] = activeProducts.filter((product) =>
      includedIds.has(product.category_id),
    ).length;
  }

  const searchTerms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const matchingProducts =
    invalidCategory || invalidSubcategory
      ? []
      : activeProducts.filter((product) => {
          const matchesCategory =
            !selectedCategory || selectedIds.has(product.category_id);

          const matchesSubcategory =
            !selectedSubcategory ||
            selectedSubcategoryIds.has(product.category_id);

          const searchableText = normalizeSearch(
            [product.name_ar, product.name_en ?? "", product.sku ?? ""].join(
              " ",
            ),
          );

          const matchesSearch = searchTerms.every((term) =>
            searchableText.includes(term),
          );

          return matchesCategory && matchesSubcategory && matchesSearch;
        });
  matchingProducts.sort((first, second) => {
    if (sort === "default") {
      return (
        first.sort_order - second.sort_order ||
        first.id.localeCompare(second.id)
      );
    }

    // Products without a price always come last.
    if (first.price === null && second.price !== null) return 1;
    if (first.price !== null && second.price === null) return -1;

    if (first.price !== null && second.price !== null) {
      const difference =
        sort === "price-asc"
          ? first.price - second.price
          : second.price - first.price;

      if (difference !== 0) return difference;
    }

    return (
      first.sort_order - second.sort_order || first.id.localeCompare(second.id)
    );
  });

  const totalResults = matchingProducts.length;

  const totalPages = Math.max(1, Math.ceil(totalResults / CATALOG_PAGE_SIZE));

  const requestedPage = Number.isSafeInteger(page) && page > 0 ? page : 1;

  const currentPage = Math.min(requestedPage, totalPages);

  const visibleProducts = matchingProducts.slice(
    0,
    currentPage * CATALOG_PAGE_SIZE,
  );

  return {
    products: visibleProducts,
    categories: activeCategories,
    selectedCategory,
    invalidCategory,
    categoryCounts,
    totalProducts: activeProducts.length,
    totalResults,
    visibleCount: visibleProducts.length,
    hasMore: visibleProducts.length < totalResults,
    page: currentPage,
    subcategories,
    selectedSubcategory,
    invalidSubcategory,
  };
}
