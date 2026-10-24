import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";
import { routes } from "@/config/routes";

export function ContactHero() {
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
              تواصل معنا
            </li>
          </ol>
        </nav>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
              <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
              نسمع منك، ونفكّر معاك
            </p>

            <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.6] text-foreground">
              لكل مساحة بداية.
              <span className="block text-primary">خلّينا نبدأ بكلامك.</span>
            </h1>
          </div>

          <p className="max-w-md text-sm leading-8 text-muted lg:justify-self-end">
            عندك سؤال عن منتج، أو محتاج مساعدة في الاختيار؟ تواصل مع فريق
            الخولي، أو زور أحد معارضنا في دمنهور وشوف التفاصيل بنفسك.
          </p>
        </div>
      </div>
    </header>
  );
}
