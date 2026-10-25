"use client";

import { useActionState } from "react";

import { retryImageCleanup } from "@/app/admin/products/delete-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import type { ProductCleanupState } from "@/lib/admin/product-image-types";

type ProductImageCleanupNoticeProps = {
  pendingCount: number;
};

const initialState: ProductCleanupState = {
  error: null,
  successId: null,
  message: null,
};

export function ProductImageCleanupNotice({
  pendingCount,
}: ProductImageCleanupNoticeProps) {
  const [state, formAction, isPending] = useActionState(
    retryImageCleanup,
    initialState,
  );

  return (
    <>
      {state.successId && state.message && (
        <AdminSuccessNotice key={state.successId} title={state.message} />
      )}

      {pendingCount > 0 && (
        <div className="mb-6 rounded-card border border-amber-500/25 bg-surface p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">تنظيف ملفات الصور</p>

              <p className="mt-2 text-xs leading-6 text-muted">
                يوجد {pendingCount} طلب تنظيف متبقٍ لصور حُذفت من المنتجات.
              </p>
            </div>

            <form action={formAction}>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-control border border-border px-5 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
              >
                {isPending ? "جارٍ التنظيف..." : "استكمال التنظيف"}
              </button>
            </form>
          </div>
        </div>
      )}

      {state.error && (
        <p
          role="alert"
          className="mb-6 rounded-control border border-red-500/25 bg-red-500/10 p-4 text-sm leading-7"
        >
          {state.error}
        </p>
      )}
    </>
  );
}
