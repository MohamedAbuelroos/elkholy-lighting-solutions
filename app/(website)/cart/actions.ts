"use server";

import { getProductsByIds } from "@/lib/queries/products";

const MAX_CART_ITEMS = 50;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function loadCartProducts(productIds: string[]) {
  if (
    !Array.isArray(productIds) ||
    productIds.length > MAX_CART_ITEMS ||
    productIds.some((id) => typeof id !== "string" || !UUID_PATTERN.test(id))
  ) {
    throw new Error("بيانات السلة غير صحيحة.");
  }

  const uniqueIds = [...new Set(productIds.map((id) => id.toLowerCase()))];

  if (uniqueIds.length === 0) return [];

  return getProductsByIds(uniqueIds);
}
