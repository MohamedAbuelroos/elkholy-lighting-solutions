"use client";

import { useActionState } from "react";

import { changeOwnPassword } from "@/app/admin/account/actions";
import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import type { ChangePasswordState } from "@/lib/admin/user-form-types";

type ChangePasswordFormProps = {
  email: string;
};

const initialState: ChangePasswordState = {
  error: null,
  successId: null,
};

const fields = [
  {
    name: "current_password",
    label: "كلمة المرور الحالية",
    autoComplete: "current-password",
    minLength: 1,
    maxLength: 1024,
  },
  {
    name: "new_password",
    label: "كلمة المرور الجديدة",
    autoComplete: "new-password",
    minLength: 12,
    maxLength: 64,
  },
  {
    name: "confirm_password",
    label: "تأكيد كلمة المرور الجديدة",
    autoComplete: "new-password",
    minLength: 12,
    maxLength: 64,
  },
] as const;

export function ChangePasswordForm({ email }: ChangePasswordFormProps) {
  const [state, formAction, isPending] = useActionState(
    changeOwnPassword,
    initialState,
  );

  return (
    <form action={formAction} className="max-w-2xl">
      {state.successId && (
        <AdminSuccessNotice
          key={state.successId}
          title="تم تغيير كلمة المرور بنجاح"
          description="استخدم كلمة المرور الجديدة عند تسجيل الدخول."
        />
      )}

      <input
        type="hidden"
        name="username"
        value={email}
        autoComplete="username"
      />

      <fieldset
        disabled={isPending}
        className="min-w-0 rounded-card border border-border bg-surface p-5 sm:p-7"
      >
        <legend className="sr-only">تغيير كلمة المرور</legend>

        <h2 className="text-lg font-semibold">تغيير كلمة المرور</h2>

        <p className="mt-2 text-xs leading-6 text-muted">
          أدخل كلمة المرور الحالية، ثم اختر كلمة جديدة لحسابك.
        </p>

        <div className="mt-6 space-y-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`account-${field.name}`}
                className="text-sm font-medium"
              >
                {field.label}
              </label>

              <input
                id={`account-${field.name}`}
                name={field.name}
                type="password"
                dir="ltr"
                required
                minLength={field.minLength}
                maxLength={field.maxLength}
                autoComplete={field.autoComplete}
                aria-describedby={
                  field.name === "new_password"
                    ? "account-password-help"
                    : undefined
                }
                className="mt-2 min-h-12 w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />

              {field.name === "new_password" && (
                <p
                  id="account-password-help"
                  className="mt-2 text-xs leading-6 text-muted"
                >
                  من 12 إلى 64 حرفًا، وتتضمن حروفًا إنجليزية وأرقامًا.
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-control bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-50"
        >
          {isPending ? "جارٍ حفظ كلمة المرور..." : "حفظ كلمة المرور"}
        </button>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="mt-5 rounded-control border border-red-500/25 bg-red-500/10 p-4 text-sm leading-7"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
