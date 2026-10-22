"use client";

import { useActionState } from "react";

import { login, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {
  error: null,
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  const inputClass =
    "mt-2 min-h-12 w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground";

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <div>
        <label
          htmlFor="admin-email"
          className="text-sm font-medium text-foreground"
        >
          البريد الإلكتروني
        </label>

        <input
          id="admin-email"
          name="email"
          type="email"
          dir="ltr"
          required
          maxLength={254}
          autoComplete="username"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="text-sm font-medium text-foreground"
        >
          كلمة المرور
        </label>

        <input
          id="admin-password"
          name="password"
          type="password"
          dir="ltr"
          required
          maxLength={1024}
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-control border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-500"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex min-h-12 w-full items-center justify-center rounded-control bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
      </button>
    </form>
  );
}
