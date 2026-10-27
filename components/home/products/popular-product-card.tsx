import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaImage, FaStar } from "react-icons/fa6";

import { getProductPath } from "@/config/routes";
import type { Product } from "@/types/product";
import { FavoriteButton } from "@/components/products/favorite-button";

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

  const isDiscounted =
    product.discount_percent > 0 &&
    product.price !== null &&
    product.sale_price !== null;

  return (
    <div className="relative h-full">
      <Link
        href={getProductPath(product.slug)}
        aria-label={`عرض تفاصيل ${product.name_ar}`}
        className="group block h-full overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-primary/60 focus-visible:border-primary motion-reduce:transition-none"
      >
        <article className="flex h-full flex-col">
          {/* Full-width image */}
          <div className="relative isolate aspect-[6/4] overflow-hidden bg-surface-elevated [transform:translateZ(0)]">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover scale-[1.01] [backface-visibility:hidden] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.05] motion-safe:group-focus-visible:scale-[1.05]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted">
                <FaImage aria-hidden="true" className="size-8" />
              </div>
            )}

            <div className="pointer-events-none absolute start-3 end-14 top-3 flex flex-wrap items-center gap-1.5">
              {product.is_popular && (
                <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-[#E2B858]/40 bg-[#25190D]/80 px-2.5 text-[10px] font-medium text-[#F0C573] backdrop-blur-md">
                  <FaStar aria-hidden="true" className="size-2.5" />
                  شائع
                </span>
              )}

              {isDiscounted && (
                <span className="inline-flex min-h-7 items-center rounded-full border border-[#E2B858]/40 bg-[#D6A744] px-2.5 text-[10px] font-semibold text-[#05070B]">
                  خصم {product.discount_percent}٪
                </span>
              )}
            </div>

            {/* Category on the image */}
            <span className="absolute bottom-3 start-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-white/20 bg-black/65 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-md">
              {categoryName}
            </span>
          </div>

          {/* Information */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="line-clamp-2 h-10 text-sm font-semibold leading-6 text-foreground transition-colors duration-200 group-hover:text-primary group-focus-visible:text-primary">
              {product.name_ar}
            </h3>

            <p className="min-h-4 text-[10px] leading-2 text-muted">
              {product.sku ? (
                <span
                  dir="ltr"
                  className="inline-block max-w-full truncate align-bottom"
                >
                  {product.sku}
                </span>
              ) : (
                "بدون كود"
              )}
            </p>

            <div className="mt-auto pt-1">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  {isDiscounted &&
                  product.price !== null &&
                  product.sale_price !== null ? (
                    <>
                      <p className="text-[14px] leading-5 text-muted">
                        <span className="sr-only">السعر قبل الخصم: </span>

                        <del className="tabular-nums">
                          {priceFormatter.format(product.price)}
                        </del>
                      </p>

                      <p className="text-md font-semibold leading-6 tabular-nums text-primary sm:text-base">
                        <span className="sr-only">السعر بعد الخصم: </span>
                        {priceFormatter.format(product.sale_price)}
                      </p>
                    </>
                  ) : (
                    <p
                      className={`font-semibold leading-6 tabular-nums ${
                        product.sale_price !== null
                          ? "text-sm text-primary sm:text-base"
                          : "text-xs text-muted"
                      }`}
                    >
                      {product.sale_price !== null
                        ? priceFormatter.format(product.sale_price)
                        : "السعر عند الاستفسار"}
                    </p>
                  )}
                </div>
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary group-focus-visible:border-primary group-focus-visible:bg-primary group-focus-visible:text-on-primary"
                >
                  <FaArrowLeft className="size-3.5" />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
      <FavoriteButton
        productId={product.id}
        productName={product.name_ar}
        className="absolute end-3 top-3 z-10"
      />
    </div>
  );
}
