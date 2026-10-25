import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

import { CatalogHeroImage } from "@/components/products/catalog/catalog-hero-image";
import { routes } from "@/config/routes";
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
      <CatalogHeroImage src={heroImage} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_left,rgba(5,7,11,0.94)_0%,rgba(5,7,11,0.78)_48%,rgba(5,7,11,0.32)_100%)] lg:bg-[linear-gradient(to_left,rgba(5,7,11,0.94)_0%,rgba(5,7,11,0.74)_38%,rgba(5,7,11,0.24)_76%,rgba(5,7,11,0.18)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2B858]/30 to-transparent"
      />

      <div className="site-container flex min-h-[310px] items-center py-10 sm:min-h-[350px] sm:py-12">
        <div className="w-full max-w-2xl">
          <nav aria-label="مسار التنقل" className="mb-7">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] leading-6 text-white/60 sm:text-xs">
              <li>
                <Link
                  href={routes.home}
                  className="transition-colors hover:text-[#E2B858]"
                >
                  الرئيسية
                </Link>
              </li>

              <li aria-hidden="true">
                <FaChevronLeft className="size-2 text-white/35" />
              </li>

              <li>
                <Link
                  href={routes.products}
                  scroll={false}
                  aria-current={!selectedCategoryName ? "page" : undefined}
                  className={`transition-colors hover:text-[#E2B858] ${
                    !selectedCategoryName ? "text-[#E2B858]" : ""
                  }`}
                >
                  المنتجات
                </Link>
              </li>

              {selectedCategoryName && (
                <>
                  <li aria-hidden="true">
                    <FaChevronLeft className="size-2 text-white/35" />
                  </li>

                  <li aria-current="page" className="text-[#E2B858]">
                    {selectedCategoryName}
                  </li>
                </>
              )}
            </ol>
          </nav>

          <div key={transitionKey} className="catalog-enter">
            <div
              aria-hidden="true"
              className="mb-4 h-px w-12 bg-[#E2B858]/70"
            />

            <h1
              id="catalog-title"
              className="max-w-xl text-[clamp(1.75rem,3.5vw,3rem)] font-medium leading-[1.6] text-white"
            >
              {title}
            </h1>

            <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-8 text-white/70">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
