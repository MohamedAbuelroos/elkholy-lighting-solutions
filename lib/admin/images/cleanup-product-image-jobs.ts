import "server-only";

import type { requireAdmin } from "@/lib/auth/require-admin";
import { getProductImageStoragePath } from "@/lib/admin/images/storage-path";
import { PRODUCT_IMAGE_CONFIG } from "@/lib/products/image-config";

type AdminSupabaseClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

export async function cleanupProductImageJobs(
  supabase: AdminSupabaseClient,
  source?: string,
) {
  let jobsQuery = supabase
    .from("product_image_cleanup_jobs")
    .select("id,src")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(20);

  if (source) {
    jobsQuery = jobsQuery.eq("src", source);
  }

  const { data: jobs, error: jobsError } = await jobsQuery;

  if (jobsError) {
    throw new Error("تعذّر تحميل طلبات تنظيف الصور.");
  }

  const bucket = supabase.storage.from(PRODUCT_IMAGE_CONFIG.bucket);

  let failed = 0;

  for (const job of jobs ?? []) {
    try {
      const objectPath = getProductImageStoragePath(job.src);

      if (objectPath) {
        const { data: urlData } = bucket.getPublicUrl(objectPath);

        const { data: references, error: referenceError } = await supabase
          .from("product_images")
          .select("id")
          .in("src", [...new Set([job.src, urlData.publicUrl])])
          .limit(1);

        if (referenceError) throw referenceError;

        // نحتفظ بالملف إذا كان ما زال مستخدمًا في سجل صورة آخر.
        if (!references || references.length === 0) {
          const { error: removeError } = await bucket.remove([objectPath]);

          if (removeError) throw removeError;
        }
      }

      // الصور المحلية والخارجية لا نحذف ملفاتها.
      // نزيل طلب التنظيف فقط.
      const { error: finishError } = await supabase
        .from("product_image_cleanup_jobs")
        .delete()
        .eq("id", job.id);

      if (finishError) throw finishError;
    } catch (error) {
      failed += 1;

      console.error("Product image cleanup failed", {
        jobId: job.id,
        error,
      });
    }
  }

  let remainingQuery = supabase
    .from("product_image_cleanup_jobs")
    .select("id", { count: "exact", head: true });

  if (source) {
    remainingQuery = remainingQuery.eq("src", source);
  }

  const { count, error: countError } = await remainingQuery;

  if (countError) {
    throw new Error("تعذّر التحقق من طلبات التنظيف المتبقية.");
  }

  return {
    failed,
    remaining: count ?? 0,
  };
}
