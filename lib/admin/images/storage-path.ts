import "server-only";

import { PRODUCT_IMAGE_CONFIG } from "@/lib/products/image-config";

export function getProductImageStoragePath(
  src: string,
  productId?: string,
): string | null {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!projectUrl) return null;

  try {
    const imageUrl = new URL(src);
    const supabaseUrl = new URL(projectUrl);

    const prefix = `/storage/v1/object/public/${PRODUCT_IMAGE_CONFIG.bucket}/`;

    if (
      imageUrl.origin !== supabaseUrl.origin ||
      imageUrl.search ||
      imageUrl.hash ||
      !imageUrl.pathname.startsWith(prefix)
    ) {
      return null;
    }

    const objectPath = decodeURIComponent(
      imageUrl.pathname.slice(prefix.length),
    );

    const parts = objectPath.split("/");

    if (parts.length !== 2) return null;

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(parts[0])) return null;

    if (productId && parts[0] !== productId.toLowerCase()) {
      return null;
    }

    if (!/^[a-z0-9][a-z0-9._-]*\.(webp|png|jpe?g|avif)$/i.test(parts[1])) {
      return null;
    }

    return objectPath;
  } catch {
    return null;
  }
}
