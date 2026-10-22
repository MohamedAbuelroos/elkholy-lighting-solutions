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
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-medium text-primary sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              من واقع التجربة
            </p>

            <h2
              id="testimonials-title"
              className="text-4xl font-bold leading-[1.4] text-foreground sm:text-5xl"
            >
              آراء عملائنا，
              <span className="mt-1 block text-primary">بكلماتهم.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted">
            لكل اختيار تجربة، ولكل مساحة تفاصيل. هنا يشارك عملاؤنا آراءهم عن
            تجربتهم مع الخولي.
          </p>
        </div>

        <TestimonialsSlider>
          {visibleTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-[86%] shrink-0 snap-start sm:w-[calc((100%_-_1rem)/2)] lg:w-[calc((100%_-_2rem)/3)]"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </TestimonialsSlider>
      </div>
    </section>
  );
}
