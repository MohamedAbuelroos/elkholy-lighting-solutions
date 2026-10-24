import Link from "next/link";
import { FaChevronLeft, FaRegHeart } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";
import { routes } from "@/config/routes";

export function FavoritesHero() {
  return (
    <header className="relative isolate overflow-hidden border-b border-border bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
      >
        <LightTrails variant="arc" />
      </div>

      <div className="site-container py-8 sm:py-12">
        <nav aria-label="مسار التنقل" className="mb-7">
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
              المفضلة
            </li>
          </ol>
        </nav>

        <div className="flex items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-medium text-primary">
              <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
              على ذوقك
            </p>

            <h1 className="text-[clamp(1.875rem,3.5vw,3rem)] font-medium leading-[1.6] text-foreground">
              تفاصيل لفتت انتباهك،
              <span className="block text-primary">تستاهل ترجع لها.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-8 text-muted">
              اجمع اختياراتك في مكان واحد، وخُد وقتك في المقارنة. المفضلة محفوظة
              على هذا المتصفح.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="relative hidden size-40 shrink-0 items-center justify-center lg:flex"
          >
            <span className="absolute inset-0 rotate-12 rounded-[2rem] border border-primary/15" />

            <span className="absolute inset-3 -rotate-6 rounded-[1.75rem] border border-primary/20 bg-background" />

            <FaRegHeart className="relative size-12 text-primary/60" />
          </div>
        </div>
      </div>
    </header>
  );
}
