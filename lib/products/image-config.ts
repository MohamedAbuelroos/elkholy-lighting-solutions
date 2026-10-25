import { CATALOG_IMAGE_CONFIG } from "@/lib/images/catalog-image-config";

export const PRODUCT_IMAGE_CONFIG = {
  ...CATALOG_IMAGE_CONFIG,
  bucket: "product-images",
  maxImages: 5,
} as const;
