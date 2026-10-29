"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  FaArrowLeft,
  FaArrowRotateRight,
  FaCircleExclamation,
} from "react-icons/fa6";

import { loadFavoriteProducts } from "@/app/(website)/favorites/actions";
import { ProductCard } from "@/components/home/products/product-card";
import { FavoritesEmpty } from "@/components/products/favorites/favorites-empty";
import { FavoritesSkeleton } from "@/components/products/favorites/favorites-skeleton";
import { routes } from "@/config/routes";
import { useFavorites } from "@/hooks/use-favorites";
import { removeFavorites } from "@/lib/favorites/store";

type FavoriteItems = Awaited<ReturnType<typeof loadFavoriteProducts>>;

type LoadedResult = {
  key: string;
  items: FavoriteItems;
  failed: boolean;
};

const countFormatter = new Intl.NumberFormat("ar-EG");

export function FavoritesContent() {
  const { favoriteIds } = useFavorites();

  const [result, setResult] = useState<LoadedResult>({
    key: "",
    items: [],
    failed: false,
  });

  const [retry, setRetry] = useState(0);
  const [isPending, startTransition] = useTransition();

  const idsKey = JSON.stringify(favoriteIds);

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      try {
        const ids = JSON.parse(idsKey) as string[];

        const items = ids.length > 0 ? await loadFavoriteProducts(ids) : [];

        if (!cancelled) {
          setResult({
            key: idsKey,
            items,
            failed: false,
          });
        }
      } catch {
        if (!cancelled) {
          setResult({
            key: idsKey,
            items: [],
            failed: true,
          });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [idsKey, retry]);

  const ready = result.key === idsKey;

  if (!ready || isPending) {
    return <FavoritesSkeleton />;
  }

  if (result.failed) {
    return (
      <section
        aria-labelledby="favorites-error-title"
        className="rounded-3xl border border-border bg-surface px-6 py-12 text-center sm:py-16"
      >
        <FaCircleExclamation
          aria-hidden="true"
          className="mx-auto mb-5 size-7 text-primary"
        />

        <h2
          id="favorites-error-title"
          className="text-lg font-medium text-foreground"
        >
          تعذّر تحميل اختياراتك
        </h2>

        <p role="alert" className="mt-3 text-sm leading-7 text-muted">
          حصلت مشكلة أثناء التحميل. جرّب مرة أخرى.
        </p>

        <button
          type="button"
          onClick={() => setRetry((previous) => previous + 1)}
          className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-full border border-primary/40 px-5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <FaArrowRotateRight aria-hidden="true" className="size-3" />
          إعادة المحاولة
        </button>
      </section>
    );
  }

  const availableIds = new Set(result.items.map(({ product }) => product.id));

  const unavailableIds = favoriteIds.filter((id) => !availableIds.has(id));

  const unavailableCount = unavailableIds.length;

  const cleanupButton =
    unavailableCount > 0 ? (
      <button
        type="button"
        onClick={() => removeFavorites(unavailableIds)}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        إزالة الاختيارات غير المتاحة
      </button>
    ) : null;

  if (result.items.length === 0) {
    return (
      <div>
        <FavoritesEmpty hasUnavailableProducts={unavailableCount > 0} />

        {cleanupButton && (
          <div className="mt-4 flex justify-center">{cleanupButton}</div>
        )}
      </div>
    );
  }

  return (
    <section aria-labelledby="favorites-results-title">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <h2
            id="favorites-results-title"
            className="text-base font-medium text-foreground"
          >
            اختياراتك المحفوظة
          </h2>

          <span
            role="status"
            aria-label={`${result.items.length} منتج متاح في المفضلة`}
            className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-2 text-[11px] font-medium tabular-nums text-primary"
          >
            {countFormatter.format(result.items.length)}
          </span>
        </div>

        <Link
          href={routes.products}
          className="group inline-flex min-h-10 items-center gap-3 rounded-full border border-border bg-surface px-4 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          متابعة الاستكشاف
          <FaArrowLeft
            aria-hidden="true"
            className="size-3 transition-transform duration-200 motion-safe:group-hover:-translate-x-1 motion-reduce:transition-none"
          />
        </Link>
      </div>

      {unavailableCount > 0 && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-xs leading-7 text-muted">
            <FaCircleExclamation
              aria-hidden="true"
              className="mt-2 size-3 shrink-0 text-primary"
            />

            <span>
              بعض المنتجات المحفوظة غير متاحة حاليًا. يمكنك إزالة هذه الاختيارات
              أو الاحتفاظ بها لوقت لاحق.
            </span>
          </p>

          {cleanupButton}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {result.items.map(({ product, categoryName }) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryName={categoryName}
          />
        ))}
      </div>
    </section>
  );
}
