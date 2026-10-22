import type { Database } from "@/types/database";

export type AdminProductImage = Pick<
  Database["public"]["Tables"]["product_images"]["Row"],
  "id" | "src" | "alt" | "sort_order"
>;

export type ProductImageUploadState = {
  error: string | null;
  successId: string | null;
};

export type ProductImageActionState = {
  error: string | null;
  successId: string | null;
  message: string | null;
  warning: string | null;
  cleanupSrc: string | null;
};

export type ProductCleanupState = {
  error: string | null;
  successId: string | null;
  message: string | null;
};
