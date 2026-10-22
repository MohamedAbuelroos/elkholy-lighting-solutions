import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { Database } from "@/types/database";
import { getAdminCategoryOptions } from "@/lib/admin/queries/categories";
import type { AdminProductFilters } from "@/lib/admin/product-filters";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export type AdminProduct = Pick<
  ProductRow,
  | "id"
  | "name_ar"
  | "slug"
  | "sku"
  | "price"
  | "is_active"
  | "is_featured"
  | "is_popular"
> & {
  categoryName: string;
};

const PAGE_SIZE = 20;

type AdminProductsQuery = Partial<AdminProductFilters> & {
  page?: number;
};

function normalizeAdminSearch(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function collectCategoryIds(
  rootId: string,
  categories: readonly {
    id: string;
    parent_id: string | null;
  }[],
): string[] {
  const ids = new Set<string>([rootId]);
  const pending = [rootId];

  while (pending.length > 0) {
    const parentId = pending.pop();

    for (const category of categories) {
      if (category.parent_id === parentId && !ids.has(category.id)) {
        ids.add(category.id);
        pending.push(category.id);
      }
    }
  }

  return [...ids];
}

export async function getAdminProducts({
  page: requestedPage = 1,
  query = "",
  categoryId = "",
  status = "all",
}: AdminProductsQuery = {}) {
  const { supabase } = await requireAdmin();

  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0 &&
    requestedPage <= 100000
      ? requestedPage
      : 1;

  let categoryIds: string[] | null = null;

  if (categoryId) {
    const categories = await getAdminCategoryOptions();

    const selectedCategory = categories.find(
      (category) => category.id === categoryId,
    );

    if (!selectedCategory) {
      return {
        products: [] as AdminProduct[],
        total: 0,
        pageSize: PAGE_SIZE,
        invalidCategory: true,
      };
    }

    categoryIds = collectCategoryIds(selectedCategory.id, categories);
  }

  let request = supabase
    .from("products")
    .select(
      `
        id,
        name_ar,
        slug,
        sku,
        price,
        is_active,
        is_featured,
        is_popular,
        category:categories(name_ar)
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (categoryIds) {
    request = request.in("category_id", categoryIds);
  }

  if (status === "active") {
    request = request.eq("is_active", true);
  } else if (status === "hidden") {
    request = request.eq("is_active", false);
  }

  const normalizedQuery = normalizeAdminSearch(query.slice(0, 120));

  if (normalizedQuery) {
    for (const term of normalizedQuery.split(" ")) {
      const escapedTerm = term.replace(/[\\%_]/g, "\\$&");

      request = request.ilike("search_text", `%${escapedTerm}%`);
    }
  }

  const from = (page - 1) * PAGE_SIZE;

  const { data, count, error } = await request.range(
    from,
    from + PAGE_SIZE - 1,
  );

  if (error) {
    console.error("Failed to load admin products", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل المنتجات.");
  }

  const products: AdminProduct[] = (data ?? []).map(
    ({ category, ...product }) => ({
      ...product,
      categoryName: category?.name_ar ?? "فئة غير متاحة",
    }),
  );

  return {
    products,
    total: count ?? 0,
    pageSize: PAGE_SIZE,
    invalidCategory: false,
  };
}

export async function getAdminProductById(productId: string) {
  const { supabase } = await requireAdmin();

  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    );

  if (!isValidId) return null;

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name_ar,
        name_en,
        slug,
        category_id,
        description_ar,
        description_en,
        sku,
        price,
        sort_order,
        is_active,
        is_featured,
        is_popular
      `,
    )
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load admin product", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل بيانات المنتج.");
  }

  return data;
}
