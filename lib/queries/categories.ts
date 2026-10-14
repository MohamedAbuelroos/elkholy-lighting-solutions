import { categories } from "@/data/categories";
import type { Category } from "@/types/category";

export async function getRootCategories(): Promise<Category[]> {
  return categories
    .filter((category) => category.is_active && category.parent_id === null)
    .sort((first, second) => first.sort_order - second.sort_order);
}
