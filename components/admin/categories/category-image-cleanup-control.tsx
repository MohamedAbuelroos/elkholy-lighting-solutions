"use client";

import { useActionState } from "react";

import { manageCategoryImage } from "@/app/admin/categories/image-actions";
import type { CategoryImageState } from "@/lib/admin/category-image-types";

const initialState: CategoryImageState = {
  error: null,
  successId: null,
  message: null,
  warning: null,
};

export function CategoryImageCleanupControl() {
  // عملية cleanup لا تحتاج وجود فئة، لكن الدالة تتحقق من صيغة UUID.
  const action = manageCategoryImage.bind(
    null,
    "00000000-0000-4000-8000-000000000000",
  );

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="mt-6 rounded-control border border-border bg-surface p-4">
      <form
        action={formAction}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <p className="text-xs leading-6 text-muted">
          إعادة محاولة حذف أي صور فئات قديمة لم يكتمل تنظيفها.
        </p>

        <button
          type="submit"
          name="operation"
          value="cleanup"
          disabled={isPending}
          className="min-h-10 rounded-control border border-border px-4 text-xs font-medium transition-colors hover:border-primary/50 disabled:opacity-60"
        >
          {isPending ? "جارٍ التنظيف..." : "تنظيف الصور القديمة"}
        </button>
      </form>

      {(state.error || state.warning || state.message) && (
        <p role="status" className="mt-3 text-xs leading-6 text-muted">
          {state.error ?? state.warning ?? state.message}
        </p>
      )}
    </div>
  );
}
