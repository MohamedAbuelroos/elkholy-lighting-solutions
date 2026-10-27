import Link from "next/link";
import {
  FaChevronDown,
  FaFireFlameCurved,
  FaLocationDot,
} from "react-icons/fa6";

import { ProductDetailActions } from "@/components/products/details/product-detail-actions";
import { getCategoryPath, routes } from "@/config/routes";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

type ProductInformationProps = {
  product: Product;
  category: Category;
  productUrl: string;
  whatsappHref: string;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function ProductInformation({
  product,
  category,
  productUrl,
  whatsappHref,
}: ProductInformationProps) {
  const isDiscounted =
    product.discount_percent > 0 &&
    product.price !== null &&
    product.sale_price !== null;
  return (
    <div className="min-w-0">
      {/* Category and popularity */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={getCategoryPath(category.slug)}
          className="inline-flex min-h-9 max-w-full items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-[11px] font-medium leading-6 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {category.name_ar}
        </Link>

        {product.is_popular && (
          <span className="inline-flex items-center gap-1.5 text-[11px] leading-6 text-muted">
            <FaFireFlameCurved
              aria-hidden="true"
              className="size-3 text-primary"
            />
            من اختيارات عملائنا
          </span>
        )}
      </div>

      {/* Product identity */}
      <h1 className="mt-5 break-words text-[clamp(1.625rem,2.7vw,2.5rem)] font-medium leading-[1.65] text-foreground">
        {product.name_ar}
      </h1>

      {product.sku && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px]">
          <span className="text-muted">كود المنتج</span>

          <span
            dir="ltr"
            className="max-w-full break-all rounded-lg border border-border bg-surface px-3 py-1.5 font-mono leading-5 tracking-wide text-foreground"
          >
            {product.sku}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="mt-6 border-t border-border pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[11px] leading-6 text-muted">
            {product.sale_price !== null
              ? "سعر الوحدة المعروض"
              : "تفاصيل السعر"}
          </p>

          {isDiscounted && (
            <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">
              خصم {product.discount_percent}٪
            </span>
          )}
        </div>

        {isDiscounted && product.price !== null && (
          <p className="mt-3 text-sm leading-6 text-muted">
            <span className="sr-only">السعر قبل الخصم: </span>

            <del className="tabular-nums">
              {priceFormatter.format(product.price)}
            </del>
          </p>
        )}

        <p
          className={`mt-2 font-medium leading-relaxed text-foreground ${
            product.sale_price !== null
              ? "text-3xl tabular-nums sm:text-4xl"
              : "text-xl sm:text-2xl"
          }`}
        >
          {isDiscounted && <span className="sr-only">السعر بعد الخصم: </span>}

          {product.sale_price !== null
            ? priceFormatter.format(product.sale_price)
            : "السعر عند الاستفسار"}
        </p>
      </div>

      {/* Ordering */}
      <div className="mt-6 rounded-3xl border border-border bg-surface p-4 sm:p-5">
        <ProductDetailActions
          key={product.id}
          productId={product.id}
          productName={product.name_ar}
          sku={product.sku}
          price={product.sale_price}
          productUrl={productUrl}
          whatsappHref={whatsappHref}
        />

        <p className="mt-4 border-t border-border pt-3 text-[10px] leading-7 text-muted">
          إرسال الطلب لا يُتم عملية شراء أو دفع. يؤكد الفريق التوافر والسعر
          النهائي وطرق الدفع وتكلفة التوصيل معك.
        </p>
      </div>

      {/* Full description */}
      <details open className="group/description mt-6 border-y border-border">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-4 text-sm font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
          تفاصيل المنتج
          <FaChevronDown
            aria-hidden="true"
            className="size-3 shrink-0 text-primary transition-transform duration-200 group-open/description:rotate-180 motion-reduce:transition-none"
          />
        </summary>

        <p className="whitespace-pre-line break-words pb-5 text-sm leading-8 text-muted">
          {product.description_ar.trim() ||
            "تواصل مع فريق الخولي لمعرفة مواصفات هذا المنتج والتفاصيل المناسبة لاستخدامك."}
        </p>
      </details>

      <Link
        href={routes.branches}
        className="mt-3 inline-flex min-h-11 items-center gap-2.5 rounded-sm text-[11px] font-medium text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <FaLocationDot
          aria-hidden="true"
          className="size-3.5 shrink-0 text-primary"
        />
        عناوين معارضنا ومواعيد الزيارة
      </Link>
    </div>
  );
}
