import { FaQuoteRight, FaStar } from "react-icons/fa6";

import type { Testimonial } from "@/types/testimonial";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initial = Array.from(testimonial.name.trim())[0] ?? "خ";

  return (
    <figure className="group/review relative m-0 flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-primary/35 motion-reduce:transition-none sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <span
          role="img"
          aria-label={`التقييم ${testimonial.rating} من 5 نجوم`}
          className="inline-flex items-center gap-1"
          dir="ltr"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              aria-hidden="true"
              className={`size-3.5 ${
                index < testimonial.rating ? "text-[#D6A744]" : "text-muted/25"
              }`}
            />
          ))}
        </span>

        <FaQuoteRight
          aria-hidden="true"
          className="size-7 text-primary/25 transition-colors group-hover/review:text-primary/50"
        />
      </div>

      <blockquote className="m-0 flex-1 py-7 sm:py-9">
        <p className="whitespace-pre-line break-words text-sm leading-8 text-foreground sm:text-base sm:leading-9">
          {testimonial.quote}
        </p>
      </blockquote>

      <figcaption className="flex items-center gap-3 border-t border-border pt-5">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-base font-semibold text-primary"
        >
          {initial}
        </span>

        <div className="min-w-0">
          <p className="break-words text-sm font-semibold leading-6 text-foreground">
            <bdi>{testimonial.name}</bdi>
          </p>

          {testimonial.context && (
            <p className="mt-1 text-[11px] leading-6 text-muted">
              {testimonial.context}
            </p>
          )}
        </div>
      </figcaption>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
    </figure>
  );
}
