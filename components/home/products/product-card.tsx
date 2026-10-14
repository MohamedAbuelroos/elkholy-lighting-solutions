import Image from "next/image";
import Link from "next/link";
import { FaImage } from "react-icons/fa6";

import { getProductPath } from "@/config/routes";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  categoryName: string;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
});

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const image = product.images[0];

  return (
    <Link
      href={getProductPath(product.slug)}
      aria-label={`عرض تفاصيل ${product.name_ar}`}
      className="group block h-full overflow-hidden rounded-card border border-border bg-surface transition-colors duration-200 hover:border-primary/50 motion-reduce:transition-none"
    >
      <article className="flex h-full flex-col">
        <div className="relative isolate aspect-[5/4] overflow-hidden bg-surface-elevated [transform:translateZ(0)]">
          {" "}
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 80vw"
              className="object-cover scale-[1.01] [backface-visibility:hidden] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              <FaImage aria-hidden="true" className="size-8" />
            </div>
          )}
          {product.is_popular && (
            <span className="absolute start-3 top-3 rounded-full border border-white/20 bg-[#D6A744] px-3 py-1 text-[11px] font-semibold text-[#05070B] shadow-sm">
              شائع
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[11px] font-medium text-primary">{categoryName}</p>

          <h3 className="mt-2 min-h-12 text-sm font-semibold leading-6 text-foreground transition-colors group-hover:text-primary">
            {product.name_ar}
          </h3>

          <p className="mt-2 text-[11px] text-muted">
            كود المنتج:{" "}
            <span dir="ltr" className="inline-block">
              {product.sku ?? "—"}
            </span>
          </p>

          <div className="mt-auto pt-3">
            <p className="border-t border-border pt-3 text-base font-semibold tabular-nums text-foreground">
              {product.price !== null
                ? priceFormatter.format(product.price)
                : "السعر عند الاستفسار"}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
