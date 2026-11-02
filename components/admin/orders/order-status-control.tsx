"use client";

import { useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { FaXmark } from "react-icons/fa6";

import { updateOrderStatus } from "@/app/admin/orders/actions";
import type { OrderStatusFormState } from "@/lib/admin/order-form-types";
import { getNextOrderStatuses, getOrderStatusLabel } from "@/lib/orders/status";

type OrderStatusControlProps = {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  fulfillmentMethod: string;
  archivedAt: string | null;
  isOwner: boolean;
};

const initialState: OrderStatusFormState = { error: null, success: null };
const buttonClassName = "min-h-11 rounded-full bg-primary px-5 py-2 text-xs font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60";

export function OrderStatusControl({
  orderId, orderNumber, currentStatus, fulfillmentMethod, archivedAt, isOwner,
}: OrderStatusControlProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const reasonId = useId();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dialogTarget, setDialogTarget] = useState<"cancelled" | "new">("cancelled");
  const [reason, setReason] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const action = updateOrderStatus.bind(null, orderId, currentStatus);

  async function handleAction(
    previousState: OrderStatusFormState,
    formData: FormData,
  ): Promise<OrderStatusFormState> {
    let result: OrderStatusFormState;
    try {
      result = await action(previousState, formData);
    } catch {
      result = {
        error: "تعذّر تأكيد حفظ الحالة. حدّث الصفحة للتأكد من النتيجة قبل المحاولة مرة أخرى.",
        success: null,
      };
    }

    if (result.success) {
      dialogRef.current?.close();
      setSelectedStatus("");
      setReason("");
      setDialogError("");
    } else if (dialogRef.current?.open) {
      setDialogError(result.error ?? "تعذّر تحديث الحالة.");
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(handleAction, initialState);
  const nextStatuses = getNextOrderStatuses(currentStatus, fulfillmentMethod);
  const isArchived = archivedAt !== null;
  const canReopen = currentStatus === "cancelled" && isOwner && !isArchived;
  const isReopening = dialogTarget === "new";

  useEffect(() => {
    if (!dialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [dialogOpen]);

  function openReasonDialog(target: "cancelled" | "new") {
    setDialogTarget(target);
    setReason("");
    setDialogError("");
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      setDialogOpen(true);
    }
  }

  function handleMainSubmit(event: FormEvent<HTMLFormElement>) {
    if (selectedStatus === "cancelled") {
      event.preventDefault();
      openReasonDialog("cancelled");
    }
  }

  return (
    <section aria-labelledby={`status-control-${orderId}`} className="mt-6 border-t border-border pt-5">
      <h3 id={`status-control-${orderId}`} className="text-sm font-medium">تحديث حالة الطلب</h3>
      <p className="mt-2 text-xs leading-7 text-muted">الحالية: {getOrderStatusLabel(currentStatus)}</p>

      {isArchived ? (
        <p className="mt-3 text-xs leading-7 text-muted">استرجع الطلب من الأرشيف أولًا قبل تغيير حالته أو إعادة فتحه.</p>
      ) : canReopen ? (
        <>
          <p className="mt-3 text-xs leading-7 text-muted">يمكنك كمدير رئيسي إعادته إلى «طلب جديد» لمراجعته مرة أخرى.</p>
          <button type="button" disabled={isPending} onClick={() => openReasonDialog("new")} className={`mt-4 w-full ${buttonClassName}`}>إعادة فتح الطلب</button>
        </>
      ) : nextStatuses.length > 0 ? (
        <form action={formAction} onSubmit={handleMainSubmit} className="mt-4">
          <label htmlFor={`status-${orderId}`} className="sr-only">الحالة الجديدة</label>
          <select id={`status-${orderId}`} name="status" required disabled={isPending}
            value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60">
            <option value="" disabled>اختر الحالة الجديدة</option>
            {nextStatuses.map((status) => <option key={status} value={status}>{getOrderStatusLabel(status)}</option>)}
          </select>
          <button type="submit" disabled={isPending} className={`mt-3 w-full ${buttonClassName}`}>
            {isPending ? "جارٍ التحديث…" : selectedStatus === "cancelled" ? "متابعة إلغاء الطلب" : "حفظ الحالة"}
          </button>
        </form>
      ) : (
        <p className="mt-3 text-xs leading-7 text-muted">{currentStatus === "cancelled" ? "إعادة فتح الطلب متاحة للمدير الرئيسي فقط." : "الطلب في حالة نهائية."}</p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {!dialogOpen && state.error && <p className="mt-3 text-xs leading-7 text-foreground">{state.error}</p>}
        {state.success && <p className="mt-3 text-xs leading-7 text-primary">{state.success}</p>}
      </div>

      <dialog ref={dialogRef} aria-labelledby={titleId}
        onClose={() => setDialogOpen(false)}
        onCancel={(event) => { if (isPending) event.preventDefault(); }}
        onClick={(event) => {
          if (!isPending && event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-3xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm">
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-primary"><bdi>KH-{orderNumber}</bdi></p>
              <h2 id={titleId} className="mt-2 text-xl font-medium">{isReopening ? "إعادة فتح الطلب" : "تأكيد إلغاء الطلب"}</h2>
            </div>
            <button type="button" disabled={isPending} onClick={() => dialogRef.current?.close()} aria-label="إغلاق النافذة"
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"><FaXmark aria-hidden="true" className="size-4" /></button>
          </div>

          <p className="mt-4 text-sm leading-8 text-muted">
            {isReopening ? "الطلب سيرجع إلى «طلب جديد». راجع التوافر وتواصل مع العميل لتأكيد التفاصيل من جديد." : "الطلب سيتحول إلى «ملغي»، وستظهر هذه الحالة للعميل. اكتب سبب الإلغاء قبل التأكيد."}
          </p>

          <form action={formAction} className="mt-5">
            <input type="hidden" name="status" value={dialogTarget} />
            <label htmlFor={reasonId} className="text-sm font-medium">{isReopening ? "سبب إعادة الفتح" : "سبب الإلغاء"}</label>
            <textarea id={reasonId} name="reason" required minLength={5} maxLength={1000} rows={4}
              disabled={isPending} value={reason} onChange={(event) => setReason(event.target.value)}
              className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-8 outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60" />
            <p className="mt-2 text-[11px] leading-7 text-muted">من 5 إلى 1000 حرف. السبب داخلي للإدارة ولا يظهر للعميل.</p>
            {dialogError && <p role="alert" className="mt-3 text-xs leading-7 text-foreground">{dialogError}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="submit" disabled={isPending || reason.trim().length < 5} className={buttonClassName}>{isPending ? "جارٍ الحفظ…" : isReopening ? "تأكيد إعادة الفتح" : "تأكيد إلغاء الطلب"}</button>
              <button type="button" disabled={isPending} onClick={() => dialogRef.current?.close()} className="min-h-11 rounded-full border border-border px-5 text-xs text-muted hover:text-foreground disabled:opacity-50">رجوع بدون تغيير</button>
            </div>
          </form>
        </div>
      </dialog>
    </section>
  );
}
