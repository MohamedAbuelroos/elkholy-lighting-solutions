import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

import { ProductCard } from "@/components/home/products/product-card";
import { ProductSlider } from "@/components/home/products/product-slider";
import { routes } from "@/config/routes";
import { getActiveCategories } from "@/lib/queries/categories";
import { getFeaturedProducts } from "@/lib/queries/product-selections";

export async function FeaturedProducts() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getActiveCategories(),
  ]);

  if (featuredProducts.length === 0) return null;

  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name_ar]),
  );

  return (
    <section
      id="featured-products"
      aria-labelledby="featured-products-title"
      className="section-space border-t border-border bg-background"
    >
      <div className="site-container">
        <div className="mb-8 grid gap-6 lg:mb-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
              <span
                aria-hidden="true"
                className="h-px w-8 shrink-0 bg-primary/70"
              />
              اختيارات الخولي
            </p>

            <h2
              id="featured-products-title"
              className="text-[clamp(1.875rem,3vw,2.75rem)] font-bold leading-[1.55] text-foreground"
            >
              تفاصيل تختارها،
              <span className="block text-primary">ومساحة تحبها.</span>
            </h2>
          </div>

          <div className="max-w-md lg:justify-self-end">
            <p className="text-sm leading-8 text-muted">
              اختيارات تجمع بين جمال التصميم وجودة التفاصيل. اكتشف ما يناسب
              مساحتك، وتعرّف على مواصفات كل منتج.
            </p>

            <Link
              href={routes.products}
              className="group mt-5 inline-flex min-h-11 items-center gap-4 rounded-full border border-border bg-surface px-5 text-xs font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
            >
              استكشف جميع المنتجات
              <FaArrowLeft
                aria-hidden="true"
                className="size-3 transition-transform duration-300 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>

        <ProductSlider>
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="w-[78%] shrink-0 snap-start sm:w-[calc((100%_-_2rem)/3)] lg:w-[calc((100%_-_3rem)/4)]"
            >
              <ProductCard
                product={product}
                categoryName={
                  categoryNames.get(product.category_id) ?? "منتجات الخولي"
                }
              />
            </div>
          ))}
        </ProductSlider>
      </div>
    </section>
  );
}
