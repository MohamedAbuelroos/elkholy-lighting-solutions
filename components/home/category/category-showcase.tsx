import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

import { getRootCategories } from "@/lib/queries/categories";

export async function CategoryShowcase() {
  const categories = await getRootCategories();

  if (categories.length === 0) return null;

  const visibleCategories = categories.slice(0, 5);

  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="section-space relative isolate overflow-hidden bg-background"
    >
      <div className="site-container">
        <div
          dir="ltr"
          className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.9fr)] lg:gap-10 xl:gap-14"
        >
          {/* Left: One featured category + four small cards */}
          <div
            dir="ltr"
            className="order-2 grid grid-cols-2 gap-3 sm:gap-4 lg:order-1 lg:grid-cols-2 lg:grid-rows-2"
          >
            {visibleCategories.map((category, index) => {
              const isFeatured = index === 0;

              return (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  aria-label={`استعرض منتجات ${category.name_ar}`}
                  className={`group relative isolate flex min-h-0 flex-col justify-end overflow-hidden rounded-card border border-border/80 bg-surface transition-colors duration-300 hover:border-primary/60 ${
                    isFeatured
                      ? "col-span-2 min-h-[280px] sm:min-h-[340px] lg:col-span-1 lg:row-span-2 lg:min-h-[420px]"
                      : "min-h-[170px] sm:min-h-[200px] lg:min-h-0"
                  }`}
                >
                  {category.image_path && (
                    <Image
                      src={category.image_path}
                      alt=""
                      fill
                      sizes={
                        isFeatured
                          ? "(min-width: 1024px) 24vw, 100vw"
                          : "(min-width: 1024px) 16vw, 50vw"
                      }
                      className="-z-20 object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.06] motion-reduce:transition-none"
                    />
                  )}

                  {/* Consistent image contrast */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-black/45 via-45% to-black/10"
                  />

                  {/* Category content */}
                  <div
                    dir="rtl"
                    className={isFeatured ? "p-5 sm:p-6 lg:p-6" : "p-3 sm:p-4"}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      {category.name_en ? (
                        <span
                          dir="ltr"
                          className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#E2B858]/90"
                        >
                          {category.name_en}
                        </span>
                      ) : (
                        <span />
                      )}

                      <span className="text-[10px] tabular-nums text-white/55">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3
                      className={`font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#E2B858] ${
                        isFeatured
                          ? "text-xl sm:text-2xl lg:text-4xl"
                          : "text-base sm:text-lg"
                      }`}
                    >
                      {category.name_ar}
                    </h3>

                    {category.description_ar && (
                      <p
                        className={`mt-2 leading-6 text-white/70 ${
                          isFeatured
                            ? "max-w-sm text-xs sm:text-base"
                            : "line-clamp-2 text-[11px] sm:text-xs"
                        }`}
                      >
                        {category.description_ar}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
                      <span className="text-[10px] text-white/70 sm:text-xs">
                        اكتشف الفئة
                      </span>

                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-300 group-hover:border-[#D6A744] group-hover:bg-[#D6A744] group-hover:text-[#05070B]">
                        <FaArrowLeft aria-hidden="true" className="size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right: Section heading, description and CTA */}
          <div
            dir="rtl"
            className="relative order-1 flex flex-col items-start lg:order-2 lg:min-h-[380px] lg:justify-center"
          >
            <p className="mb-4 flex items-center gap-3 text-xs font-medium tracking-wide text-primary sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              تفاصيل تصنع الفرق
            </p>

            <h2
              id="categories-title"
              className="text-3xl font-bold leading-[1.45] tracking-tight text-foreground sm:text-4xl xl:text-[42px]"
            >
              لكل مساحة،
              <span className="block text-primary">إضاءة تليق بها.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted sm:text-base">
              من وحدات الإضاءة الراقية إلى الأنظمة الذكية والتشطيبات الكهربائية،
              اكتشف حلولًا تجمع بين جمال التصميم وتفاصيل تناسب مساحتك.
            </p>

            <Link
              href="/products"
              className="group mt-7 inline-flex min-h-11 items-center gap-3 rounded-full border border-primary/50 px-5 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-[#05070B]"
            >
              جميع الفئات
              <FaArrowLeft
                aria-hidden="true"
                className="size-3 transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>

            {/* Decorative golden light trails */}
            <svg
              aria-hidden="true"
              viewBox="0 0 440 230"
              fill="none"
              className="pointer-events-none absolute -bottom-20 -right-24 -z-10 hidden h-[230px] w-[440px] max-w-none opacity-70 lg:block"
            >
              <defs>
                <linearGradient
                  id="category-light-trail"
                  x1="20"
                  y1="180"
                  x2="410"
                  y2="35"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#D6A744" stopOpacity="0" />
                  <stop offset=".45" stopColor="#D6A744" stopOpacity=".32" />
                  <stop offset=".78" stopColor="#E6BD65" stopOpacity=".9" />
                  <stop offset="1" stopColor="#D6A744" stopOpacity="0" />
                </linearGradient>

                <filter
                  id="category-light-glow"
                  x="-20%"
                  y="-50%"
                  width="140%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>

              <path
                d="M-10 205 C100 205 132 155 220 130 S350 105 450 15"
                stroke="url(#category-light-trail)"
                strokeWidth="7"
                filter="url(#category-light-glow)"
                opacity=".45"
              />

              <path
                d="M-10 205 C100 205 132 155 220 130 S350 105 450 15"
                stroke="url(#category-light-trail)"
                strokeWidth="1.4"
              />

              <path
                d="M-20 225 C90 225 165 183 250 160 S370 125 460 55"
                stroke="url(#category-light-trail)"
                strokeWidth="1"
                opacity=".6"
              />

              <path
                d="M75 235 C165 200 205 195 280 170 S390 145 455 105"
                stroke="url(#category-light-trail)"
                strokeWidth=".8"
                opacity=".35"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
