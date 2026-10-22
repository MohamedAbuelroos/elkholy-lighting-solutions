import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { AdminProductImage } from "@/lib/admin/product-image-types";

export async function getAdminProductImages(
  productId: string,
): Promise<AdminProductImage[]> {
  const { supabase } = await requireAdmin();

  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    );

  if (!isValidId) return [];

  const { data, error } = await supabase
    .from("product_images")
    .select("id,src,alt,sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to load product images", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل صور المنتج.");
  }

  return data ?? [];
}
