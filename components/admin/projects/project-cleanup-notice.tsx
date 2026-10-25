"use client";

import { useActionState } from "react";

import { retryProjectImageCleanup } from "@/app/admin/projects/control-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import type { ProjectActionState } from "@/lib/admin/project-action-types";

const initialState: ProjectActionState = {
  error: null,
  successId: null,
  message: null,
};

export function ProjectCleanupNotice({
  pendingCount,
}: {
  pendingCount: number;
}) {
  const [state, formAction, isPending] = useActionState(
    retryProjectImageCleanup,
    initialState,
  );

  return (
    <>
      {state.successId && state.message && (
        <AdminSuccessNotice key={state.successId} title={state.message} />
      )}

      {pendingCount > 0 && (
        <div className="mt-6 rounded-control border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm leading-7">
            توجد {pendingCount} مهمة لتنظيف صور مشاريع قديمة.
          </p>

          <form action={formAction} className="mt-3">
            <button
              type="submit"
              disabled={isPending}
              className="min-h-10 rounded-control border border-border bg-surface px-4 text-xs font-medium disabled:opacity-50"
            >
              {isPending ? "جارٍ التنظيف..." : "إعادة محاولة التنظيف"}
            </button>
          </form>
        </div>
      )}

      {state.error && (
        <p
          role="alert"
          className="mt-4 rounded-control border border-red-500/30 p-4 text-sm leading-7"
        >
          {state.error}
        </p>
      )}
    </>
  );
}
