"use client";

import { useActionState, useId, useRef } from "react";
import { FaTrashCan, FaXmark } from "react-icons/fa6";

import { deleteProduct } from "@/app/admin/products/delete-actions";
import type { ProductFormState } from "@/lib/admin/product-form-types";


type DeleteProductControlProps = {
  productId: string;
  productName: string;
  isActive: boolean;
};

const initialState: ProductFormState = {
  error: null,
};

export function DeleteProductControl({
  productId,
  productName,
  isActive,
}: DeleteProductControlProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const action = deleteProduct.bind(null, productId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  function closeDialog() {
    if (!isPending) dialogRef.current?.close();
  }

  return (
    <div className="mt-10 max-w-4xl rounded-card border border-red-500/20 bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">حذف المنتج نهائيًا</h2>

          <p className="mt-2 max-w-lg text-xs leading-6 text-muted">
            يحذف بيانات المنتج وصوره. لو تريد إيقاف ظهوره مؤقتًا، استخدم الإخفاء
            للحفاظ على بياناته.
          </p>

          {isActive && (
            <p className="mt-2 text-xs leading-6 text-muted">
              أخفِ المنتج من كارت حالة النشر أولًا لتفعيل الحذف.
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={isActive}
          onClick={() => dialogRef.current?.showModal()}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control border border-red-500/30 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaTrashCan aria-hidden="true" className="size-4" />
          حذف المنتج
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-card border border-border bg-surface p-6 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 id={titleId} className="text-lg font-bold">
            تأكيد حذف المنتج
          </h3>

          <button
            type="button"
            onClick={closeDialog}
            disabled={isPending}
            aria-label="إغلاق"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-elevated disabled:opacity-50"
          >
            <FaXmark aria-hidden="true" className="size-4" />
          </button>
        </div>

        <p id={descriptionId} className="mt-4 text-sm leading-7 text-muted">
          سيتم حذف{" "}
          <strong className="break-words font-semibold text-foreground">
            {productName}
          </strong>{" "}
          وصوره نهائيًا. لا يمكن التراجع عن هذه العملية.
        </p>

        {state.error && (
          <p
            role="alert"
            className="mt-4 rounded-control border border-red-500/25 bg-red-500/10 p-3 text-sm leading-7"
          >
            {state.error}
          </p>
        )}

        <form action={formAction} className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={closeDialog}
            disabled={isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control border border-border px-4 text-sm disabled:opacity-50"
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "جارٍ الحذف..." : "حذف نهائي"}
          </button>
        </form>
      </dialog>
    </div>
  );
}
