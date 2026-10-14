import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaImage } from "react-icons/fa6";

import { getProductPath } from "@/config/routes";
import type { Product } from "@/types/product";

type PopularProductCardProps = {
  product: Product;
  categoryName: string;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
});

export function PopularProductCard({
  product,
  categoryName,
}: PopularProductCardProps) {
  const image = product.images[0];

  return (
    <Link
      href={getProductPath(product.slug)}
      aria-label={`عرض تفاصيل ${product.name_ar}`}
      className="group block h-full rounded-2xl border border-border bg-surface p-3 transition-colors duration-200 hover:border-primary/50 motion-reduce:transition-none"
    >
      <article className="flex h-full flex-col">
        <div className="relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-surface-elevated [transform:translateZ(0)]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover scale-[1.01] [backface-visibility:hidden] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              <FaImage aria-hidden="true" className="size-8" />
            </div>
          )}

          <span className="absolute start-3 top-3 rounded-full bg-[#D6A744] px-3 py-1 text-[11px] font-semibold text-[#05070B]">
            شائع
          </span>
        </div>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
          <p className="text-xs font-medium text-primary">{categoryName}</p>

          <h3 className="mt-2 min-h-12 text-sm font-semibold leading-6 text-foreground transition-colors group-hover:text-primary">
            {product.name_ar}
          </h3>

          {product.sku && (
            <p className="mt-2 text-[11px] text-muted">
              كود المنتج:{" "}
              <span dir="ltr" className="inline-block">
                {product.sku}
              </span>
            </p>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {product.price !== null
                  ? priceFormatter.format(product.price)
                  : "السعر عند الاستفسار"}
              </p>

              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary"
              >
                <FaArrowLeft className="size-3.5" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
