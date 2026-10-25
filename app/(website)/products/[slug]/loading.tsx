export default function ProductLoading() {
  return (
    <div
      role="status"
      aria-label="جارٍ تحميل تفاصيل المنتج"
      className="bg-background pb-20 pt-28 lg:pt-32"
    >
      <div className="site-container">
        <div className="mb-10 h-4 w-64 max-w-full rounded bg-surface-elevated motion-safe:animate-pulse" />

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-20">
          <div>
            <div className="aspect-[4/3] rounded-card bg-surface-elevated motion-safe:animate-pulse" />

            <div className="mt-4 flex gap-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="size-16 rounded-xl bg-surface-elevated motion-safe:animate-pulse sm:size-20"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-8 w-28 rounded-full bg-surface-elevated motion-safe:animate-pulse" />
            <div className="h-12 w-full rounded bg-surface-elevated motion-safe:animate-pulse" />
            <div className="h-5 w-36 rounded bg-surface-elevated motion-safe:animate-pulse" />
            <div className="h-px bg-border" />
            <div className="h-10 w-44 rounded bg-surface-elevated motion-safe:animate-pulse" />
            <div className="h-14 rounded-full bg-surface-elevated motion-safe:animate-pulse" />

            <div className="space-y-3 pt-5">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-4 rounded bg-surface-elevated motion-safe:animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
