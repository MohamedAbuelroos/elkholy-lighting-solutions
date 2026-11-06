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
          className="grid items-center gap-9 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10 xl:gap-16"
        >
          {/* Introduction */}
          <div
            dir="rtl"
            className="relative isolate order-1 min-w-0 lg:order-2"
          >
            <LightTrails
              variant="arc"
              className="pointer-events-none hidden opacity-35 lg:block"
            />

            <div className="relative z-10">
              <p className="mb-5 flex items-center gap-3 text-[11px] font-medium text-primary">
                <span
                  aria-hidden="true"
                  className="h-px w-9 shrink-0 bg-primary/70"
                />
                اختيارات لكل تفاصيل المكان
              </p>

              <h2
                id="categories-title"
                className="text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.5] text-foreground"
              >
                يبدأ الجمال
                <span className="block">من التفاصيل،</span>
                <span className="block text-primary">وتبدأ اختياراتك هنا.</span>
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-8 text-muted">
                إضاءة ترسم أجواء المكان، وتشطيبات تكمل ملامحه، وحلول ذكية تجعل
                يومك أسهل. استكشف ما يناسب مساحتك.
              </p>

              <Link
                href={routes.products}
                className="group mt-7 inline-flex min-h-12 items-center gap-5 rounded-full border border-primary/30 bg-primary/5 py-2 pe-2 ps-5 text-xs font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                استكشف جميع الفئات
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-full bg-primary text-on-primary"
                >
                  <FaArrowLeft className="size-3 motion-safe:transition-transform motion-safe:group-hover:-translate-x-0.5" />
                </span>
              </Link>

              <div
                aria-hidden="true"
                className="mt-8 hidden items-center gap-4 lg:flex"
              >
                <span className="h-px w-16 bg-border" />
                <span className="text-[9px] tracking-[0.25em] text-muted/60">
                  THE ELKHOLY COLLECTION
                </span>
              </div>
            </div>
          </div>

          {/* Category gallery */}
          <div className="relative order-2 min-w-0 lg:order-1">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 hidden rounded-[2rem] border border-primary/10 sm:block"
            />

            <div
              dir="ltr"
              className={`grid min-w-0 grid-cols-2 gap-3 sm:gap-4 ${
                useMosaic ? "lg:auto-rows-[190px] xl:auto-rows-[210px]" : ""
              }`}
            >
              {visibleCategories.map((category, index) => {
                const isFeatured = index === 0 && (useMosaic || count === 1);

                const placementClass =
                  count === 1
                    ? "col-span-2 min-h-[320px] sm:min-h-[420px]"
                    : isFeatured
                      ? "col-span-2 min-h-[290px] sm:min-h-[340px] lg:col-span-1 lg:row-span-2 lg:min-h-0"
                      : count === 2
                        ? "min-h-[260px] sm:min-h-[340px]"
                        : "min-h-[200px] sm:min-h-[220px] lg:min-h-[190px]";

                const imageSizes =
                  count === 1
                    ? "(min-width: 1280px) 800px, (min-width: 1024px) 60vw, 100vw"
                    : isFeatured
                      ? "(min-width: 1280px) 400px, (min-width: 1024px) 30vw, 100vw"
                      : "(min-width: 1280px) 400px, (min-width: 1024px) 30vw, 50vw";

                return (
                  <Link
                    key={category.id}
                    href={getCategoryPath(category.slug)}
                    aria-label={`استعرض منتجات ${category.name_ar}`}
                    className={`group relative isolate flex min-w-0 flex-col justify-between overflow-hidden rounded-[1.25rem] border border-border bg-[#15171C] transition-colors duration-300 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none ${placementClass}`}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 -z-20 overflow-hidden"
                    >
                      {category.image_path ? (
                        <Image
                          src={category.image_path}
                          alt=""
                          fill
                          sizes={imageSizes}
                          className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.045] motion-safe:group-focus-visible:scale-[1.045]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 to-transparent">
                          <FaLayerGroup className="size-14 text-white/15" />
                        </div>
                      )}
                    </div>

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#05070B]/95 via-[#05070B]/10 to-[#05070B]/25"
                    />

                    <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
                      <span
                        aria-hidden="true"
                        className="font-serif text-2xl leading-none text-white/70 sm:text-3xl"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-px w-6 bg-white/40"
                      />
                    </div>

                    <div
                      dir="rtl"
                      className={isFeatured ? "p-5 sm:p-6" : "p-4 sm:p-5"}
                    >
                      {isFeatured && (
                        <p className="mb-2 text-[10px] font-medium leading-5 text-[#E8CC91]">
                          اكتشف المجموعة
                        </p>
                      )}

                      <div className="flex items-end justify-between gap-3">
                        <h3
                          className={`min-w-0 break-words font-semibold text-white ${
                            isFeatured
                              ? "text-2xl leading-9 sm:text-3xl sm:leading-10"
                              : "text-sm leading-7 sm:text-base"
                          }`}
                        >
                          {category.name_ar}
                        </h3>

                        <span
                          aria-hidden="true"
                          className="mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white transition-colors duration-300 group-hover:border-[#D6A744] group-hover:bg-[#D6A744] group-hover:text-[#05070B] group-focus-visible:border-[#D6A744] group-focus-visible:bg-[#D6A744] group-focus-visible:text-[#05070B]"
                        >
                          <FaArrowLeft className="size-3 motion-safe:transition-transform motion-safe:group-hover:-translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
