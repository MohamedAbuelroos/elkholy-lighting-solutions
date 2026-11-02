"use client";

import { useActionState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { trackOrder } from "@/app/(website)/track-order/actions";
import { getOrderStatusLabel } from "@/lib/orders/status";
import type { OrderTrackingState } from "@/lib/orders/tracking-types";

const initialState: OrderTrackingState = {
  error: null,
  order: null,
};

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Cairo",
});

const statusDescriptions = {
  new: "استلمنا طلبك، وسيقوم الفريق بمراجعته والتواصل معك لتأكيد التفاصيل.",
  confirmed: "تم تأكيد الطلب، والخطوة التالية هي تجهيز اختياراتك.",
  preparing: "نعمل حاليًا على تجهيز منتجات طلبك.",
  ready_for_pickup: "طلبك جاهز للاستلام. تواصل مع الفريق لتنسيق الزيارة.",
  out_for_delivery:
    "طلبك خرج للتوصيل. تواصل مع الفريق عند الحاجة لتنسيق الاستلام.",
  completed: "تم استكمال الطلب. شكرًا لاختيارك الخولي.",
  cancelled: "تم إلغاء الطلب. يمكنك التواصل مع الفريق للاستفسار.",
} as const;

export function OrderTrackingForm() {
  const [state, formAction, isPending] = useActionState(
    trackOrder,
    initialState,
  );

  return (
    <div className="mx-auto max-w-2xl">
      <form
        action={formAction}
        className="rounded-3xl border border-border bg-surface p-5 sm:p-8"
      >
        <label
          htmlFor="tracking-code"
          className="text-sm font-medium text-foreground"
        >
          كود التتبع
        </label>

        <p
          id="tracking-code-help"
          className="mt-2 text-xs leading-7 text-muted"
        >
          الكود الذي ظهر بعد إرسال طلبك، وليس رقم الطلب المختصر.
        </p>

        <input
          id="tracking-code"
          name="tracking_code"
          type="text"
          dir="ltr"
          required
          maxLength={80}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-describedby="tracking-code-help"
          placeholder="KH-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
          readOnly={isPending}
          className="mt-4 min-h-14 w-full min-w-0 rounded-2xl border border-border bg-background px-4 py-3 font-mono text-xs leading-7 text-foreground outline-none transition-colors placeholder:text-[10px] focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:text-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
        >
          <FaMagnifyingGlass aria-hidden="true" className="size-3.5" />

          {isPending ? "جارٍ البحث…" : "عرض حالة الطلب"}
        </button>

        <p className="mt-4 text-[11px] leading-7 text-muted">
          احتفظ بكودك ولا تشاركه علنًا؛ فهو يتيح الاطلاع على حالة طلبك.
        </p>
      </form>

      <div
        aria-live="polite"
        aria-atomic="true"
        aria-busy={isPending}
        className="mt-5"
      >
        {!isPending && state.error && (
          <p className="rounded-2xl border border-border bg-surface px-5 py-4 text-sm leading-8 text-foreground">
            {state.error}
          </p>
        )}

        {!isPending && state.order && (
          <section
            aria-labelledby="tracked-order-title"
            className="rounded-3xl border border-primary/25 bg-surface p-5 sm:p-8"
          >
            <p className="text-[11px] text-muted">نتيجة آخر بحث</p>

            <h2
              id="tracked-order-title"
              className="mt-3 text-xl font-medium text-foreground"
            >
              طلب <bdi>KH-{state.order.orderNumber}</bdi>
            </h2>

            <span className="mt-5 inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
              {getOrderStatusLabel(state.order.status)}
            </span>

            <p className="mt-4 text-sm leading-8 text-muted">
              {statusDescriptions[state.order.status]}
            </p>

            <dl className="mt-6 space-y-4 border-t border-border pt-5 text-xs leading-7">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-muted">طريقة الاستلام</dt>
                <dd className="text-foreground">
                  {state.order.fulfillmentMethod === "delivery"
                    ? "توصيل للعنوان"
                    : "استلام من المعرض"}
                </dd>
              </div>

              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-muted">تاريخ الطلب</dt>
                <dd className="text-foreground">
                  {dateFormatter.format(new Date(state.order.createdAt))}
                </dd>
              </div>

              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-muted">آخر تحديث للطلب</dt>
                <dd className="text-foreground">
                  {dateFormatter.format(new Date(state.order.updatedAt))}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-[11px] leading-7 text-muted">
              لعرض آخر حالة، اضغط «عرض حالة الطلب» مرة أخرى.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
