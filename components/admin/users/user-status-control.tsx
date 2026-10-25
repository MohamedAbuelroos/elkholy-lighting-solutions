"use client";

import { useActionState, useId, useRef } from "react";
import { FaXmark } from "react-icons/fa6";

import { changeAdminStatus } from "@/app/admin/users/actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import type { AdminStatusState } from "@/lib/admin/user-form-types";

type UserStatusControlProps = {
  userId: string;
  email: string;
  isActive: boolean;
};

const initialState: AdminStatusState = {
  error: null,
  successId: null,
  message: null,
};

export function UserStatusControl({
  userId,
  email,
  isActive,
}: UserStatusControlProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  async function submitStatus(
    previousState: AdminStatusState,
    formData: FormData,
  ) {
    const result = await changeAdminStatus(userId, previousState, formData);

    if (!result.error) {
      dialogRef.current?.close();
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(
    submitStatus,
    initialState,
  );

  function closeDialog() {
    if (!isPending) dialogRef.current?.close();
  }

  return (
    <div>
      {state.successId && state.message && (
        <AdminSuccessNotice key={state.successId} title={state.message} />
      )}

      {isActive ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => dialogRef.current?.showModal()}
          className="inline-flex min-h-10 items-center justify-center rounded-control border border-red-500/25 px-4 text-xs font-medium text-foreground transition-colors hover:border-red-500/50 hover:bg-red-500/10 disabled:opacity-50"
        >
          تعطيل
        </button>
      ) : (
        <form action={formAction}>
          <input type="hidden" name="operation" value="activate" />

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-10 items-center justify-center rounded-control border border-primary/30 bg-primary/10 px-4 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          >
            {isPending ? "جارٍ التفعيل..." : "إعادة التفعيل"}
          </button>
        </form>
      )}

      {state.error && (
        <p
          role="alert"
          className="mt-3 max-w-xs text-xs leading-6 text-foreground"
        >
          {state.error}
        </p>
      )}

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
          <h2 id={titleId} className="text-lg font-bold">
            تعطيل وصول الحساب؟
          </h2>

          <button
            type="button"
            onClick={closeDialog}
            disabled={isPending}
            aria-label="إغلاق"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-elevated disabled:opacity-50"
          >
            <FaXmark aria-hidden="true" className="size-4" />
          </button>
        </div>

        <p
          id={descriptionId}
          className="mt-4 whitespace-normal text-sm leading-7 text-muted"
        >
          سيتم منع الحساب{" "}
          <span
            dir="ltr"
            className="inline-block break-all font-medium text-foreground"
          >
            {email}
          </span>{" "}
          من الوصول إلى لوحة الإدارة. يمكنك إعادة تفعيله لاحقًا.
        </p>

        {state.error && (
          <p
            role="alert"
            className="mt-4 whitespace-normal rounded-control border border-red-500/25 bg-red-500/10 p-3 text-sm leading-7"
          >
            {state.error}
          </p>
        )}

        <form action={formAction} className="mt-6 flex gap-3">
          <input type="hidden" name="operation" value="deactivate" />

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
            {isPending ? "جارٍ التعطيل..." : "تأكيد التعطيل"}
          </button>
        </form>
      </dialog>
    </div>
  );
}
