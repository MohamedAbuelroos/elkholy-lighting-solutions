import {
  FaArrowUpRightFromSquare,
  FaClock,
  FaLocationDot,
} from "react-icons/fa6";

import { isWebUrl } from "@/components/links/contact-data";
import { company } from "@/data/company";

export function BusinessInfo() {
  return (
    <div className="mt-7">
      <section
        aria-labelledby="working-hours-title"
        className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface px-4 py-4 sm:px-5"
      >
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary"
        >
          <FaClock className="size-3.5" />
        </span>

        <div className="min-w-0">
          <h2
            id="working-hours-title"
            className="text-xs font-medium leading-6 text-foreground"
          >
            مواعيد استقبالكم
          </h2>

          <p className="mt-1 text-xs leading-7 text-muted">
            {company.workingHours.days}
            <br />
            {company.workingHours.hours}
          </p>
        </div>
      </section>

      {company.branches.length > 0 && (
        <section
          id="branches"
          aria-labelledby="branches-title"
          className="mt-7 scroll-mt-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-6 bg-primary/60" />

            <h2
              id="branches-title"
              className="text-sm font-medium text-foreground"
            >
              يسعدنا نشوفك في معارضنا
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {company.branches.map((branch, index) => (
              <article
                key={branch.name}
                className={`p-4 sm:p-5 ${
                  index > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary"
                  >
                    <FaLocationDot className="size-3.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium leading-7 text-foreground">
                      {branch.name}
                    </h3>

                    <p className="mt-1 text-xs leading-7 text-muted">
                      {branch.address}
                    </p>

                    {isWebUrl(branch.maps) && (
                      <a
                        href={branch.maps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-sm text-[11px] font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        الاتجاهات على الخريطة
                        <FaArrowUpRightFromSquare
                          aria-hidden="true"
                          className="size-2.5"
                        />
                        <span className="sr-only">يفتح في تبويب جديد</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
