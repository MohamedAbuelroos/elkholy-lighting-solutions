import { FaQuoteRight } from "react-icons/fa6";

import type { Testimonial } from "@/types/testimonial";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initial = Array.from(testimonial.name.trim())[0] ?? "خ";

  return (
    <figure className="group/review relative m-0 flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-primary/40 motion-reduce:transition-none sm:p-7">
      {/* Quote mark */}
      <div
        aria-hidden="true"
        className="mb-6 flex items-center justify-between gap-5"
      >
        <FaQuoteRight className="size-8 shrink-0 text-primary/35 transition-colors duration-300 group-hover/review:text-primary/65 motion-reduce:transition-none" />

        <span className="h-px w-12 bg-primary/25" />
      </div>

      {/* Review */}
      <blockquote className="m-0 flex-1">
        <p className="whitespace-pre-line break-words text-sm font-normal leading-[2.2] text-foreground">
          {testimonial.quote}
        </p>
      </blockquote>

      {/* Customer */}
      <figcaption className="mt-8 flex items-center gap-3 border-t border-border pt-5">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-base font-medium text-primary"
        >
          {initial}
        </span>

        <div className="min-w-0">
          <p className="break-words text-xs font-medium leading-6 text-foreground sm:text-sm">
            {testimonial.name}
          </p>

          {testimonial.context && (
            <p className="mt-0.5 break-words text-[11px] leading-6 text-muted">
              {testimonial.context}
            </p>
          )}
        </div>
      </figcaption>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover/review:opacity-100 motion-reduce:transition-none"
      />
    </figure>
  );
}
