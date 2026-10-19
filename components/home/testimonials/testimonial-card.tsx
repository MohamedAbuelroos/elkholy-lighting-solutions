import { FaQuoteRight } from "react-icons/fa6";

import type { Testimonial } from "@/types/testimonial";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 lg:p-7">
      <div className="mb-6 flex items-center gap-4">
        <FaQuoteRight
          aria-hidden="true"
          className="size-7 shrink-0 text-primary/70"
        />

        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      <blockquote className="flex-1">
        <p className="text-sm leading-8 text-foreground">{testimonial.quote}</p>
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3 border-t border-border pt-5">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-lg font-medium text-primary"
        >
          {Array.from(testimonial.name.trim())[0] ?? "خ"}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            {testimonial.context}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
