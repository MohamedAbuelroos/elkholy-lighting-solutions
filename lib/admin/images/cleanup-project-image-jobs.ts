import "server-only";

import type { requireAdmin } from "@/lib/auth/require-admin";
import { PROJECT_IMAGE_CONFIG } from "@/lib/projects/image-config";

type AdminClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getStoragePath(src: string): string | null {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!projectUrl) {
    throw new Error("Supabase URL is missing.");
  }

  try {
    const base = new URL(projectUrl);
    const image = new URL(src);

    if (image.origin !== base.origin || image.search || image.hash) {
      return null;
    }

    const prefix = `/storage/v1/object/public/${PROJECT_IMAGE_CONFIG.bucket}/`;

    if (!image.pathname.startsWith(prefix)) return null;

    const path = decodeURIComponent(image.pathname.slice(prefix.length));
    const parts = path.split("/");

    if (parts.length !== 2) return null;

    const [projectId, filename] = parts;

    if (
      !UUID_PATTERN.test(projectId) ||
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

export async function cleanupProjectImageJobs(
  supabase: AdminClient,
  projectId?: string,
): Promise<{ remaining: number }> {
  let jobsQuery = supabase
    .from("project_image_cleanup_jobs")
    .select("id, src")
    .order("created_at")
    .order("id")
    .limit(20);

  if (projectId) {
    jobsQuery = jobsQuery.eq("project_id", projectId);
  }

  const { data: jobs, error } = await jobsQuery;

  if (error) throw error;

  const bucket = supabase.storage.from(PROJECT_IMAGE_CONFIG.bucket);

  for (const job of jobs ?? []) {
    try {
      const path = getStoragePath(job.src);

      if (path) {
        const { data: publicUrl } = bucket.getPublicUrl(path);
        const sources = [...new Set([job.src, publicUrl.publicUrl])];

        const [projectsResult, productsResult, categoriesResult] =
          await Promise.all([
            supabase
              .from("project_images")
              .select("id")
              .in("src", sources)
              .limit(1),

            supabase
              .from("product_images")
              .select("id")
              .in("src", sources)
              .limit(1),

            supabase
              .from("categories")
              .select("id")
              .in("image_path", sources)
              .limit(1),
          ]);

        if (projectsResult.error) throw projectsResult.error;
        if (productsResult.error) throw productsResult.error;
        if (categoriesResult.error) throw categoriesResult.error;

        const isReferenced =
          Boolean(projectsResult.data?.length) ||
          Boolean(productsResult.data?.length) ||
          Boolean(categoriesResult.data?.length);

        if (!isReferenced) {
          const { error: removeError } = await bucket.remove([path]);

          if (removeError) throw removeError;
        }
      }

      const { error: finishError } = await supabase
        .from("project_image_cleanup_jobs")
        .delete()
        .eq("id", job.id);

      if (finishError) throw finishError;
    } catch {
      console.error("Project image cleanup failed", {
        jobId: job.id,
      });
    }
  }

  let countQuery = supabase
    .from("project_image_cleanup_jobs")
    .select("id", { count: "exact", head: true });

  if (projectId) {
    countQuery = countQuery.eq("project_id", projectId);
  }

  const { count, error: countError } = await countQuery;

  if (countError) throw countError;

  return { remaining: count ?? 0 };
}
