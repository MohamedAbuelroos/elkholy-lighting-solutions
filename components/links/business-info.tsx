import {
  FaArrowUpRightFromSquare,
  FaClock,
  FaLocationDot,
} from "react-icons/fa6";

import { company } from "@/data/company";
import { isWebUrl } from "@/components/links/contact-data";

export function BusinessInfo() {
  return (
    <div className="mt-7 space-y-7">
      <section
        aria-labelledby="working-hours-title"
        className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FaClock aria-hidden="true" className="size-4" />
        </span>

        <div>
          <h2
            id="working-hours-title"
            className="text-sm font-semibold text-foreground"
          >
            مواعيد العمل
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted">
            {company.workingHours.days}
            <br />
            {company.workingHours.hours}
          </p>
        </div>
      </section>

      <section
        id="branches"
        aria-labelledby="branches-title"
        className="scroll-mt-6"
      >
        <div className="mb-4">
          <p className="text-xs text-primary">يسعدنا استقبالكم</p>

          <h2
            id="branches-title"
            className="mt-2 text-xl font-semibold text-foreground"
          >
            زور معارضنا
          </h2>
        </div>

        <div className="space-y-3">
          {company.branches.map((branch) => (
            <article
              key={branch.name}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FaLocationDot aria-hidden="true" className="size-4" />
                </span>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {branch.name}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-muted">
                    {branch.address}
                  </p>
                </div>
              </div>

              {isWebUrl(branch.maps) && (
                <a
                  href={branch.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-control border border-primary/30 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  الاتجاهات على الخريطة
                  <FaArrowUpRightFromSquare
                    aria-hidden="true"
                    className="size-3"
                  />
                  <span className="sr-only">يفتح في تبويب جديد</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
