import "server-only";

import { createCatalogClient } from "@/lib/supabase/catalog-client";
import type { Database } from "@/types/database";
import type { Product } from "@/types/product";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

type ProductImageRow = Pick<
  Database["public"]["Tables"]["product_images"]["Row"],
  "id" | "src" | "alt" | "sort_order"
>;

type ProductWithImages = ProductRow & {
  product_images: ProductImageRow[];
};

export const productSelection = `
  *,
  product_images (
    id,
    src,
    alt,
    sort_order
  )
`;

/**
 * Converts the database result into the existing UI model.
 */
export function toProduct(row: ProductWithImages): Product {
  const sortedImages = [...row.product_images].sort(
    (first, second) =>
      first.sort_order - second.sort_order || first.id.localeCompare(second.id),
  );

  return {
    id: row.id,
    slug: row.slug,
    category_id: row.category_id,

    name_ar: row.name_ar,
    name_en: row.name_en,

    description_ar: row.description_ar,
    description_en: row.description_en,

    sku: row.sku,
    price: row.price,

    images: sortedImages.map((image) => ({
      src: image.src,
      alt: image.alt,
    })),

    is_active: row.is_active,
    is_featured: row.is_featured,
    is_popular: row.is_popular,
    sort_order: row.sort_order,
  };
}

async function getSelectedProducts(
  flag: "is_featured" | "is_popular",
): Promise<Product[]> {
  const supabase = createCatalogClient();

  const { data, error } = await supabase
    .from("products")
    .select(productSelection)
    .eq("is_active", true)
    .eq(flag, true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })
    .limit(8);

  if (error) {
    console.error("Failed to fetch selected products:", {
      flag,
      code: error.code,
      message: error.message,
    });

    throw new Error("تعذّر تحميل المنتجات.");
  }

  return (data ?? []).map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getSelectedProducts("is_featured");
}

export async function getPopularProducts(): Promise<Product[]> {
  return getSelectedProducts("is_popular");
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  // Ignore old demo identifiers and malformed values.
  const uniqueIds = [...new Set(ids)].filter((id) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id),
  );

  if (uniqueIds.length === 0) return [];

  const supabase = createCatalogClient();
  const collected: Product[] = [];

  // Keep each request small, even if favorites grow.
  for (let offset = 0; offset < uniqueIds.length; offset += 100) {
    const batch = uniqueIds.slice(offset, offset + 100);

    const { data, error } = await supabase
      .from("products")
      .select(productSelection)
      .eq("is_active", true)
      .in("id", batch);

    if (error) {
      console.error("Failed to fetch favorite products:", {
        code: error.code,
        message: error.message,
      });

      throw new Error("تعذّر تحميل منتجات المفضلة.");
    }

    collected.push(...(data ?? []).map(toProduct));
  }

  const productsById = new Map(
    collected.map((product) => [product.id, product]),
  );

  return uniqueIds.flatMap((id) => {
    const product = productsById.get(id);
    return product ? [product] : [];
  });
}
