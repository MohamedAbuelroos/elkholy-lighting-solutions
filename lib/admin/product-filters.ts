export type AdminProductStatus = "all" | "active" | "hidden";

export type AdminProductFilters = {
  query: string;
  categoryId: string;
  status: AdminProductStatus;
};

export function getAdminProductsPath(
  filters: AdminProductFilters,
  page = 1,
): string {
  const params = new URLSearchParams();

  if (filters.query) {
    params.set("q", filters.query);
  }

  if (filters.categoryId) {
    params.set("category", filters.categoryId);
  }

  if (filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();

  return search ? `/admin/products?${search}` : "/admin/products";
}
