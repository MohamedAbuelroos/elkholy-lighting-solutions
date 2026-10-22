import Link from "next/link";
import { FaFireFlameCurved } from "react-icons/fa6";

import { ProductDetailActions } from "@/components/products/details/product-detail-actions";
import { routes } from "@/config/routes";

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
  maximumFractionDigits: 2,
});

export function ProductInformation({
  product,
  category,
  productUrl,
  whatsappHref,
}: ProductInformationProps) {
  const categoryHref = `${routes.products}?${new URLSearchParams({
    category: category.slug,
  })}`;

  return (
    <div className="lg:sticky lg:top-28">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={categoryHref}
          className="inline-flex min-h-9 items-center rounded-full border border-primary/25 bg-primary/5 px-4 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
        >
          {category.name_ar}
        </Link>

        {product.is_popular && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <FaFireFlameCurved
              aria-hidden="true"
              className="size-3.5 text-primary"
            />
            من المنتجات الشائعة
          </span>
        )}
      </div>

      <h1 className="mt-6 text-3xl font-semibold leading-[1.5] tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]">
        {product.name_ar}
      </h1>

      {product.sku && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-muted">كود المنتج</span>

          <span
            dir="ltr"
            className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono tracking-wider text-foreground"
          >
            {product.sku}
          </span>
        </div>
      )}

      <div className="my-7 h-px bg-border" />

      <div>
        <p className="text-xs text-muted">
          {product.price !== null ? "سعر المنتج" : "لمعرفة السعر"}
        </p>

        <p
          className={`mt-3 font-semibold leading-relaxed text-foreground ${
            product.price !== null
              ? "text-3xl tabular-nums sm:text-4xl"
              : "text-2xl"
          }`}
        >
          {product.price !== null
            ? priceFormatter.format(product.price)
            : "السعر عند الاستفسار"}
        </p>

        <p className="mt-3 text-xs leading-6 text-muted">
          تواصل معنا لتأكيد التوافر ومناقشة التفاصيل المناسبة لمشروعك.
        </p>
      </div>

      <div className="mt-7">
        <ProductDetailActions
          key={product.id}
          productId={product.id}
          productName={product.name_ar}
          sku={product.sku}
          price={product.price}
          productUrl={productUrl}
          whatsappHref={whatsappHref}
        />
      </div>

      <p className="mt-3 text-center text-[11px] leading-6 text-muted">
        طلبك مبدئي، ويؤكد الفريق التوافر والسعر النهائي والدفع والتوصيل.
      </p>

      <div className="mt-8 border-t border-border pt-6">
        <div className="mb-4 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-7 bg-primary" />

          <h2 className="text-sm font-semibold text-foreground">عن المنتج</h2>
        </div>

        <p className="whitespace-pre-line break-words text-sm leading-8 text-muted">
          {product.description_ar.trim() ||
            "للمزيد من المعلومات عن هذا المنتج ومواصفاته، تواصل مع فريق الخولي."}
        </p>
      </div>
    </div>
  );
}
