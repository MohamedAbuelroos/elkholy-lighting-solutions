import Image from "next/image";
import Link from "next/link";
import { FaImage, FaStar } from "react-icons/fa6";

import { getProductPath } from "@/config/routes";
import type { Product } from "@/types/product";
import { FavoriteButton } from "@/components/products/favorite-button";

type ProductCardProps = {
  product: Product;
  categoryName: string;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const image = product.images[0];
  const detailsHref = getProductPath(product.slug);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-200 hover:border-primary/40 motion-reduce:transition-none">
      {/* Image */}
      <div className="relative isolate overflow-hidden bg-surface-elevated [transform:translateZ(0)]">
        <Link
          href={detailsHref}
          aria-label={`عرض تفاصيل ${product.name_ar}`}
          className="group relative block aspect-[5/4] overflow-hidden"
        >
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 80vw"
              className="object-cover scale-[1.01] [backface-visibility:hidden] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted">
              <FaImage aria-hidden="true" className="size-7" />
            </div>
          )}
        </Link>

        {product.is_popular && (
          <span className="pointer-events-none absolute start-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#E2B858]/40 bg-[#25190D]/80 px-2.5 py-1 text-[10px] font-medium text-[#F0C573] backdrop-blur-md">
            <FaStar aria-hidden="true" className="size-2.5" />
            شائع
          </span>
        )}
        <FavoriteButton
          productId={product.id}
          productName={product.name_ar}
          className="absolute end-2.5 top-2.5 z-10"
        />
      </div>

      {/* Information */}
      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-[11px] font-medium text-primary">
          {categoryName}
        </p>

        <h3 className="mt-1.5 h-10 text-md font-semibold leading-6 text-foreground">
          <Link
            href={detailsHref}
            className="line-clamp-2 transition-colors hover:text-primary"
          >
            {product.name_ar}
          </Link>
        </h3>

        <p className="line-clamp-2 h-10 text-xs leading-5 text-muted">
          {product.description_ar}
        </p>

        {/* SKU and price */}
        <div className="mt-auto pt-3">
          <div className="flex min-w-0 items-center justify-between gap-2 border-t border-border pt-3">
            <span
              dir="ltr"
              title={product.sku ?? undefined}
              className="min-w-0 max-w-[45%] truncate rounded-md bg-surface-elevated px-2 py-1 text-[10px] font-medium tracking-wide text-muted"
            >
              {product.sku ?? "—"}
            </span>

            <p
              className={`shrink-0 font-semibold tabular-nums ${
                product.price !== null
                  ? "text-sm text-primary"
                  : "text-[11px] text-muted"
              }`}
            >
              {product.price !== null
                ? priceFormatter.format(product.price)
                : "السعر عند الاستفسار"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
