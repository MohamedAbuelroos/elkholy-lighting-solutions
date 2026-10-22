import type { Metadata } from "next";
import Link from "next/link";

import { CreateAdminForm } from "@/components/admin/users/create-admin-form";
import { requireOwner } from "@/lib/auth/require-owner";

export const metadata: Metadata = {
  title: "إضافة مدير",
};

export default async function NewAdminUserPage() {
  await requireOwner();

  return (
    <section>
      <Link
        href="/admin/users"
        className="text-sm text-muted transition-colors hover:text-primary"
      >
        المستخدمون / إضافة مدير
      </Link>

      <div className="mb-8 mt-6">
        <p className="text-xs font-medium text-primary">إدارة الوصول</p>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">إضافة مدير جديد</h1>

        <p className="mt-3 text-sm leading-7 text-muted">
          أنشئ حسابًا مستقلًا لإدارة محتوى الموقع.
        </p>
      </div>

      <CreateAdminForm />
    </section>
  );
}
