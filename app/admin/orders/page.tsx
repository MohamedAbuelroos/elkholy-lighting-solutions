import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft, FaBagShopping } from "react-icons/fa6";

import { getAdminOrders } from "@/lib/admin/queries/orders";
import {
  getOrderStatusLabel,
  isOrderStatus,
  orderStatuses,
} from "@/lib/orders/status";

export const metadata: Metadata = {
  title: "الطلبات",
};

export const dynamic = "force-dynamic";

type OrdersPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    status?: string | string[];
    archive?: string | string[];
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Cairo",
});

function getPageHref(
  page: number,
  status: string | undefined,
  archive: string,
) {
  const params = new URLSearchParams({
    page: String(page),
    archive,
  });

  if (status) params.set("status", status);

  return `/admin/orders?${params.toString()}`;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;

  const requestedPage =
    typeof params.page === "string" && /^[1-9]\d*$/.test(params.page)
      ? Number(params.page)
      : 1;

  const status =
    typeof params.status === "string" && isOrderStatus(params.status)
      ? params.status
      : undefined;

  const archive =
    params.archive === "archived"
      ? "archived"
      : params.archive === "all"
        ? "all"
        : "active";

  const { orders, total, page, hasMore } = await getAdminOrders({
    page: requestedPage,
    status,
    archive,
  });

  return (
    <section aria-labelledby="admin-orders-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-primary">
            إدارة طلبات العملاء
          </p>

          <h1
            id="admin-orders-title"
            className="mt-3 text-2xl font-semibold sm:text-3xl"
          >
            الطلبات
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted">
            راجع بيانات العملاء واختياراتهم وتفاصيل الاستلام.
          </p>
        </div>

        <p className="text-xs tabular-nums text-muted">
          {total} طلب ضمن النتائج
        </p>
      </div>

      <form
        action="/admin/orders"
        method="get"
        className="my-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4"
      >
        <div className="min-w-0 flex-1 sm:max-w-xs">
          <label htmlFor="order-status-filter" className="text-xs font-medium">
            حالة الطلب
          </label>

          <select
            id="order-status-filter"
            name="status"
            defaultValue={status ?? ""}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            <option value="">جميع الحالات</option>

            {Object.entries(orderStatuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0 flex-1 sm:max-w-xs">
          <label htmlFor="order-archive-filter" className="text-xs font-medium">
            عرض الطلبات
          </label>

          <select
            id="order-archive-filter"
            name="archive"
            defaultValue={archive}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            <option value="active">القائمة الأساسية</option>
            <option value="archived">المؤرشفة</option>
            <option value="all">جميع الطلبات</option>
          </select>
        </div>

        <button
          type="submit"
          className="min-h-11 rounded-full bg-primary px-6 text-xs font-medium text-on-primary hover:bg-primary-hover"
        >
          عرض النتائج
        </button>

        <Link
          href="/admin/orders"
          className="inline-flex min-h-11 items-center px-3 text-xs text-muted hover:text-primary"
        >
          إعادة ضبط
        </Link>
      </form>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <FaBagShopping
            aria-hidden="true"
            className="mx-auto size-8 text-primary"
          />

          <h2 className="mt-5 text-lg font-medium">
            لا توجد طلبات في هذه الصفحة
          </h2>

          <p className="mt-3 text-sm leading-7 text-muted">
            {status
              ? "جرّب عرض جميع الحالات."
              : "طلبات العملاء ستظهر هنا بعد إرسالها من الموقع."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-start text-sm">
              <caption className="sr-only">قائمة طلبات العملاء</caption>

              <thead className="border-b border-border bg-surface-elevated">
                <tr>
                  {[
                    "الطلب",
                    "العميل",
                    "الاستلام",
                    "الحالة",
                    "التاريخ",
                    "التفاصيل",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-4 text-start text-xs font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-surface-elevated/40"
                  >
                    <th
                      scope="row"
                      className="px-5 py-5 text-start font-medium"
                    >
                      <bdi>KH-{order.order_number}</bdi>

                      {order.archived_at && (
                        <span className="mt-2 block text-[10px] font-normal text-muted">
                          مؤرشف
                        </span>
                      )}
                    </th>

                    <td className="px-5 py-5">
                      <p className="max-w-56 break-words leading-7">
                        {order.customer_name}
                      </p>

                      <a
                        href={`tel:${order.customer_phone}`}
                        className="mt-1 inline-block text-xs text-primary"
                      >
                        <bdi>{order.customer_phone}</bdi>
                      </a>
                    </td>

                    <td className="whitespace-nowrap px-5 py-5 text-xs text-muted">
                      {order.fulfillment_method === "delivery"
                        ? "توصيل"
                        : "من المعرض"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-5">
                      <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-5 text-xs text-muted">
                      {dateFormatter.format(new Date(order.created_at))}
                    </td>

                    <td className="px-5 py-5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        aria-label={`عرض الطلب KH-${order.order_number}`}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-xs transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        عرض
                        <FaArrowLeft aria-hidden="true" className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <nav
        aria-label="صفحات الطلبات"
        className="mt-6 flex flex-wrap items-center justify-between gap-3"
      >
        {page > 1 ? (
          <Link
            href={getPageHref(page - 1, status, archive)}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-xs hover:text-primary"
          >
            الصفحة السابقة
          </Link>
        ) : (
          <span />
        )}

        <span className="text-xs tabular-nums text-muted">الصفحة {page}</span>

        {hasMore ? (
          <Link
            href={getPageHref(page + 1, status, archive)}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-xs hover:text-primary"
          >
            الصفحة التالية
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  );
}
