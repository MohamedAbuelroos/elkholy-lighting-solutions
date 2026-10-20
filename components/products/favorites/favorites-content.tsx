"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { loadFavoriteProducts } from "@/app/(website)/favorites/actions";
import { ProductCard } from "@/components/home/products/product-card";
import { useFavorites } from "@/hooks/use-favorites";
import { FavoritesEmpty } from "@/components/products/favorites/favorites-empty";
import { FavoritesSkeleton } from "@/components/products/favorites/favorites-skeleton";

type FavoriteItems = Awaited<ReturnType<typeof loadFavoriteProducts>>;

type LoadedResult = {
  key: string;
  items: FavoriteItems;
  failed: boolean;
};

export function FavoritesContent() {
  const { favoriteIds } = useFavorites();

  const [result, setResult] = useState<LoadedResult>({
    key: "",
    items: [],
    failed: false,
  });

  const [retry, setRetry] = useState(0);
  const [, startTransition] = useTransition();

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

  if (!ready) {
    return <FavoritesSkeleton />;
  }

  if (result.failed) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
        <p role="alert" className="text-sm text-foreground">
          تعذّر تحميل المنتجات. جرّب مرة أخرى.
        </p>

        <button
          type="button"
          onClick={() => setRetry((previous) => previous + 1)}
          className="mt-5 min-h-11 rounded-control border border-primary/40 px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (result.items.length === 0) {
    return <FavoritesEmpty hasUnavailableProducts={favoriteIds.length > 0} />;
  }

  return (
    <section aria-labelledby="favorites-results-title">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <h2
            id="favorites-results-title"
            className="text-sm font-semibold text-foreground"
          >
            اختياراتك المحفوظة
          </h2>

          <span
            role="status"
            aria-label={`${result.items.length} منتج متاح في المفضلة`}
            className="inline-flex min-w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-primary"
          >
            {result.items.length}
          </span>
        </div>

        <Link
          href="/products"
          className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          متابعة التسوق
          <FaArrowLeft aria-hidden="true" className="size-3" />
        </Link>
      </div>

      {result.items.length < favoriteIds.length && (
        <p className="mb-5 rounded-control border border-border bg-surface px-4 py-3 text-xs leading-6 text-muted">
          بعض المنتجات المحفوظة لم تعد متاحة، لذلك لا تظهر هنا.
        </p>
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
