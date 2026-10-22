import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { AdminProjectImage } from "@/lib/admin/project-image-types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAdminProjectImages(
  projectId: string,
): Promise<AdminProjectImage[]> {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(projectId)) return [];

  const { data, error } = await supabase
    .from("project_images")
    .select("id, src, alt, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to load project images", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل صور المشروع.");
  }

  return data ?? [];
}

export async function getPendingProjectImageCleanupCount(
  projectId: string,
): Promise<number> {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(projectId)) return 0;

  const { count, error } = await supabase
    .from("project_image_cleanup_jobs")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  if (error) {
    console.error("Failed to count project image cleanup jobs", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل حالة تنظيف صور المشروع.");
  }

  return count ?? 0;
}

export async function getAllPendingProjectImageCleanupCount(): Promise<number> {
  const { supabase } = await requireAdmin();

  const { count, error } = await supabase
    .from("project_image_cleanup_jobs")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Failed to count pending project cleanup jobs", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل حالة تنظيف صور المشاريع.");
  }

  return count ?? 0;
}
