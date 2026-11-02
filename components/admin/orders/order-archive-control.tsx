"use client";

import { useActionState } from "react";

import { setOrderArchived } from "@/app/admin/orders/actions";
import type { OrderArchiveFormState } from "@/lib/admin/order-form-types";

type OrderArchiveControlProps = {
  orderId: string;
  status: string;
  archivedAt: string | null;
};

const initialState: OrderArchiveFormState = {
  error: null,
  success: null,
};

export function OrderArchiveControl({
  orderId,
  status,
  archivedAt,
}: OrderArchiveControlProps) {
  const isArchived = archivedAt !== null;

  const action = setOrderArchived.bind(null, orderId, isArchived);

  const [state, formAction, isPending] = useActionState(action, initialState);

  const canArchive = status === "completed" || status === "cancelled";

  return (
    <section className="mt-6 border-t border-border pt-5">
      <h3 className="text-sm font-medium">
        {isArchived ? "طلب مؤرشف" : "تنظيم الطلب"}
      </h3>

      <p className="mt-2 text-xs leading-7 text-muted">
        {isArchived
          ? "الطلب محفوظ، ويمكن إعادته للقائمة الأساسية."
          : "الأرشفة تخفي الطلب من القائمة الأساسية دون حذف بياناته أو تعطيل التتبع."}
      </p>

      {isArchived || canArchive ? (
        <form action={formAction} className="mt-4">
          <input
            type="hidden"
            name="archived"
            value={isArchived ? "false" : "true"}
          />

          <button
            type="submit"
            disabled={isPending}
            className="min-h-11 w-full rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-50"
          >
            {isPending
              ? "جارٍ الحفظ…"
              : isArchived
                ? "إعادة للقائمة الأساسية"
                : "أرشفة الطلب"}
          </button>
        </form>
      ) : (
        <p className="mt-3 text-[11px] leading-7 text-muted">
          يمكن أرشفة الطلب بعد اكتماله أو إلغائه.
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {state.error && (
          <p className="mt-3 text-xs leading-7 text-foreground">
            {state.error}
          </p>
        )}

        {state.success && (
          <p className="mt-3 text-xs leading-7 text-primary">{state.success}</p>
        )}
      </div>
    </section>
  );
}
