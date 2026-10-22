import type { Metadata } from "next";
import Link from "next/link";

import { AdminSuccessNotice } from "@/components/admin/admin-success-notice";
import { UsersTable } from "@/components/admin/users/users-table";
import { getAdminUsers } from "@/lib/admin/queries/users";

export const metadata: Metadata = {
  title: "المستخدمون",
};

type AdminUsersPageProps = {
  searchParams: Promise<{
    success?: string | string[];
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;
  const users = await getAdminUsers();

  return (
    <section>
      {params.success === "created" && (
        <AdminSuccessNotice
          title="تمت إضافة المدير بنجاح"
          description="يمكنه تسجيل الدخول باستخدام البريد وكلمة المرور المحددين."
        />
      )}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-primary">إدارة الوصول</p>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">المستخدمون</h1>

          <p className="mt-3 text-sm leading-7 text-muted">
            حسابات إدارة الموقع وصلاحياتها — {users.length} حساب.
          </p>
        </div>

        <Link
          href="/admin/users/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-control bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          <span aria-hidden="true">+</span>
          إضافة مدير
        </Link>
      </div>

      <UsersTable users={users} />
    </section>
  );
}
