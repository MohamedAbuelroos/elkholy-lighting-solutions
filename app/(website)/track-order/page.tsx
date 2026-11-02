import type { Metadata } from "next";
import Link from "next/link";

import { OrderTrackingForm } from "@/components/orders/order-tracking-form";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "متابعة الطلب | الخولي",
  description: "تابع حالة طلبك لدى الخولي باستخدام كود التتبع.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-background pb-16 pt-28 text-foreground sm:pb-24 lg:pt-32">
      <div className="site-container">
        <nav aria-label="مسار التنقل">
          <ol className="flex items-center gap-3 text-xs text-muted">
            <li>
              <Link
                href={routes.home}
                className="transition-colors hover:text-primary"
              >
                الرئيسية
              </Link>
            </li>

            <li aria-hidden="true">›</li>

            <li aria-current="page" className="text-primary">
              متابعة الطلب
            </li>
          </ol>
        </nav>

        <header className="mx-auto mb-8 max-w-2xl pt-10 text-center sm:mb-10">
          <p className="text-xs font-medium text-primary">نكمّل معك كل خطوة</p>

          <h1 className="mt-4 text-3xl font-medium leading-relaxed sm:text-4xl">
            اطّمن على
            <span className="text-primary"> حالة طلبك.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-muted">
            أدخل كود التتبع لمعرفة الحالة الحالية وآخر تحديث
          </p>
        </header>

        <OrderTrackingForm />
      </div>
    </div>
  );
}
