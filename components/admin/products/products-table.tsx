import { FaBoxOpen } from "react-icons/fa6";
import Link from "next/link";
import type { AdminProduct } from "@/lib/admin/queries/products";

type ProductsTableProps = {
  products: AdminProduct[];
  filtered?: boolean;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
});

export function ProductsTable({
  products,
  filtered = false,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border bg-surface px-6 py-16 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FaBoxOpen aria-hidden="true" className="size-6" />
        </span>

        <h2 className="mt-5 text-lg font-semibold">
          {filtered ? "لا توجد منتجات مطابقة" : "لا توجد منتجات حتى الآن"}
        </h2>

        <p className="mt-2 text-sm leading-7 text-muted">
          {filtered
            ? "جرّب تغيير كلمة البحث أو الفئة أو حالة المنتج."
            : "المنتجات التي تضيفها ستظهر هنا لإدارة بياناتها وحالة ظهورها."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-start text-sm">
          <caption className="sr-only">
            منتجات الكتالوج وأسعارها وحالة ظهورها
          </caption>

          <thead className="border-b border-border bg-surface-elevated">
            <tr>
              <th scope="col" className="px-5 py-4 text-start font-medium">
                المنتج
              </th>

              <th scope="col" className="px-5 py-4 text-start font-medium">
                الفئة
              </th>

              <th scope="col" className="px-5 py-4 text-start font-medium">
                السعر
              </th>

              <th scope="col" className="px-5 py-4 text-start font-medium">
                الظهور
              </th>

              <th scope="col" className="px-5 py-4 text-start font-medium">
                أقسام الرئيسية
              </th>
              <th scope="col" className="px-5 py-4 text-start font-medium">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-surface-elevated/50"
              >
                <th
                  scope="row"
                  className="max-w-xs px-5 py-5 text-start font-normal"
                >
                  <p className="font-semibold leading-7 text-foreground">
                    {product.name_ar}
                  </p>

                  <p className="mt-2 text-xs text-muted">
                    كود المنتج:{" "}
                    <span dir="ltr" className="inline-block font-mono">
                      {product.sku ?? "—"}
                    </span>
                  </p>
                </th>

                <td className="max-w-48 px-5 py-5 leading-7 text-muted">
                  {product.categoryName}
                </td>

                <td className="whitespace-nowrap px-5 py-5">
                  <span
                    className={`tabular-nums ${
                      product.price === null
                        ? "text-xs text-muted"
                        : "font-semibold text-foreground"
                    }`}
                  >
                    {product.price === null
                      ? "السعر عند الاستفسار"
                      : priceFormatter.format(product.price)}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-5">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                      product.is_active
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted"
                    }`}
                  >
                    {product.is_active ? "نشط" : "مخفي"}
                  </span>
                </td>

                <td className="px-5 py-5">
                  <div className="flex flex-wrap gap-2">
                    {product.is_featured && (
                      <span className="whitespace-nowrap rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
                        مختار
                      </span>
                    )}

                    {product.is_popular && (
                      <span className="whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                        شائع
                      </span>
                    )}

                    {!product.is_featured && !product.is_popular && (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-5">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    aria-label={`تعديل ${product.name_ar}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-control border border-border px-4 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    تعديل
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
