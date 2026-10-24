import Link from "next/link";
import { FaArrowLeft, FaImages } from "react-icons/fa6";

import { routes } from "@/config/routes";

export function ProjectsEmpty() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-12 text-center sm:py-16">
      <span
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div
        aria-hidden="true"
        className="relative mx-auto mb-7 flex size-24 items-center justify-center"
      >
        <span className="absolute inset-0 rotate-6 rounded-3xl border border-primary/15" />

        <span className="relative flex size-20 items-center justify-center rounded-3xl border border-primary/25 bg-background text-primary">
          <FaImages className="size-7" />
        </span>
      </div>

      <h3 className="text-xl font-medium leading-8 text-foreground sm:text-2xl">
        نجهّز لكم حكايات من أعمالنا.
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-8 text-muted">
        سنشارككم صور مشاريعنا هنا قريبًا. وفي الوقت الحالي، يسعد فريق الخولي
        بالتواصل معكم للتعرّف على احتياجاتكم.
      </p>

      <Link
        href={routes.contact}
        className="group mt-6 inline-flex min-h-12 items-center gap-4 rounded-full bg-primary px-6 text-xs font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        تحدث معنا عن مشروعك
        <FaArrowLeft
          aria-hidden="true"
          className="size-3 transition-transform duration-200 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
        />
      </Link>
    </div>
  );
}
