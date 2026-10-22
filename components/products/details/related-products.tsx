import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

import { routes } from "@/config/routes";
import { getRelatedProducts } from "@/lib/queries/product-details";
import { ProductCard } from "@/components/home/products/product-card";

type RelatedProductsProps = {
  productId: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
};

export async function RelatedProducts({
  productId,
  categoryId,
  categorySlug,
  categoryName,
}: RelatedProductsProps) {
  const products = await getRelatedProducts(productId, categoryId);

  if (products.length === 0) return null;

  const categoryHref = `${routes.products}?${new URLSearchParams({
    category: categorySlug,
  })}`;

  return (
    <section
      aria-labelledby="related-products-title"
      className="mt-16 border-t border-border pt-10 sm:mt-20 sm:pt-14"
    >
      <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 flex items-center gap-3 text-xs font-medium text-primary">
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
            اكتشف المزيد
          </p>

          <h2
            id="related-products-title"
            className="text-2xl font-semibold leading-relaxed tracking-tight sm:text-3xl"
          >
            قد يعجبك أيضًا
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted">
            اختيارات أخرى من مجموعة {categoryName}.
          </p>
        </div>

        <Link
          href={categoryHref}
          className="group inline-flex min-h-11 shrink-0 items-center gap-3 self-start rounded-full border border-border bg-surface px-5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary sm:self-auto"
        >
          عرض المجموعة كاملة
          <FaArrowLeft
            aria-hidden="true"
            className="size-3 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-x-1"
          />
        </Link>
      </div>

      <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryName={categoryName}
          />
        ))}
      </div>
    </section>
  );
}
