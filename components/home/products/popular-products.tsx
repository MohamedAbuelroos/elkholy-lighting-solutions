import { PopularProductCard } from "@/components/home/products/popular-product-card";
import { getPopularProducts } from "@/lib/queries/product-selections";
import { getActiveCategories } from "@/lib/queries/categories";

export async function PopularProducts() {
  const [popularProducts, categories] = await Promise.all([
    getPopularProducts(),
    getActiveCategories(),
  ]);

  if (popularProducts.length === 0) return null;

  return (
    <section
      id="popular-products"
      aria-labelledby="popular-products-title"
      className="section-space border-t border-border bg-background"
    >
      <div className="site-container">
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-medium text-primary sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              اختيارات تستحق الاكتشاف
            </p>

            <h2
              id="popular-products-title"
              className="text-4xl font-bold leading-[1.4] text-foreground sm:text-5xl"
            >
              الأكثر <span className="text-primary">شيوعًا.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted">
            استكشف منتجاتنا الشائعة، وتعرّف على تفاصيل كل منتج لاختيار ما يناسب
            مساحتك.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {popularProducts.map((product) => {
            const category = categories.find(
              (item) => item.id === product.category_id,
            );

            return (
              <PopularProductCard
                key={product.id}
                product={product}
                categoryName={category?.name_ar ?? "منتجات الخولي"}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
