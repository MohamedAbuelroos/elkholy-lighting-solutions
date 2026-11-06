import { FaArrowUpRightFromSquare, FaPen, FaStar } from "react-icons/fa6";

import { TestimonialCard } from "@/components/home/testimonials/testimonial-card";
import { TestimonialsSlider } from "@/components/home/testimonials/testimonials-slider";
import { testimonials, testimonialsConfig } from "@/data/testimonials";

export function TestimonialsSection() {
  const visibleTestimonials = testimonials
    .filter((testimonial) => testimonial.is_active)
    .sort((first, second) => first.sort_order - second.sort_order)
    .slice(0, 5);

  const { rating, reviewCount, mapsUrl, writeReviewUrl } = testimonialsConfig;

  const ratingPercentage = Math.min(100, Math.max(0, (rating / 5) * 100));

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="section-space overflow-hidden border-t border-border bg-background"
    >
      <div className="site-container">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
            <span
              aria-hidden="true"
              className="h-px w-8 shrink-0 bg-primary/70"
            />
            من واقع التجربة
          </p>

          <h2
            id="testimonials-title"
            className="text-[clamp(1.875rem,3vw,2.75rem)] font-bold leading-[1.55] text-foreground"
          >
            اختيارات تنوّر المكان،
            <span className="block text-primary">وتجارب تستحق المشاركة.</span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-8 text-muted">
            تعرّف على بعض آراء زوّار المعرض، ولو جرّبت التعامل معنا، يسعدنا نسمع
            تجربتك.
          </p>
        </div>

        <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-7">
          <aside
            aria-label="ملخص تقييم المعرض على Google"
            className="relative min-w-0 overflow-hidden rounded-3xl border border-primary/20 bg-surface p-6 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
            />

            <p className="text-xs font-medium text-muted">
              تقييم المعرض على Google
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span
                dir="ltr"
                className="text-6xl font-semibold leading-none tracking-tight tabular-nums text-foreground"
              >
                {rating.toFixed(1)}
              </span>

              <span className="text-sm text-muted">من 5</span>
            </div>

            <div className="mt-4">
              <span
                role="img"
                aria-label={`التقييم ${rating} من 5 نجوم`}
                dir="ltr"
                className="relative inline-flex align-middle"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex gap-1 text-muted/25"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar key={index} className="size-4" />
                  ))}
                </span>

                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 overflow-hidden text-[#D6A744]"
                  style={{ width: `${ratingPercentage}%` }}
                >
                  <span className="inline-flex w-max gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <FaStar key={index} className="size-4 shrink-0" />
                    ))}
                  </span>
                </span>
              </span>
            </div>

            <p className="mt-3 text-xs leading-7 text-muted">
              بناءً على {reviewCount} تقييمًا على Google Maps
            </p>

            <div className="mt-7 space-y-3 border-t border-border pt-6">
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-5 py-3 text-xs font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <FaPen aria-hidden="true" className="size-3" />
                أضف تقييمك على Google
                <span className="sr-only">يفتح في تبويب جديد</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-xs text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                شاهد جميع المراجعات
                <FaArrowUpRightFromSquare
                  aria-hidden="true"
                  className="size-3"
                />
                <span className="sr-only">يفتح في تبويب جديد</span>
              </a>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
              <p className="text-xs font-medium text-foreground">
                من مراجعات زوّار المعرض
              </p>

              <span className="text-[10px] text-muted">
                مراجعات مختارة · ليست جميع التقييمات
              </span>
            </div>

            {visibleTestimonials.length === 1 ? (
              <TestimonialCard testimonial={visibleTestimonials[0]} />
            ) : visibleTestimonials.length > 1 ? (
              <TestimonialsSlider>
                {visibleTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex w-[90%] shrink-0 snap-start sm:w-[calc((100%_-_1rem)/2)]"
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </TestimonialsSlider>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
                <p className="text-sm leading-8 text-muted">
                  يمكنك الاطلاع على مراجعات المعرض مباشرة على Google.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
