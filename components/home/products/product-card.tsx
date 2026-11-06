import Image from "next/image";
import Link from "next/link";
import { FaImage, FaStar } from "react-icons/fa6";

import { getProductPath } from "@/config/routes";
import type { Product } from "@/types/product";
import { FavoriteButton } from "@/components/products/favorite-button";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

type ProductCardProps = {
  product: Product;
  categoryName: string;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const image = product.images[0];
  const detailsHref = getProductPath(product.slug);

  const isDiscounted =
    product.discount_percent > 0 &&
    product.price !== null &&
    product.sale_price !== null;

  return (
    <article className="group relative flex h-full min-w-0 flex-col rounded-[1.5rem] border border-border bg-surface p-2 transition-colors duration-300 hover:border-primary/50 focus-within:border-primary/50 motion-reduce:transition-none">
      <div className="relative isolate overflow-hidden rounded-[1rem] bg-surface-elevated">
        <Link
          href={detailsHref}
          aria-label={`عرض تفاصيل ${product.name_ar}`}
          className="relative block aspect-square overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary"
        >
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-muted">
              <FaImage aria-hidden="true" className="size-8" />
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute start-2.5 end-14 top-2.5 flex flex-wrap gap-1.5">
          {isDiscounted ? (
            <span className="inline-flex min-h-7 items-center rounded-full border border-[#F0D79D]/30 bg-[#D6A744] px-2.5 text-[10px] font-semibold text-[#17120A]">
              خصم {product.discount_percent}٪
            </span>
          ) : product.is_popular ? (
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-[#F0D79D]/30 bg-[#D6A744] px-2.5 text-[10px] font-semibold text-[#17120A]">
              <FaStar aria-hidden="true" className="size-2.5" />
              شائع
            </span>
          ) : null}
        </div>

        <FavoriteButton
          productId={product.id}
          productName={product.name_ar}
          className="absolute end-2.5 top-2.5 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-3.5 sm:px-3 sm:pb-3">
        <p
          title={categoryName}
          className="truncate text-[10px] font-medium leading-5 text-primary sm:text-[11px]"
        >
          {categoryName}
        </p>

        <h3 className="mt-1 min-h-10 text-sm font-semibold leading-6 text-foreground sm:text-[15px]">
          <Link
            href={detailsHref}
            className="line-clamp-2 rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {product.name_ar}
          </Link>
        </h3>

        <p className=" line-clamp-1 min-h-5 text-[11px] leading-5 text-muted">
          {product.description_ar}
        </p>

        <div className="mt-auto pt-2">
          <div className="flex min-h-8 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {isDiscounted &&
            product.price !== null &&
            product.sale_price !== null ? (
              <>
                <p className="break-words text-lg font-semibold leading-7 tabular-nums text-primary">
                  <span className="sr-only">السعر بعد الخصم: </span>
                  {priceFormatter.format(product.sale_price)}
                </p>

                <p className="break-words text-[11px] leading-5 text-muted">
                  <span className="sr-only">السعر قبل الخصم: </span>
                  <del className="tabular-nums">
                    {priceFormatter.format(product.price)}
                  </del>
                </p>
              </>
            ) : (
              <p
                className={`break-words font-semibold leading-7 ${
                  product.price !== null
                    ? "text-lg tabular-nums text-primary"
                    : "text-xs text-muted"
                }`}
              >
                {product.price !== null
                  ? priceFormatter.format(product.price)
                  : "السعر عند الاستفسار"}
              </p>
            )}
          </div>

          <div className="mt-3 border-t border-border pt-3">
            <AddToCartButton
              productId={product.id}
              productName={product.name_ar}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
