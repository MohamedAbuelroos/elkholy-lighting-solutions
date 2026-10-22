import "server-only";

import { cache } from "react";

import { getActiveCategories } from "@/lib/queries/categories";
import { productSelection, toProduct } from "@/lib/queries/product-selections";
import { createCatalogClient } from "@/lib/supabase/catalog-client";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export type ProductDetails = {
  product: Product;
  category: Category;
  categoryTrail: Category[];
};

export const getProductDetails = cache(
  async (slug: string): Promise<ProductDetails | null> => {
    if (slug.length > 200 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return null;
    }

    const supabase = createCatalogClient();

    const [productResult, categories] = await Promise.all([
      supabase
        .from("products")
        .select(productSelection)
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle(),

      getActiveCategories(),
    ]);

    if (productResult.error) {
      console.error("Failed to fetch product details", {
        code: productResult.error.code,
      });

      throw new Error("تعذّر تحميل تفاصيل المنتج.");
    }

    if (!productResult.data) return null;

    const product = toProduct(productResult.data);
    const categoriesById = new Map(
      categories.map((category) => [category.id, category]),
    );

    const category = categoriesById.get(product.category_id);

    if (!category) return null;

    const categoryTrail: Category[] = [];
    const visited = new Set<string>();

    let current: Category | undefined = category;

    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      categoryTrail.unshift(current);

      current = current.parent_id
        ? categoriesById.get(current.parent_id)
        : undefined;
    }

    return {
      product,
      category,
      categoryTrail,
    };
  },
);

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
): Promise<Product[]> {
  const supabase = createCatalogClient();

  const { data, error } = await supabase
    .from("products")
    .select(productSelection)
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .order("is_popular", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })
    .limit(4);

  if (error) {
    console.error("Failed to load related products", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل المنتجات المشابهة.");
  }

  return (data ?? []).map(toProduct);
}
