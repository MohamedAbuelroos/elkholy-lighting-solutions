import {
  FaArrowUpRightFromSquare,
  FaClock,
  FaLocationDot,
} from "react-icons/fa6";

import { isWebUrl } from "@/components/links/contact-data";
import { company } from "@/data/company";

export function ContactBranches() {
  return (
    <section
      id="branches"
      aria-labelledby="contact-branches-title"
      className="section-space scroll-mt-28 border-t border-border"
    >
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.3fr] lg:gap-14">
          {/* Visit introduction */}
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
              <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
              التفاصيل تستاهل تتشاف
            </p>

            <h2
              id="contact-branches-title"
              className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.65] text-foreground"
            >
              شوفها عن قرب.
              <span className="block text-primary">واختار على ذوقك.</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-8 text-muted">
              زور معارض الخولي في دمنهور، وتعرّف على المنتجات والخامات والتفاصيل
              بمساعدة فريقنا.
            </p>

            <div className="mt-7 flex items-start gap-3 border-t border-border pt-5">
              <FaClock
                aria-hidden="true"
                className="mt-1.5 size-4 shrink-0 text-primary"
              />

              <div>
                <h3 className="text-xs font-medium leading-7 text-foreground">
                  مواعيد العمل
                </h3>

                <p className="mt-1 text-xs leading-7 text-muted">
                  {company.workingHours.days}
                  <br />
                  {company.workingHours.hours}
                </p>
              </div>
            </div>
          </div>

          {/* Branch list */}
          <div className="space-y-4">
            {company.branches.map((branch, index) => (
              <article
                key={branch.name}
                className="rounded-3xl border border-border bg-surface p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary"
                  >
                    <FaLocationDot className="size-4" />
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-[10px] tabular-nums tracking-widest text-muted/60"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-medium leading-8 text-foreground">
                  {branch.name}
                </h3>

                <address className="mt-2 text-sm not-italic leading-8 text-muted">
                  {branch.address}
                </address>

                {isWebUrl(branch.maps) && (
                  <div className="mt-5 border-t border-border pt-4">
                    <a
                      href={branch.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-3 rounded-full border border-primary/30 px-5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      الاتجاهات على الخريطة
                      <FaArrowUpRightFromSquare
                        aria-hidden="true"
                        className="size-3"
                      />
                      <span className="sr-only">يفتح في تبويب جديد</span>
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
