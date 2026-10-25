import "server-only";

import { cache } from "react";

import { createCatalogClient } from "@/lib/supabase/catalog-client";
import type { Category } from "@/types/category";

export const getActiveCategories = cache(async (): Promise<Category[]> => {
  const supabase = createCatalogClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
        id,
        name_ar,
        name_en,
        slug,
        description_ar,
        description_en,
        image_path,
        parent_id,
        sort_order,
        is_active
      `,
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", {
      code: error.code,
      message: error.message,
    });

    throw new Error("تعذّر تحميل فئات المنتجات.");
  }

  return data ?? [];
});

export async function getRootCategories(): Promise<Category[]> {
  const categories = await getActiveCategories();

  return categories.filter((category) => category.parent_id === null);
}
