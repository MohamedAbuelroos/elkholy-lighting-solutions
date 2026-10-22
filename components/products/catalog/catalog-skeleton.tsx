export function CatalogSkeleton() {
  return (
    <div role="status" aria-label="جارٍ تحميل المنتجات">
      <span className="sr-only">جارٍ تحديث نتائج المنتجات…</span>

      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="h-5 w-28 rounded bg-surface-elevated" />
          <div className="h-10 w-44 rounded-control bg-surface-elevated" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="aspect-[3/2] bg-surface-elevated" />

              <div className="space-y-3 p-4">
                <div className="h-3 w-20 rounded bg-surface-elevated" />
                <div className="h-4 w-4/5 rounded bg-surface-elevated" />
                <div className="h-3 w-full rounded bg-surface-elevated" />
                <div className="h-3 w-2/3 rounded bg-surface-elevated" />

                <div className="flex justify-between border-t border-border pt-3">
                  <div className="h-5 w-16 rounded bg-surface-elevated" />
                  <div className="h-5 w-20 rounded bg-surface-elevated" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
