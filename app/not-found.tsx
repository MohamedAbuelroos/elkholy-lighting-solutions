import Link from "next/link";
import { FaArrowRight, FaMagnifyingGlass } from "react-icons/fa6";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-background px-5 py-16 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative max-w-lg text-center">
        <p
          dir="ltr"
          aria-hidden="true"
          className="text-[clamp(7rem,25vw,12rem)] font-semibold leading-none tracking-tight text-primary/20"
        >
          404
        </p>

        <p className="mt-5 text-xs font-medium text-primary">
          يبدو أنك وصلت لمكان مختلف
        </p>

        <h1 className="mt-3 text-2xl font-semibold leading-[1.5] sm:text-3xl">
          الصفحة غير موجودة.
        </h1>

        <p className="mt-4 text-sm leading-7 text-muted">
          قد يكون الرابط غير صحيح أو الصفحة لم تعد متاحة. يمكنك العودة للرئيسية
          أو استكشاف منتجات الخولي.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <FaArrowRight aria-hidden="true" className="size-3.5" />
            العودة للرئيسية
          </Link>

          <Link
            href="/products"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-border bg-surface px-6 py-3 text-sm font-medium transition-colors hover:border-primary/50"
          >
            <FaMagnifyingGlass
              aria-hidden="true"
              className="size-3.5 text-primary"
            />
            استكشف المنتجات
          </Link>
        </div>

        <p dir="ltr" className="mt-12 text-[9px] tracking-[0.2em] text-muted">
          ELKHOLY LIGHTING SOLUTIONS
        </p>
      </div>
    </main>
  );
}
