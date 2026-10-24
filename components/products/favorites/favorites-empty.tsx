import Link from "next/link";
import { FaArrowLeft, FaRegHeart } from "react-icons/fa6";

import { routes } from "@/config/routes";

type FavoritesEmptyProps = {
  hasUnavailableProducts: boolean;
};

export function FavoritesEmpty({
  hasUnavailableProducts,
}: FavoritesEmptyProps) {
  return (
    <section
      aria-labelledby="favorites-empty-title"
      className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-12 text-center sm:py-16"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div
        aria-hidden="true"
        className="relative mx-auto mb-8 flex size-24 items-center justify-center"
      >
        <span className="absolute inset-0 rotate-12 rounded-3xl border border-primary/15" />

        <span className="relative flex size-20 items-center justify-center rounded-3xl border border-primary/25 bg-background">
          <FaRegHeart className="size-7 text-primary" />
        </span>
      </div>

      <p className="mb-3 text-[11px] font-medium text-primary">
        مساحة لاختياراتك
      </p>

      <h2
        id="favorites-empty-title"
        className="text-xl font-medium leading-[1.7] text-foreground sm:text-2xl"
      >
        {hasUnavailableProducts
          ? "اختياراتك غير متاحة حاليًا"
          : "أول اختيار، بداية الحكاية."}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-8 text-muted">
        {hasUnavailableProducts
          ? "المنتجات المحفوظة لا تظهر في الكتالوج حاليًا. يمكنك اكتشاف الخيارات المتاحة وإضافة ما يعجبك."
          : "وأنت بتستكشف المنتجات، اضغط على القلب لحفظ التفاصيل اللي عجبتك. هتلاقيها هنا لما ترجع."}
      </p>

      <Link
        href={routes.products}
        className="group mt-7 inline-flex min-h-12 items-center justify-center gap-5 rounded-full bg-primary px-6 text-xs font-medium text-on-primary transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
      >
        استكشف المنتجات
        <FaArrowLeft
          aria-hidden="true"
          className="size-3 transition-transform duration-300 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
        />
      </Link>
    </section>
  );
}
