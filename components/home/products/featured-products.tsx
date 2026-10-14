import { ProductCard } from "@/components/home/products/product-card";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

import { routes } from "@/config/routes";
import { ProductSlider } from "@/components/home/products/product-slider";

export function FeaturedProducts() {
  const featuredProducts = products
    .filter((product) => product.is_active && product.is_featured)
    .sort((first, second) => first.sort_order - second.sort_order)
    .slice(0, 8);

  if (featuredProducts.length === 0) return null;

  return (
    <section
      id="featured-products"
      aria-labelledby="featured-products-title"
      className="section-space border-t border-border bg-background"
    >
      <div className="site-container">
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-medium text-primary sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              اختيارات الخولي
            </p>

            <h2
              id="featured-products-title"
              className="text-4xl font-bold leading-[1.4] text-foreground sm:text-5xl"
            >
              تفاصيل تختارها，
              <span className="mt-1 block text-primary">ومساحة تحبها.</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm leading-7 text-muted">
              تعرّف على مجموعة من منتجاتنا، واستفسر عن المواصفات والسعر وما
              يناسب احتياجات مشروعك.
            </p>

            <Link
              href={routes.products}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-3 rounded-control border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              استكشف جميع المنتجات
              <FaArrowLeft aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
        </div>

        <ProductSlider>
          {featuredProducts.map((product) => {
            const category = categories.find(
              (item) => item.id === product.category_id,
            );

            return (
              <div
                key={product.id}
                className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4rem)/4)]"
              >
                <ProductCard
                  product={product}
                  categoryName={category?.name_ar ?? "منتجات الخولي"}
                />
              </div>
            );
          })}
        </ProductSlider>
      </div>
    </section>
  );
}
