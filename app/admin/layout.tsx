import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { logout } from "@/app/login/actions";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: {
    default: "لوحة الإدارة | الخولي",
    template: "%s | إدارة الخولي",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, supabase } = await requireAdmin();

  const { data: isOwner, error: ownerError } = await supabase.rpc(
    "current_user_is_owner",
  );

  if (ownerError) {
    console.error("Failed to load admin permissions", {
      code: ownerError.code,
    });

    throw new Error("تعذّر تحميل صلاحيات الحساب.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#admin-content"
        className="sr-only fixed start-4 top-4 z-50 rounded-control bg-primary px-4 py-3 text-on-primary focus:not-sr-only"
      >
        انتقل إلى المحتوى
      </a>

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/admin" className="min-w-0">
            <span
              dir="ltr"
              className="block text-sm font-semibold tracking-[0.16em] text-primary"
            >
              ELKHOLY ADMIN
            </span>

            <span className="mt-1 block text-xs text-muted">
              إدارة محتوى الموقع
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-muted hover:text-primary">
              عرض الموقع
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="min-h-10 rounded-control border border-border px-4 text-xs font-medium transition-colors hover:border-primary"
              >
                تسجيل الخروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-8">
        <aside>
          <nav
            aria-label="أقسام الإدارة"
            className="rounded-2xl border border-border bg-surface p-3"
          >
            <p className="px-3 pb-3 pt-2 text-[11px] font-medium text-muted">
              مساحة الإدارة
            </p>

            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className="block rounded-lg px-3 py-3 text-sm transition-colors hover:bg-surface-elevated hover:text-primary"
                >
                  نظرة عامة
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/categories"
                  className="block rounded-lg px-3 py-3 text-sm transition-colors hover:bg-surface-elevated hover:text-primary"
                >
                  فئات المنتجات
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className="flex min-h-11 items-center rounded-control px-4 py-3 text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-primary"
                >
                  المنتجات
                </Link>
              </li>
              <li>
                {isOwner === true && (
                  <Link
                    href="/admin/users"
                    className="flex min-h-11 items-center rounded-control px-4 py-3 text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-primary"
                  >
                    المستخدمون
                  </Link>
                )}
              </li>
              <li>
                <Link
                  href="/admin/account"
                  className="flex min-h-11 items-center rounded-control px-4 py-3 text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-primary"
                >
                  حسابي
                </Link>
              </li>
            </ul>
          </nav>

          <p
            dir="ltr"
            className="mt-4 break-all px-3 text-start text-[11px] leading-6 text-muted"
          >
            {user.email}
          </p>
        </aside>

        <main id="admin-content" tabIndex={-1} className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
