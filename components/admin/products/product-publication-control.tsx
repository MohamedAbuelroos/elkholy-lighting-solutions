"use client";

import { useActionState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import { changeProductPublication } from "@/app/admin/products/publication-actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import type { ProductPublicationState } from "@/lib/admin/product-form-types";

type ProductPublicationControlProps = {
  productId: string;
  isActive: boolean;
  imageCount: number;
};

const initialState: ProductPublicationState = {
  error: null,
  successId: null,
  message: null,
};

export function ProductPublicationControl({
  productId,
  isActive,
  imageCount,
}: ProductPublicationControlProps) {
  const action = changeProductPublication.bind(null, productId);

  const [state, formAction, isPending] = useActionState(action, initialState);

  const needsImage = !isActive && imageCount === 0;

  return (
    <div className="mb-8 max-w-4xl rounded-card border border-border bg-surface p-5 sm:p-6">
      {state.successId && state.message && (
        <AdminSuccessNotice key={state.successId} title={state.message} />
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
              isActive
                ? "bg-primary/10 text-primary"
                : "bg-surface-elevated text-muted"
            }`}
          >
            {isActive ? (
              <FaEye aria-hidden="true" className="size-4" />
            ) : (
              <FaEyeSlash aria-hidden="true" className="size-4" />
            )}
          </span>

          <div>
            <h2 className="text-sm font-semibold">
              حالة النشر
              <span
                className={`ms-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-medium ${
                  isActive
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted"
                }`}
              >
                {isActive ? "مفعّل" : "مخفي"}
              </span>
            </h2>

            <p className="mt-2 max-w-lg text-xs leading-6 text-muted">
              {isActive
                ? "المنتج مفعّل. ظهوره للزوار مرتبط أيضًا بتفعيل فئته وكل الفئات الأعلى منها."
                : "المنتج محفوظ داخل الإدارة ولا يظهر للزوار."}
            </p>
          </div>
        </div>

        <form action={formAction} className="shrink-0">
          <input
            type="hidden"
            name="operation"
            value={isActive ? "hide" : "publish"}
          />

          <button
            type="submit"
            disabled={isPending || needsImage}
            className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-control px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
              isActive
                ? "border border-border text-foreground hover:border-primary/50 hover:text-primary"
                : "bg-primary text-on-primary hover:bg-primary-hover"
            }`}
          >
            {isPending ? (
              "جارٍ الحفظ..."
            ) : isActive ? (
              <>
                <FaEyeSlash aria-hidden="true" className="size-4" />
                إخفاء المنتج
              </>
            ) : (
              <>
                <FaEye aria-hidden="true" className="size-4" />
                نشر المنتج
              </>
            )}
          </button>
        </form>
      </div>

      {needsImage && (
        <p className="mt-4 border-t border-border pt-4 text-xs leading-6 text-muted">
          أضف صورة واحدة على الأقل من قسم الصور بالأسفل لتفعيل زر النشر.
        </p>
      )}

      <p className="mt-3 text-xs leading-6 text-muted">
        زر النشر يغيّر حالة المنتج المحفوظة فقط. احفظ تعديلات بيانات المنتج قبل
        تغيير حالة النشر.
      </p>

      {state.error && (
        <p
          role="alert"
          className="mt-4 rounded-control border border-red-500/25 bg-red-500/10 p-3 text-sm leading-7 text-foreground"
        >
          {state.error}
        </p>
      )}
    </div>
  );
}
