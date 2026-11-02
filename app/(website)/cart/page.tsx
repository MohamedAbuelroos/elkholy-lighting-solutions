import type { Metadata } from "next";
import Link from "next/link";
import { FaBagShopping, FaTruckFast } from "react-icons/fa6";

import { CartContent } from "@/components/cart/cart-content";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "السلة | الخولي",
  description: "راجع المنتجات التي اخترتها وحدّد الكميات المناسبة لك.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
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
              السلة
            </li>
          </ol>
        </nav>

        <header className="mb-8 border-b border-border pb-8 pt-8 sm:mb-10 sm:pb-10">
          <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
            <FaBagShopping aria-hidden="true" className="size-3.5" />
            اختيارات تكمل مساحتك
          </p>

          <h1 className="text-3xl font-medium leading-relaxed sm:text-4xl">
            كل ما تحتاجه،
            <span className="block text-primary">في سلة واحدة.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-8 text-muted">
            راجع اختياراتك وحدّد الكميات. السلة محفوظة على هذا المتصفح، والأسعار
            تُحدّث عند فتح الصفحة.
          </p>
        </header>
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <FaTruckFast className="size-5" />
            </span>

            <div>
              <h2 className="text-sm font-medium leading-7 text-foreground">
                عندك طلب سابق؟
              </h2>

              <p className="mt-1 text-xs leading-7 text-muted">
                تابع حالته بكود التتبع، بدون تسجيل دخول.
              </p>
            </div>
          </div>

          <Link
            href={routes.trackOrder}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-primary/30 px-5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            متابعة طلبك
            <FaTruckFast aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <CartContent />
      </div>
    </div>
  );
}
