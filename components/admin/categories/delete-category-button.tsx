"use client";

import { useActionState, useId, useRef } from "react";
import { FaTrashCan, FaXmark } from "react-icons/fa6";

import { deleteCategory } from "@/app/admin/categories/actions";
import type { CategoryFormState } from "@/lib/admin/category-form-types";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
};

const initialState: CategoryFormState = {
  error: null,
};

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  const action = deleteCategory.bind(null, categoryId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  function closeDialog() {
    if (!isPending) {
      dialogRef.current?.close();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`حذف ${categoryName}`}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-control border border-red-500/20 px-3 text-xs font-medium text-foreground transition-colors hover:border-red-500/50 hover:bg-red-500/10"
      >
        <FaTrashCan aria-hidden="true" className="size-3" />
        حذف
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-card border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400"
            >
              <FaTrashCan className="size-5" />
            </span>

            <button
              type="button"
              onClick={closeDialog}
              disabled={isPending}
              aria-label="إغلاق نافذة الحذف"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-elevated hover:text-foreground disabled:opacity-50"
            >
              <FaXmark aria-hidden="true" className="size-4" />
            </button>
          </div>

          <h2 id={titleId} className="mt-5 text-xl font-bold">
            حذف الفئة؟
          </h2>

          <p
            id={descriptionId}
            className="mt-3 whitespace-normal text-sm leading-7 text-muted"
          >
            أنت على وشك حذف{" "}
            <strong className="font-semibold text-foreground">
              {categoryName}
            </strong>
            . الحذف نهائي، ويمكن تنفيذه فقط لو الفئة خالية من المنتجات والفئات
            الفرعية.
          </p>

          {state.error && (
            <p
              role="alert"
              className="mt-5 whitespace-normal rounded-control border border-red-500/25 bg-red-500/10 p-3 text-sm leading-7"
            >
              {state.error}
            </p>
          )}

          <form action={formAction} className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={closeDialog}
              disabled={isPending}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-elevated disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            >
              {isPending ? "جارٍ الحذف..." : "تأكيد الحذف"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
