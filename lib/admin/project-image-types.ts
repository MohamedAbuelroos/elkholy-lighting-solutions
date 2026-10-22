import type { Database } from "@/types/database";

export type AdminProjectImage = Pick<
  Database["public"]["Tables"]["project_images"]["Row"],
  "id" | "src" | "alt" | "sort_order"
>;

export type ProjectImageUploadState = {
  error: string | null;
  successId: string | null;
};

export type ProjectImageActionState = {
  error: string | null;
  successId: string | null;
  message: string | null;
  warning: string | null;
};
