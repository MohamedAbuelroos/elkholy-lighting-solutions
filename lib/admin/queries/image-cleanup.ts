import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";

export async function getPendingImageCleanupCount(): Promise<number> {
  const { supabase } = await requireAdmin();

  const { count, error } = await supabase
    .from("product_image_cleanup_jobs")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Failed to count image cleanup jobs", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل حالة تنظيف الصور.");
  }

  return count ?? 0;
}
