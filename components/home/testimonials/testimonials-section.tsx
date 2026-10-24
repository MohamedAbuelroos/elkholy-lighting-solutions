import { TestimonialCard } from "@/components/home/testimonials/testimonial-card";
import { TestimonialsSlider } from "@/components/home/testimonials/testimonials-slider";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSection() {
  const visibleTestimonials = testimonials
    .filter((testimonial) => testimonial.is_active)
    .sort((first, second) => first.sort_order - second.sort_order)
    .slice(0, 5);

  if (visibleTestimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="section-space border-t border-border bg-background"
    >
      <div className="site-container">
        <div className="mb-8 grid gap-5 lg:mb-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
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
              التجربة معنا،
              <span className="block text-primary">يحكيها أصحابها.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-8 text-muted lg:justify-self-end">
            من أول سؤال إلى اختيار التفاصيل المناسبة، هذه بعض الكلمات التي
            شاركنا بها عملاؤنا عن تجربتهم مع الخولي.
          </p>
        </div>

        <TestimonialsSlider>
          {visibleTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex w-[86%] shrink-0 snap-start sm:w-[calc((100%_-_1rem)/2)] lg:w-[calc((100%_-_2rem)/3)]"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </TestimonialsSlider>
      </div>
    </section>
  );
}
