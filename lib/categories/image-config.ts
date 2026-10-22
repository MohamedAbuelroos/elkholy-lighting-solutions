import { CATALOG_IMAGE_CONFIG } from "@/lib/images/catalog-image-config";

export const CATEGORY_IMAGE_CONFIG = {
  ...CATALOG_IMAGE_CONFIG,
  bucket: "category-images",
} as const;
