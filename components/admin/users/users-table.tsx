import type { AdminUser } from "@/lib/admin/queries/users";
import { UserStatusControl } from "@/components/admin/users/user-status-control";

type UsersTableProps = {
  users: AdminUser[];
};

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Cairo",
});

function formatDate(value: string | null): string {
  if (!value) return "لم يسجل الدخول بعد";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-start text-sm">
          <caption className="sr-only">حسابات إدارة الموقع وصلاحياتها</caption>

          <thead className="border-b border-border bg-surface-elevated">
            <tr>
              {[
                "البريد الإلكتروني",
                "الصلاحية",
                "الحالة",
                "تاريخ الإضافة",
                "آخر دخول",
                "الإجراءات",
              ].map((title) => (
                <th
                  key={title}
                  scope="col"
                  className="px-5 py-4 text-start font-medium"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.user_id}>
                <th scope="row" className="px-5 py-5 text-start font-medium">
                  <span dir="ltr" className="inline-block break-all">
                    {user.email}
                  </span>
                </th>

                <td className="whitespace-nowrap px-5 py-5">
                  <span
                    className={
                      user.role === "owner"
                        ? "font-medium text-primary"
                        : "text-muted"
                    }
                  >
                    {user.role === "owner" ? "مدير رئيسي" : "مدير محتوى"}
                  </span>
                </td>

                <td className="px-5 py-5">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs ${
                      user.is_active
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted"
                    }`}
                  >
                    {user.is_active ? "نشط" : "معطّل"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-5 text-xs text-muted">
                  {formatDate(user.created_at)}
                </td>

                <td className="whitespace-nowrap px-5 py-5 text-xs text-muted">
                  {formatDate(user.last_sign_in_at)}
                </td>
                <td className="px-5 py-5">
                  {user.role === "owner" ? (
                    <span
                      title="حساب المدير الرئيسي محمي من التعطيل"
                      className="text-xs text-muted"
                    >
                      حساب محمي
                    </span>
                  ) : (
                    <UserStatusControl
                      userId={user.user_id}
                      email={user.email}
                      isActive={user.is_active}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
