import Link from "next/link";
import { FaArrowLeft, FaRegHeart } from "react-icons/fa6";

type FavoritesEmptyProps = {
  hasUnavailableProducts: boolean;
};

export function FavoritesEmpty({
  hasUnavailableProducts,
}: FavoritesEmptyProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:py-20">
      <div
        aria-hidden="true"
        className="relative mx-auto mb-7 flex size-32 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full border border-primary/10" />
        <span className="absolute inset-3 rounded-full border border-primary/20" />

        <span className="flex size-20 items-center justify-center rounded-full bg-primary/10">
          <FaRegHeart className="size-8 text-primary" />
        </span>
      </div>

      <h2 className="text-xl font-semibold leading-8 text-foreground sm:text-2xl">
        {hasUnavailableProducts
          ? "منتجاتك المحفوظة غير متاحة حاليًا"
          : "اختياراتك المفضلة تبدأ من هنا"}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
        {hasUnavailableProducts
          ? "اختياراتك ما زالت محفوظة. يمكنك استكشاف المنتجات المتاحة وإضافة ما يعجبك."
          : "اضغط على القلب بجانب أي منتج يعجبك، وهتلاقيه هنا لما ترجع."}
      </p>

      <Link
        href="/products"
        className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-control bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
      >
        استكشف المنتجات
        <FaArrowLeft aria-hidden="true" className="size-3.5" />
      </Link>
    </div>
  );
}
