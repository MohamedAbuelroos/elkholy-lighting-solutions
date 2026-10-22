import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "دخول الإدارة | الخولي",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    reason?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p dir="ltr" className="text-xs tracking-[0.2em] text-primary">
          ELKHOLY
        </p>

        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          دخول الإدارة
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted">
          سجّل الدخول بحساب المسؤول لإدارة محتوى الموقع.
        </p>

        {params.reason === "forbidden" && (
          <p role="alert" className="mt-4 text-sm text-primary">
            حسابك الحالي غير مصرح له بدخول لوحة الإدارة.
          </p>
        )}

        <LoginForm />

        <Link
          href="/"
          className="mt-6 inline-flex min-h-10 items-center text-xs text-muted hover:text-primary"
        >
          العودة للموقع
        </Link>
      </div>
    </main>
  );
}
