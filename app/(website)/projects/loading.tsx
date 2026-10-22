export default function ProjectsLoading() {
  return (
    <div
      role="status"
      aria-label="جارٍ تحميل المشاريع"
      className="bg-background pb-20 pt-28 lg:pt-32"
    >
      <div className="site-container">
        <div className="h-4 w-36 rounded bg-surface-elevated motion-safe:animate-pulse" />

        <div className="border-b border-border py-10">
          <div className="h-12 w-72 max-w-full rounded bg-surface-elevated motion-safe:animate-pulse" />
          <div className="mt-4 h-12 w-96 max-w-full rounded bg-surface-elevated motion-safe:animate-pulse" />
          <div className="mt-6 h-5 max-w-xl rounded bg-surface-elevated motion-safe:animate-pulse" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="aspect-[2.35/1] rounded-2xl bg-surface-elevated motion-safe:animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
