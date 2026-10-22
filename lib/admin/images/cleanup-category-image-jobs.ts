import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CATEGORY_IMAGE_CONFIG } from "@/lib/categories/image-config";

type AdminClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getStoragePath(src: string): string | null {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!projectUrl) throw new Error("Supabase URL is missing.");

  try {
    const project = new URL(projectUrl);
    const image = new URL(src);

    if (image.origin !== project.origin || image.search || image.hash) {
      return null;
    }

    const prefix = `/storage/v1/object/public/${CATEGORY_IMAGE_CONFIG.bucket}/`;

    if (!image.pathname.startsWith(prefix)) return null;

    const path = decodeURIComponent(image.pathname.slice(prefix.length));
    const parts = path.split("/");

    if (parts.length !== 2) return null;

    const [categoryId, filename] = parts;

    if (
      !UUID_PATTERN.test(categoryId) ||
      !filename.endsWith(".webp") ||
      !UUID_PATTERN.test(filename.slice(0, -5))
    ) {
      return null;
    }

    return path;
  } catch {
    return null;
  }
}

export async function cleanupCategoryImageJobs(
  supabase: AdminClient,
): Promise<{ remaining: number }> {
  const { data: jobs, error } = await supabase
    .from("category_image_cleanup_jobs")
    .select("id, src")
    .order("created_at")
    .order("id")
    .limit(20);

  if (error) throw error;

  for (const job of jobs ?? []) {
    try {
      const path = getStoragePath(job.src);

      if (path) {
        const { data: publicUrl } = supabase.storage
          .from(CATEGORY_IMAGE_CONFIG.bucket)
          .getPublicUrl(path);

        const sources = [...new Set([job.src, publicUrl.publicUrl])];

        // لا نحذف ملفًا ما زال مستخدمًا.
        const [categoriesResult, productsResult] = await Promise.all([
          supabase
            .from("categories")
            .select("id")
            .in("image_path", sources)
            .limit(1),

          supabase
            .from("product_images")
            .select("id")
            .in("src", sources)
            .limit(1),
        ]);

        if (categoriesResult.error) throw categoriesResult.error;
        if (productsResult.error) throw productsResult.error;

        const isReferenced =
          Boolean(categoriesResult.data?.length) ||
          Boolean(productsResult.data?.length);

        if (!isReferenced) {
          const { error: removeError } = await supabase.storage
            .from(CATEGORY_IMAGE_CONFIG.bucket)
            .remove([path]);

          if (removeError) throw removeError;
        }
      }

      const { error: deleteError } = await supabase
        .from("category_image_cleanup_jobs")
        .delete()
        .eq("id", job.id);

      if (deleteError) throw deleteError;
    } catch {
      // تظل المهمة محفوظة لإعادة المحاولة.
      console.error("Failed to clean category image", {
        jobId: job.id,
      });
    }
  }

  const { count, error: countError } = await supabase
    .from("category_image_cleanup_jobs")
    .select("id", { count: "exact", head: true });

  if (countError) throw countError;

  return { remaining: count ?? 0 };
}
