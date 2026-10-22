import "server-only";
import { cache } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Category } from "@/types/category";

export type AdminCategory = Category & {
  directProductCount: number;
};

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const { supabase } = await requireAdmin();

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
      is_active,
      products(count)
    `,
    )
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to fetch admin categories:", {
      code: error.code,
      message: error.message,
    });

    throw new Error("تعذّر تحميل فئات المنتجات.");
  }

  return (data ?? []).map(({ products, ...category }) => ({
    ...category,
    directProductCount: products?.[0]?.count ?? 0,
  }));
}

export type AdminCategoryOption = Pick<
  Category,
  "id" | "name_ar" | "parent_id" | "is_active"
>;

export const getAdminCategoryOptions = cache(
  async (): Promise<AdminCategoryOption[]> => {
    const { supabase } = await requireAdmin();

    const { data, error } = await supabase
      .from("categories")
      .select("id,name_ar,parent_id,is_active")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("Failed to load admin category options", {
        code: error.code,
      });

      throw new Error("تعذّر تحميل فئات المنتجات.");
    }

    return data ?? [];
  },
);
