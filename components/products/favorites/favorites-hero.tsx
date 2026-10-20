import Link from "next/link";
import { FaRegHeart } from "react-icons/fa6";

import { LightTrails } from "@/components/ui/light-trails";

export function FavoritesHero() {
  return (
    <header className="relative isolate overflow-hidden border-b border-border bg-surface">
      <LightTrails variant="arc" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent"
      />

      <div className="site-container relative z-10 py-8 sm:py-12">
        <nav aria-label="مسار التنقل" className="mb-7 text-xs text-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary">
                الرئيسية
              </Link>
            </li>

            <li aria-hidden="true">›</li>

            <li aria-current="page" className="text-primary">
              المفضلة
            </li>
          </ol>
        </nav>

        <div className="relative flex items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl">
            <p className="mb-3 flex items-center gap-3 text-sm font-medium text-primary">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              تفاصيل لفتت انتباهك
            </p>

            <h1 className="text-4xl font-bold leading-[1.4] text-foreground sm:text-5xl">
              اختيارات تحب
              <span className="mt-1 block text-primary">ترجع لها.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-muted">
              احتفظ بالمنتجات التي تعجبك وارجع لها بسهولة. اختياراتك محفوظة على
              هذا المتصفح.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none relative hidden size-44 shrink-0 items-center justify-center lg:flex"
          >
            <span className="absolute inset-0 rounded-full border border-primary/10" />
            <span className="absolute inset-5 rounded-full border border-primary/15" />

            <FaRegHeart className="size-20 -rotate-12 text-primary/25" />
          </div>
        </div>
      </div>
    </header>
  );
}
