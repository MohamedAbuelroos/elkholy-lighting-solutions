import type { Metadata } from "next";

import { ChangePasswordForm } from "@/components/admin/account/change-password-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "حسابي",
};

export default async function AdminAccountPage() {
  const { supabase, user } = await requireAdmin();

  const { data: isOwner, error } = await supabase.rpc("current_user_is_owner");

  if (error) {
    console.error("Failed to load account role", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل بيانات الحساب.");
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-medium text-primary">إعدادات الحساب</p>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">حسابي</h1>

        <p className="mt-3 text-sm leading-7 text-muted">
          راجع بيانات حسابك وحدّث كلمة المرور الخاصة بك.
        </p>
      </div>

      <div className="mb-6 grid max-w-2xl gap-4 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xs text-muted">البريد الإلكتروني</h2>

          <p
            dir="ltr"
            className="mt-3 break-all text-start text-sm font-medium"
          >
            {user.email ?? "غير متاح"}
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xs text-muted">صلاحية الحساب</h2>

          <p className="mt-3 text-sm font-medium text-primary">
            {isOwner === true ? "مدير رئيسي" : "مدير محتوى"}
          </p>
        </div>
      </div>

      <ChangePasswordForm email={user.email ?? ""} />
    </section>
  );
}
