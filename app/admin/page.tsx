import Link from "next/link";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaLayerGroup,
  FaBriefcase,
} from "react-icons/fa6";

import { requireAdmin } from "@/lib/auth/require-admin";

const sections = [
  {
    title: "فئات المنتجات",
    description: "نظّم الفئات الأساسية والفرعية، وحدد ترتيبها وحالة ظهورها.",
    href: "/admin/categories",
    icon: FaLayerGroup,
  },
  {
    title: "المنتجات",
    description: "أدر بيانات المنتجات وأسعارها وفئاتها وظهورها داخل الكتالوج.",
    href: "/admin/products",
    icon: FaBoxOpen,
  },
  {
    title: "المشاريع",
    description:
      "أدر أعمال الخولي وبيانات المشاريع وصورها واختيارات الصفحة الرئيسية.",
    href: "/admin/projects",
    icon: FaBriefcase,
  },
] as const;

export default async function AdminPage() {
  await requireAdmin();

  return (
    <section>
      <p className="text-xs font-medium text-primary">
        مرحبًا بك في لوحة الإدارة
      </p>

      <h1 className="mt-3 text-2xl font-bold sm:text-3xl">نظرة عامة</h1>

      <p className="mt-3 text-sm leading-7 text-muted">
        اختر القسم الذي تريد إدارة محتواه.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col rounded-card border border-border bg-surface p-6 transition-colors hover:border-primary/50 sm:p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>

              <h2 className="mt-5 text-lg font-semibold transition-colors group-hover:text-primary">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-7 text-muted">
                {section.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm font-medium text-primary">
                <span>إدارة القسم</span>
                <FaArrowLeft aria-hidden="true" className="size-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
