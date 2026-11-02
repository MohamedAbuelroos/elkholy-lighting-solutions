import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminOrderById } from "@/lib/admin/queries/orders";
import { getOrderStatusLabel } from "@/lib/orders/status";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { OrderStatusControl } from "@/components/admin/orders/order-status-control";
import { OrderArchiveControl } from "@/components/admin/orders/order-archive-control";
import { getAdminOrderContext } from "@/lib/admin/queries/order-context";
import { OrderStatusHistory } from "@/components/admin/orders/order-status-history";

export const metadata: Metadata = {
  title: "تفاصيل الطلب",
};

export const dynamic = "force-dynamic";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Cairo",
});

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) notFound();

  const { isOwner, history } = await getAdminOrderContext(order.id);

  const customerWhatsAppHref = buildWhatsAppUrl(
    order.customer_phone,
    [
      `مرحبًا ${order.customer_name}، معك فريق الخولي.`,
      "",
      `نتواصل معك بخصوص طلبك رقم KH-${order.order_number}.`,
      "نود تأكيد تفاصيل المنتجات والاستلام معك.",
    ].join("\n"),
  );

  const items = [...order.order_items].sort((first, second) =>
    first.id.localeCompare(second.id),
  );

  const unpricedCount = items.filter((item) => item.unit_price === null).length;

  const subtotalInCents = items.reduce(
    (total, item) =>
      total +
      (item.unit_price === null
        ? 0
        : Math.round(item.unit_price * 100) * item.quantity),
    0,
  );

  return (
    <section>
      <Link
        href="/admin/orders"
        className="inline-flex min-h-11 items-center text-xs text-muted hover:text-primary"
      >
        العودة للطلبات
      </Link>

      <header className="mb-7 mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-primary">تفاصيل الطلب</p>

          <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">
          طلب <bdi>KH-{order.order_number}</bdi>
        </h1>

        <p className="mt-3 text-xs leading-7 text-muted">
          تم الإرسال: {dateFormatter.format(new Date(order.created_at))}
        </p>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="text-lg font-medium">بيانات العميل</h2>

            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">الاسم</dt>
                <dd className="mt-2 break-words leading-7">
                  {order.customer_name}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-muted">الموبايل</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="inline-flex min-h-8 items-center text-primary"
                  >
                    <bdi>{order.customer_phone}</bdi>
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-xs text-muted">طريقة الاستلام</dt>
                <dd className="mt-2 leading-7">
                  {order.fulfillment_method === "delivery"
                    ? "توصيل للعنوان"
                    : "استلام من المعرض"}
                </dd>
              </div>

              {order.fulfillment_method === "delivery" && (
                <>
                  <div>
                    <dt className="text-xs text-muted">المحافظة والمنطقة</dt>

                    <dd className="mt-2 break-words leading-7">
                      {order.governorate} — {order.city}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted">العنوان</dt>
                    <dd className="mt-2 whitespace-pre-line break-words leading-8">
                      {order.address}
                    </dd>
                  </div>
                </>
              )}

              <a
                href={customerWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <FaWhatsapp aria-hidden="true" className="size-4" />
                تواصل مع العميل عبر واتساب
                <span className="sr-only">يفتح في تبويب جديد</span>
              </a>

              {order.customer_notes && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted">ملاحظات العميل</dt>

                  <dd className="mt-2 whitespace-pre-line break-words leading-8">
                    {order.customer_notes}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-surface">
            <h2 className="border-b border-border px-5 py-5 text-lg font-medium">
              المنتجات وقت الطلب
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-start text-sm">
                <caption className="sr-only">
                  المنتجات والكميات والأسعار المحفوظة وقت إرسال الطلب
                </caption>

                <thead className="bg-surface-elevated text-xs">
                  <tr>
                    {["المنتج", "الكمية", "سعر الوحدة", "الإجمالي"].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-5 py-4 text-start font-medium"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <th
                        scope="row"
                        className="max-w-xs px-5 py-5 text-start font-normal"
                      >
                        <p className="break-words font-medium leading-7">
                          {item.product_name}
                        </p>

                        {item.product_sku && (
                          <p className="mt-2 text-xs text-muted">
                            <bdi>{item.product_sku}</bdi>
                          </p>
                        )}

                        {!item.product_id && (
                          <p className="mt-2 text-[11px] leading-6 text-muted">
                            المنتج لم يعد موجودًا في الكتالوج.
                          </p>
                        )}
                      </th>

                      <td className="px-5 py-5 tabular-nums">
                        {item.quantity}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5">
                        {item.discount_percent > 0 &&
                          item.original_unit_price !== null && (
                            <p className="mb-1 text-xs text-muted">
                              <del>
                                {priceFormatter.format(
                                  item.original_unit_price,
                                )}
                              </del>

                              <span className="ms-2 text-primary">
                                خصم {item.discount_percent}٪
                              </span>
                            </p>
                          )}

                        <p className="text-xs leading-7 tabular-nums">
                          {item.unit_price === null
                            ? "السعر عند الاستفسار"
                            : priceFormatter.format(item.unit_price)}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-xs tabular-nums">
                        {item.line_total === null
                          ? "غير محدد"
                          : priceFormatter.format(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <OrderStatusHistory events={history} />
        </div>

        <aside className="rounded-2xl border border-primary/20 bg-surface p-6">
          <h2 className="text-lg font-medium">ملخص الطلب</h2>

          <dl className="mt-5 space-y-4 text-xs leading-7">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">عدد المنتجات</dt>
              <dd>{items.length}</dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-muted">إجمالي القطع</dt>
              <dd>{items.reduce((sum, item) => sum + item.quantity, 0)}</dd>
            </div>

            {unpricedCount > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">منتجات بدون سعر محدد</dt>
                <dd>{unpricedCount}</dd>
              </div>
            )}
          </dl>

          <div className="mt-5 border-t border-border pt-5">
            <p className="text-xs leading-7 text-muted">
              {unpricedCount > 0
                ? "إجمالي المنتجات المسعّرة فقط"
                : "الإجمالي المبدئي للمنتجات"}
            </p>

            <p className="mt-2 break-words text-2xl font-medium leading-relaxed tabular-nums text-primary">
              {items.length === 0
                ? "لا توجد منتجات"
                : unpricedCount === items.length
                  ? "السعر عند الاستفسار"
                  : priceFormatter.format(subtotalInCents / 100)}
            </p>
          </div>

          <p className="mt-4 text-xs leading-8 text-muted">
            الأسعار محفوظة وقت إرسال الطلب. الإجمالي لا يشمل التوصيل، وليس
            تأكيدًا للدفع أو التوافر.
          </p>

          <OrderStatusControl
            orderId={order.id}
            orderNumber={String(order.order_number)}
            currentStatus={order.status}
            fulfillmentMethod={order.fulfillment_method}
            archivedAt={order.archived_at}
            isOwner={isOwner}
          />
          <OrderArchiveControl
            orderId={order.id}
            status={order.status}
            archivedAt={order.archived_at}
          />
        </aside>
      </div>
    </section>
  );
}
