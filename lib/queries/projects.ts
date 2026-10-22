import "server-only";

import { createCatalogClient } from "@/lib/supabase/catalog-client";

import type { Database } from "@/types/database";
import type { Project } from "@/types/project";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

type ProjectImageRow = Pick<
  Database["public"]["Tables"]["project_images"]["Row"],
  "id" | "src" | "alt" | "sort_order"
>;

type ProjectWithImages = Pick<
  ProjectRow,
  | "id"
  | "title_ar"
  | "title_en"
  | "description_ar"
  | "description_en"
  | "category_ar"
  | "category_en"
  | "is_active"
  | "is_featured"
  | "sort_order"
> & {
  project_images: ProjectImageRow[];
};

const projectSelection = `
  id,
  title_ar,
  title_en,
  description_ar,
  description_en,
  category_ar,
  category_en,
  is_active,
  is_featured,
  sort_order,
  project_images (
    id,
    src,
    alt,
    sort_order
  )
`;

export const PROJECTS_PAGE_SIZE = 9;

function toProject(row: ProjectWithImages): Project {
  const { project_images, ...project } = row;

  return {
    ...project,
    images: [...project_images]
      .sort(
        (first, second) =>
          first.sort_order - second.sort_order ||
          first.id.localeCompare(second.id),
      )
      .map(({ id, src, alt }) => ({ id, src, alt })),
  };
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = createCatalogClient();

  const { data, error } = await supabase
    .from("projects")
    .select(projectSelection)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Failed to load featured projects", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل المشاريع.");
  }

  return (data ?? []).map(toProject);
}

export async function getPublicProjects(requestedPage = 1) {
  const supabase = createCatalogClient();

  const validPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  function buildQuery() {
    return supabase
      .from("projects")
      .select(projectSelection, { count: "exact" })
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
  }

  const batchSize = 500;
  const initialLimit = Math.min(validPage * PROJECTS_PAGE_SIZE, batchSize);

  const { data, count, error } = await buildQuery().range(0, initialLimit - 1);

  if (error) {
    console.error("Failed to load projects", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل المشاريع.");
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PROJECTS_PAGE_SIZE));

  const page = Math.min(validPage, totalPages);
  const targetCount = Math.min(page * PROJECTS_PAGE_SIZE, total);

  const projects = (data ?? []).slice(0, targetCount).map(toProject);

  for (let offset = initialLimit; offset < targetCount; offset += batchSize) {
    const end = Math.min(offset + batchSize - 1, targetCount - 1);

    const response = await buildQuery().range(offset, end);

    if (response.error) {
      console.error("Failed to load additional projects", {
        code: response.error.code,
      });

      throw new Error("تعذّر تحميل المزيد من المشاريع.");
    }

    projects.push(...(response.data ?? []).map(toProject));
  }

  return {
    projects,
    total,
    page,
    hasMore: projects.length < total,
  };
}
