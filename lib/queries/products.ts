import "server-only";

import { getActiveCategories } from "@/lib/queries/categories";
import {
  fetchProductsByIds,
  toProduct,
} from "@/lib/queries/product-selections";
import { createCatalogClient } from "@/lib/supabase/catalog-client";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export type CatalogSort = "default" | "price-asc" | "price-desc";

export const CATALOG_PAGE_SIZE = 12;

type GetCatalogInput = {
  categorySlug?: string;
  subcategorySlug?: string;
  sort?: CatalogSort;
  page?: number;
  query?: string;
};

type CatalogResult = {
  products: Product[];
  categories: Category[];

  selectedCategory: Category | null;
  invalidCategory: boolean;

  subcategories: Category[];
  selectedSubcategory: Category | null;
  invalidSubcategory: boolean;

  categoryCounts: Record<string, number>;
  totalProducts: number;

  totalResults: number;
  visibleCount: number;
  hasMore: boolean;
  page: number;
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

function escapeSearchPattern(value: string): string {
  // Treat %, _ and backslash as literal search characters.
  return value.replace(/[\\%_]/g, "\\$&");
}

function collectCategoryIds(rootId: string, categories: Category[]): string[] {
  const ids = new Set<string>([rootId]);

  let changed = true;

  while (changed) {
    changed = false;

    for (const category of categories) {
      if (
        category.parent_id &&
        ids.has(category.parent_id) &&
        !ids.has(category.id)
      ) {
        ids.add(category.id);
        changed = true;
      }
    }
  }

  return [...ids];
}

export async function getCatalog({
  categorySlug,
  subcategorySlug,
  sort = "default",
  page = 1,
  query = "",
}: GetCatalogInput = {}): Promise<CatalogResult> {
  const categories = await getActiveCategories();

  const selectedCategory = categorySlug
    ? (categories.find((category) => category.slug === categorySlug) ?? null)
    : null;

  const invalidCategory = Boolean(categorySlug && !selectedCategory);

  const subcategories = selectedCategory
    ? categories.filter(
        (category) => category.parent_id === selectedCategory.id,
      )
    : [];

  const selectedSubcategory = subcategorySlug
    ? (subcategories.find((category) => category.slug === subcategorySlug) ??
      null)
    : null;

  const invalidSubcategory = Boolean(subcategorySlug && !selectedSubcategory);

  const selectedRoot = selectedSubcategory ?? selectedCategory;

  const categoryIds = selectedRoot
    ? collectCategoryIds(selectedRoot.id, categories)
    : categories.map((category) => category.id);

  const searchTerms = normalizeSearch(query.slice(0, 100))
    .split(/\s+/)
    .filter(Boolean);

  const supabase = createCatalogClient();

  /**
   * The same filters are used for:
   * 1. Counting matching products.
   * 2. Fetching the requested product identifiers.
   */
  function buildQuery() {
    let request = supabase
      .from("products")
      .select(
        `
        *,
        product_images (
          id,
          src,
          alt,
          sort_order
        )
      `,
        { count: "exact" },
      )
      .eq("is_active", true)
      .in("category_id", categoryIds);

    for (const term of searchTerms) {
      request = request.ilike("search_text", `%${escapeSearchPattern(term)}%`);
    }

    if (sort === "price-asc" || sort === "price-desc") {
      request = request.order("sale_price", {
        ascending: sort === "price-asc",
        nullsFirst: false,
      });
    }

    return request
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
  }

  const canSearch =
    !invalidCategory && !invalidSubcategory && categoryIds.length > 0;

  const requestedPage = Number.isSafeInteger(page) && page > 0 ? page : 1;

  // Keep requests below the usual API row limit.
  // Normal catalog use starts with only 12 products.
  const batchSize = 500;

  const initialLimit = Math.min(requestedPage * CATALOG_PAGE_SIZE, batchSize);

  const [countsResponse, productsResponse] = await Promise.all([
    supabase.rpc("get_catalog_category_counts"),

    canSearch
      ? buildQuery().range(0, initialLimit - 1)
      : Promise.resolve({
          data: null,
          count: 0,
          error: null,
        }),
  ]);

  if (countsResponse.error || productsResponse.error) {
    console.error("Failed to load catalog:", {
      categories: countsResponse.error,
      products: productsResponse.error,
    });

    throw new Error("تعذّر تحميل نتائج المنتجات.");
  }

  const countRows = countsResponse.data ?? [];

  const categoryCounts: Record<string, number> = {};

  for (const row of countRows) {
    categoryCounts[row.category_id] = Number(row.product_count);
  }

  const totalProducts = Number(countRows[0]?.total_products ?? 0);

  const totalResults = productsResponse.count ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalResults / CATALOG_PAGE_SIZE));

  const currentPage = Math.min(requestedPage, totalPages);

  const requestedCount = Math.min(
    currentPage * CATALOG_PAGE_SIZE,
    totalResults,
  );

  const visibleProducts = (productsResponse.data ?? [])
    .slice(0, requestedCount)
    .map(toProduct);

  // Only needed if the visitor has expanded beyond 500 products.
  if (canSearch && requestedCount > initialLimit) {
    for (
      let offset = initialLimit;
      offset < requestedCount;
      offset += batchSize
    ) {
      const lastIndex = Math.min(offset + batchSize - 1, requestedCount - 1);

      const { data, error } = await buildQuery().range(offset, lastIndex);

      if (error) {
        console.error("Failed to load additional catalog products:", {
          code: error.code,
          message: error.message,
        });

        throw new Error("تعذّر تحميل المزيد من المنتجات.");
      }

      visibleProducts.push(...(data ?? []).map(toProduct));
    }
  }
  return {
    products: visibleProducts,
    categories,

    selectedCategory,
    invalidCategory,

    subcategories,
    selectedSubcategory,
    invalidSubcategory,

    categoryCounts,
    totalProducts,

    totalResults,
    visibleCount: visibleProducts.length,
    hasMore: currentPage < totalPages,
    page: currentPage,
  };
}

export async function getProductsByIds(ids: string[]): Promise<
  {
    product: Product;
    categoryName: string;
  }[]
> {
  const [favoriteProducts, categories] = await Promise.all([
    fetchProductsByIds(ids),
    getActiveCategories(),
  ]);

  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name_ar]),
  );

  return favoriteProducts
    .filter((product) => categoryNames.has(product.category_id))
    .map((product) => ({
      product,
      categoryName: categoryNames.get(product.category_id) ?? "منتجات الخولي",
    }));
}
