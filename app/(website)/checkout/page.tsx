import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutContent } from "@/components/cart/checkout-content";
import { routes } from "@/config/routes";
import { notFound } from "next/navigation";
import type { CartItem } from "@/lib/cart/store";

export const metadata: Metadata = {
  title: "إتمام الطلب | الخولي",
  robots: {
    index: false,
    follow: false,
  },
};

type CheckoutPageProps = {
  searchParams: Promise<{
    product?: string | string[];
    quantity?: string | string[];
  }>;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;

  let directItem: CartItem | null = null;

  const hasDirectParameters =
    params.product !== undefined || params.quantity !== undefined;

  if (hasDirectParameters) {
    if (
      typeof params.product !== "string" ||
      !UUID_PATTERN.test(params.product) ||
      typeof params.quantity !== "string" ||
      !/^[1-9]\d{0,2}$/.test(params.quantity)
    ) {
      notFound();
    }

    directItem = {
      productId: params.product.toLowerCase(),
      quantity: Number(params.quantity),
    };
  }
  return (
    <div className="min-h-screen bg-background pb-16 pt-28 text-foreground sm:pb-24 lg:pt-32">
      <div className="site-container">
        <nav aria-label="مسار التنقل">
          <ol className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <li>
              <Link href={routes.home} className="hover:text-primary">
                الرئيسية
              </Link>
            </li>

            <li aria-hidden="true">›</li>

            <li>
              <Link
                href={directItem ? routes.products : "/cart"}
                className="hover:text-primary"
              >
                {directItem ? "المنتجات" : "السلة"}
              </Link>
            </li>

            <li aria-hidden="true">›</li>

            <li aria-current="page" className="text-primary">
              إتمام الطلب
            </li>
          </ol>
        </nav>

        <header className="mb-8 border-b border-border pb-8 pt-8 sm:mb-10">
          <p className="text-xs font-medium text-primary">
            خطوة أقرب لاختياراتك
          </p>

          <h1 className="mt-4 text-3xl font-medium leading-relaxed sm:text-4xl">
            تفاصيل بسيطة،
            <span className="block text-primary">ونكمّل معك الباقي.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-8 text-muted">
            اكتب بيانات التواصل وطريقة الاستلام، وفريق الخولي يتواصل معك لتأكيد
            تفاصيل طلبك.
          </p>
        </header>

        <CheckoutContent
          key={
            directItem
              ? `direct:${directItem.productId}:${directItem.quantity}`
              : "cart"
          }
          directItem={directItem}
        />
      </div>
    </div>
  );
}
