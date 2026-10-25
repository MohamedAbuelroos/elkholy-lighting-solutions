import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import { ProductFilters } from "@/components/admin/products/product-filters";
import { ProductImageCleanupNotice } from "@/components/admin/products/product-image-cleanup-notice";
import { ProductsTable } from "@/components/admin/products/products-table";
import {
  getAdminProductsPath,
  type AdminProductFilters,
} from "@/lib/admin/product-filters";
import { getAdminCategoryOptions } from "@/lib/admin/queries/categories";
import { getPendingImageCleanupCount } from "@/lib/admin/queries/image-cleanup";
import { getAdminProducts } from "@/lib/admin/queries/products";

export const metadata: Metadata = {
  title: "المنتجات",
};

type AdminProductsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    success?: string | string[];
    q?: string | string[];
    category?: string | string[];
    status?: string | string[];
  }>;
};

function readString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

function getPage(value: string | string[] | undefined): number {
  const text = readString(value);

  if (!/^[1-9]\d*$/.test(text)) return 1;

  const page = Number(text);

  return Number.isSafeInteger(page) && page <= 100000 ? page : 1;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;
  const page = getPage(params.page);
  const requestedStatus = readString(params.status);

  const filters: AdminProductFilters = {
    query: readString(params.q).trim().slice(0, 120),
    categoryId: readString(params.category).trim().toLowerCase().slice(0, 100),
    status:
      requestedStatus === "active" || requestedStatus === "hidden"
        ? requestedStatus
        : "all",
  };

  const hasFilters =
    Boolean(filters.query || filters.categoryId) || filters.status !== "all";

  const [
    { products, total, pageSize, invalidCategory },
    categories,
    pendingCleanupCount,
  ] = await Promise.all([
    getAdminProducts({ ...filters, page }),
    getAdminCategoryOptions(),
    getPendingImageCleanupCount(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (page > totalPages) {
    redirect(getAdminProductsPath(filters, totalPages));
  }

  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  const paginationClassName =
    "inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-surface px-5 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary";

  const disabledPaginationClassName =
    "inline-flex min-h-11 cursor-default items-center justify-center rounded-control border border-border px-5 text-sm text-muted opacity-40";

  return (
    <section>
      {(params.success === "created" ||
        params.success === "updated" ||
        params.success === "deleted") && (
        <AdminSuccessNotice
          key={params.success}
          title={
            params.success === "created"
              ? "تمت إضافة المنتج بنجاح"
              : params.success === "updated"
                ? "تم حفظ تعديلات المنتج بنجاح"
                : "تم حذف المنتج بنجاح"
          }
          description={
            params.success === "created"
              ? "تم حفظه كمسودة مخفية لحين استكمال الصور."
              : params.success === "updated"
                ? "تم تحديث بيانات المنتج."
                : "أي تنظيف متبقٍ للصور سيظهر في هذه الصفحة."
          }
        />
      )}

      <ProductImageCleanupNotice pendingCount={pendingCleanupCount} />

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-primary">إدارة الكتالوج</p>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">المنتجات</h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            ابحث في المنتجات وراجع أسعارها وفئاتها وحالة ظهورها.
          </p>
        </div>

        <div className="self-start rounded-control border border-border bg-surface px-5 py-3">
          <p className="text-xs text-muted">
            {hasFilters ? "المنتجات المطابقة" : "إجمالي المنتجات"}
          </p>

          <p className="mt-1 text-2xl font-semibold tabular-nums">{total}</p>
        </div>
      </div>

      <div className="mb-6">
        <Link
          href="/admin/products/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          <span aria-hidden="true">+</span>
          إضافة منتج جديد
        </Link>
      </div>

      <ProductFilters
        key={JSON.stringify([filters, page])}
        filters={filters}
        categories={categories}
      />

      {invalidCategory && (
        <p
          role="alert"
          className="mb-5 rounded-control border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-7"
        >
          الفئة المحددة غير متاحة. اختر فئة أخرى أو امسح الفلاتر.
        </p>
      )}

      <ProductsTable products={products} filtered={hasFilters} />

      {total > 0 && (
        <nav
          aria-label="صفحات منتجات الإدارة"
          className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs leading-6 text-muted">
            عرض {firstItem}–{lastItem} من {total} منتج
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            الصفحة {page} من {totalPages}
          </p>

          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={getAdminProductsPath(filters, page - 1)}
                scroll={false}
                className={paginationClassName}
              >
                السابق
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className={disabledPaginationClassName}
              >
                السابق
              </span>
            )}

            {page < totalPages ? (
              <Link
                href={getAdminProductsPath(filters, page + 1)}
                scroll={false}
                className={paginationClassName}
              >
                التالي
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className={disabledPaginationClassName}
              >
                التالي
              </span>
            )}
          </div>
        </nav>
      )}
    </section>
  );
}
