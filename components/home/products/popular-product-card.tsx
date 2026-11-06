import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaImage, FaStar } from "react-icons/fa6";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { FavoriteButton } from "@/components/products/favorite-button";
import { getProductPath } from "@/config/routes";
import type { Product } from "@/types/product";

type PopularProductCardProps = {
  product: Product;
  categoryName: string;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function PopularProductCard({
  product,
  categoryName,
}: PopularProductCardProps) {
  const image = product.images[0];
  const detailsHref = getProductPath(product.slug);

  const isDiscounted =
    product.discount_percent > 0 &&
    product.price !== null &&
    product.sale_price !== null;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface transition-colors duration-300 hover:border-primary/45 focus-within:border-primary/45 motion-reduce:transition-none">
      <div className="relative isolate overflow-hidden bg-surface-elevated">
        <Link
          href={detailsHref}
          aria-label={`عرض تفاصيل ${product.name_ar}`}
          className="relative block aspect-[5/4] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary"
        >
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.055] motion-safe:group-focus-within:scale-[1.055]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center bg-[#15171C] text-white/35">
              <FaImage aria-hidden="true" className="size-9" />
            </span>
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070B]/95 via-[#05070B]/15 to-transparent"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 p-5 pt-16">
            <p className="mb-2 flex min-w-0 items-center gap-2 text-[10px] font-medium leading-5 text-[#E8CC91]">
              <span
                aria-hidden="true"
                className="h-px w-4 shrink-0 bg-[#E8CC91]/70"
              />

              <span className="truncate">{categoryName}</span>
            </p>

            <div className="flex items-end justify-between gap-3">
              <h3 className="min-w-0 flex-1">
                <span className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-white">
                  {product.name_ar}
                </span>
              </h3>

              <span
                aria-hidden="true"
                className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors duration-200 group-hover:border-[#E2B858]/60 group-hover:text-[#E2B858]"
              >
                <FaArrowLeft className="size-3" />
              </span>
            </div>
          </div>
        </Link>

        <div className="pointer-events-none absolute start-3 end-14 top-3 flex flex-wrap gap-1.5">
          {product.is_popular && (
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-white/20 bg-[#11100D]/80 px-2.5 text-[10px] font-medium text-[#F0D79D]">
              <FaStar aria-hidden="true" className="size-2.5" />
              شائع
            </span>
          )}

          {isDiscounted && (
            <span className="inline-flex min-h-7 items-center rounded-full border border-[#E2B858]/50 bg-[#D6A744] px-2.5 text-[10px] font-semibold text-[#17120A]">
              خصم {product.discount_percent}٪
            </span>
          )}
        </div>

        <FavoriteButton
          productId={product.id}
          productName={product.name_ar}
          className="absolute end-3 top-3 z-10"
        />
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-3 px-5 py-4">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />

        <div className="min-w-0">
          {isDiscounted &&
          product.price !== null &&
          product.sale_price !== null ? (
            <>
              <p className="text-[11px] leading-5 text-muted">
                <span className="sr-only">السعر قبل الخصم: </span>

                <del className="tabular-nums">
                  {priceFormatter.format(product.price)}
                </del>
              </p>

              <p className="break-words text-base font-semibold leading-7 tabular-nums text-foreground">
                <span className="sr-only">السعر بعد الخصم: </span>
                {priceFormatter.format(product.sale_price)}
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] leading-5 text-muted">
                {product.sale_price !== null ? "سعر الوحدة" : "تفاصيل السعر"}
              </p>

              <p
                className={`break-words font-semibold leading-7 ${
                  product.sale_price !== null
                    ? "text-base tabular-nums text-foreground"
                    : "text-xs text-muted"
                }`}
              >
                {product.sale_price !== null
                  ? priceFormatter.format(product.sale_price)
                  : "السعر عند الاستفسار"}
              </p>
            </>
          )}
        </div>

        <AddToCartButton
          productId={product.id}
          productName={product.name_ar}
          iconOnly
          className="shrink-0"
        />
      </div>
    </article>
  );
}
