import Link from "next/link";
import { FaChevronLeft, FaImages } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";
import { routes } from "@/config/routes";

export function ProjectsHero() {
  return (
    <header className="relative isolate overflow-hidden border-b border-border bg-surface pb-10 pt-28 sm:pb-12 lg:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
      >
        <LightTrails variant="arc" />
      </div>

      <div className="site-container">
        <nav aria-label="مسار التنقل" className="mb-8">
          <ol className="flex items-center gap-3 text-xs leading-6 text-muted">
            <li>
              <Link
                href={routes.home}
                className="transition-colors hover:text-primary"
              >
                الرئيسية
              </Link>
            </li>

            <li aria-hidden="true">
              <FaChevronLeft className="size-2" />
            </li>

            <li aria-current="page" className="text-primary">
              مشاريعنا
            </li>
          </ol>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
              <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
              من اختياراتنا إلى مساحاتكم
            </p>

            <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.6] text-foreground">
              لكل مكان حكاية،
              <span className="block text-primary">ترويها التفاصيل.</span>
            </h1>
          </div>

          <div className="max-w-md lg:justify-self-end">
            <p className="text-sm leading-8 text-muted">
              اكتشف مجموعة من مشاريع الخولي، وشاهد كيف تتكامل الإضاءة والتشطيبات
              مع طابع كل مساحة.
            </p>

            <p className="mt-4 flex items-center gap-2.5 text-[11px] leading-6 text-muted">
              <FaImages
                aria-hidden="true"
                className="size-3.5 shrink-0 text-primary"
              />
              افتح أي مشروع لتشاهد معرض صوره.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
