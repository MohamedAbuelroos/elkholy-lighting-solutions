"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { createCatalogAdmin } from "@/app/admin/users/actions";
import type { CreateAdminState } from "@/lib/admin/user-form-types";

const initialState: CreateAdminState = {
  error: null,
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

export function CreateAdminForm() {
  const [email, setEmail] = useState("");

  const [state, formAction, isPending] = useActionState(
    createCatalogAdmin,
    initialState,
  );

  return (
    <form action={formAction} className="max-w-2xl">
      <fieldset
        disabled={isPending}
        className="min-w-0 space-y-6 rounded-card border border-border bg-surface p-5 sm:p-7"
      >
        <legend className="sr-only">بيانات المدير الجديد</legend>

        <div>
          <label htmlFor="admin-email" className="text-sm font-medium">
            البريد الإلكتروني
          </label>

          <input
            id="admin-email"
            name="email"
            type="email"
            dir="ltr"
            required
            maxLength={254}
            autoComplete="off"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="text-sm font-medium">
            كلمة المرور
          </label>

          <input
            id="admin-password"
            name="password"
            type="password"
            dir="ltr"
            required
            minLength={12}
            maxLength={64}
            autoComplete="new-password"
            aria-describedby="admin-password-help"
            className={inputClassName}
          />

          <p
            id="admin-password-help"
            className="mt-2 text-xs leading-6 text-muted"
          >
            من 12 إلى 64 حرفًا، وتتضمن حروفًا إنجليزية وأرقامًا.
          </p>
        </div>

        <div>
          <label
            htmlFor="admin-confirm-password"
            className="text-sm font-medium"
          >
            تأكيد كلمة المرور
          </label>

          <input
            id="admin-confirm-password"
            name="confirm_password"
            type="password"
            dir="ltr"
            required
            minLength={12}
            maxLength={64}
            autoComplete="new-password"
            className={inputClassName}
          />
        </div>

        <div className="rounded-control border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold">الصلاحية: مدير محتوى</p>

          <p className="mt-2 text-xs leading-6 text-muted">
            يستطيع إدارة محتوى الموقع المتاح في لوحة الإدارة. إدارة المستخدمين
            متاحة للمدير الرئيسي فقط.
          </p>

          <p className="mt-2 text-xs leading-6 text-muted">
            الحساب يُفعّل مباشرة. سلّم بيانات الدخول لصاحب الحساب بصورة خاصة؛ لا
            تُرسل رسالة بريدية تلقائيًا.
          </p>
        </div>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="mt-5 rounded-control border border-red-500/25 bg-red-500/10 p-4 text-sm leading-7"
        >
          {state.error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 items-center justify-center rounded-control bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-50"
        >
          {isPending ? "جارٍ إنشاء الحساب..." : "إضافة المدير"}
        </button>

        {!isPending && (
          <Link
            href="/admin/users"
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-border px-5 text-sm text-muted hover:text-foreground"
          >
            إلغاء والعودة
          </Link>
        )}
      </div>
    </form>
  );
}
