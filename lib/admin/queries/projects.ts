import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { Database } from "@/types/database";

export type AdminProject = Database["public"]["Tables"]["projects"]["Row"];

const PAGE_SIZE = 20;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAdminProjects(requestedPage = 1) {
  const { supabase } = await requireAdmin();

  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0 &&
    requestedPage <= 100000
      ? requestedPage
      : 1;

  const offset = (page - 1) * PAGE_SIZE;

  const { data, count, error } = await supabase
    .from("projects")
    .select("*, project_images(count)", { count: "exact" })
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) {
    console.error("Failed to load admin projects", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل المشاريع.");
  }

  return {
    projects: (data ?? []).map(({ project_images, ...project }) => ({
      ...project,
      imageCount: project_images?.[0]?.count ?? 0,
    })),
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getAdminProjectById(
  id: string,
): Promise<AdminProject | null> {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(id)) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load admin project", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل بيانات المشروع.");
  }

  return data;
}
