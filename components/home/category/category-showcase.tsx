import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaLayerGroup } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";
import { getCategoryPath, routes } from "@/config/routes";
import { getRootCategories } from "@/lib/queries/categories";

export async function CategoryShowcase() {
  const categories = await getRootCategories();

  if (categories.length === 0) return null;

  const visibleCategories = categories.slice(0, 5);
  const count = visibleCategories.length;
  const useMosaic = count === 3 || count === 5;

  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="section-space relative isolate overflow-hidden bg-background"
    >
      <div className="site-container">
        <div
          dir="ltr"
          className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.9fr)] lg:gap-10 xl:gap-16"
        >
          <div dir="rtl" className="relative isolate order-1 lg:order-2">
            <LightTrails variant="arc" className="hidden opacity-60 lg:block" />

            <div className="relative z-10 lg:py-8">
              <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
                <span
                  aria-hidden="true"
                  className="h-px w-8 shrink-0 bg-primary"
                />
                تفاصيل تصنع الفرق
              </p>

              <h2
                id="categories-title"
                className="text-3xl font-bold leading-[1.6] text-foreground sm:text-4xl xl:text-[42px]"
              >
                لكل مساحة،
                <span className="block text-primary">إضاءة تليق بها.</span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-8 text-muted">
                من الإضاءة إلى التشطيبات الكهربائية والحلول الذكية، اختيارات
                تجمع بين جمال التصميم وراحة الاستخدام.
              </p>

              <Link
                href={routes.products}
                className="group mt-6 inline-flex min-h-12 items-center gap-4 rounded-full border border-primary/35 bg-primary/5 px-5 py-3 text-xs font-medium text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                استكشف جميع الفئات
                <FaArrowLeft
                  aria-hidden="true"
                  className="size-3 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* صور الفئات */}
          <div
            dir="ltr"
            className="order-2 grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:order-1"
          >
            {visibleCategories.map((category, index) => {
              const isFeatured = index === 0 && (useMosaic || count === 1);

              const placementClass =
                count === 1
                  ? "col-span-2 min-h-[300px] sm:min-h-[360px]"
                  : isFeatured
                    ? "col-span-2 min-h-[280px] sm:min-h-[320px] lg:col-span-1 lg:row-span-2 lg:min-h-[360px]"
                    : count === 2
                      ? "min-h-[220px] sm:min-h-[280px] lg:min-h-[320px]"
                      : "min-h-[180px] sm:min-h-[200px] lg:min-h-[172px]";

              const imageSizes =
                count === 1
                  ? "(min-width: 1440px) 860px, (min-width: 1024px) 62vw, 100vw"
                  : isFeatured
                    ? "(min-width: 1440px) 420px, (min-width: 1024px) 30vw, 100vw"
                    : "(min-width: 1440px) 420px, (min-width: 1024px) 30vw, 50vw";

              return (
                <Link
                  key={category.id}
                  href={getCategoryPath(category.slug)}
                  aria-label={`استعرض منتجات ${category.name_ar}`}
                  className={`group relative isolate flex min-w-0 flex-col justify-end overflow-hidden rounded-2xl border border-border bg-[#11151C] transition-colors duration-300 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${placementClass}`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 overflow-hidden"
                  >
                    {category.image_path ? (
                      <Image
                        src={category.image_path}
                        alt=""
                        fill
                        sizes={imageSizes}
                        className="scale-[1.01] object-cover [backface-visibility:hidden] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.045]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
                        <FaLayerGroup className="size-16 text-white/10" />
                      </div>
                    )}
                  </div>

                  {/* طبقة ثابتة لتجنب رعشة الحواف أثناء الهوفر */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -inset-px [transform:translateZ(0)] ${
                      isFeatured
                        ? "bg-gradient-to-t from-black/90 via-black/25 to-black/5"
                        : "bg-gradient-to-t from-black/90 via-black/35 to-black/5"
                    }`}
                  />

                  <div
                    dir="rtl"
                    className={`relative z-10 ${
                      isFeatured ? "p-5 sm:p-6 lg:p-7" : "p-4 sm:p-5"
                    }`}
                  >
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        {isFeatured && (
                          <span
                            aria-hidden="true"
                            className="mb-4 block h-px w-8 bg-[#E2B858]/80"
                          />
                        )}

                        <h3
                          className={`break-words font-medium text-white transition-colors duration-300 group-hover:text-[#E2B858] ${
                            isFeatured
                              ? "text-2xl leading-[1.5] sm:text-3xl"
                              : "text-sm leading-7 sm:text-base"
                          }`}
                        >
                          {category.name_ar}
                        </h3>

                        {isFeatured && category.description_ar && (
                          <p className="mt-3 line-clamp-2 max-w-sm text-xs leading-7 text-white/75">
                            {category.description_ar}
                          </p>
                        )}
                      </div>

                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/10 text-white transition-colors duration-300 group-hover:border-[#D6A744] group-hover:bg-[#D6A744] group-hover:text-[#05070B]"
                      >
                        <FaArrowLeft className="size-3 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
