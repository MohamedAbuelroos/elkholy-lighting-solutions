import { CATALOG_IMAGE_CONFIG } from "@/lib/images/catalog-image-config";

export const PROJECT_IMAGE_CONFIG = {
  ...CATALOG_IMAGE_CONFIG,
  bucket: "project-images",
  maxImages: 10,
} as const;
