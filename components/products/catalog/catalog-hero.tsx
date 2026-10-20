import Link from "next/link";
import { CatalogHeroImage } from "@/components/products/catalog/catalog-hero-image";

import { siteConfig } from "@/config/site";

type CatalogHeroProps = {
  title: string;
  description: string;
  transitionKey: string;
  selectedCategoryName?: string;
  imageSrc?: string;
};

export function CatalogHero({
  title,
  description,
  transitionKey,
  selectedCategoryName,
  imageSrc,
}: CatalogHeroProps) {
  const heroImage = imageSrc || siteConfig.hero.src;

  return (
    <section
      aria-labelledby="catalog-title"
      className="relative isolate overflow-hidden bg-[#05070B] text-white"
    >
      <CatalogHeroImage key={heroImage} src={heroImage} />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_left,rgba(5,7,11,0.94),rgba(5,7,11,0.72)_55%,rgba(5,7,11,0.25))]"
      />

      <div className="site-container flex min-h-[280px] items-center py-12 sm:min-h-[320px]">
        <div className="max-w-xl">
          <nav aria-label="مسار التنقل" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs leading-6 text-white/70">
              <li>
                <Link href="/" className="hover:text-[#E2B858]">
                  الرئيسية
                </Link>
              </li>

              <li aria-hidden="true">›</li>

              <li>
                <Link
                  href="/products"
                  scroll={false}
                  aria-current={!selectedCategoryName ? "page" : undefined}
                  className="hover:text-[#E2B858]"
                >
                  المنتجات
                </Link>
              </li>

              {selectedCategoryName && (
                <>
                  <li aria-hidden="true">›</li>

                  <li aria-current="page" className="text-[#E2B858]">
                    {selectedCategoryName}
                  </li>
                </>
              )}
            </ol>
          </nav>

          <div key={transitionKey} className="catalog-enter">
            <h1
              id="catalog-title"
              className="text-3xl font-semibold leading-[1.4] sm:text-4xl lg:text-5xl"
            >
              {title}
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-8 text-white/80">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
