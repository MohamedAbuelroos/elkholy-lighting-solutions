"use server";

import { getProductsByIds } from "@/lib/queries/products";

export async function loadFavoriteProducts(ids: string[]) {
  if (
    !Array.isArray(ids) ||
    ids.some((id) => typeof id !== "string" || id.length > 128)
  ) {
    throw new Error("Invalid product identifiers.");
  }

  return getProductsByIds(ids);
}
