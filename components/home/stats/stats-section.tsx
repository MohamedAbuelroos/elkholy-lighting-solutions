import { statsConfig } from "@/data/stats";

const numberFormatter = new Intl.NumberFormat("en-US");

export function StatsSection() {
  return (
    <section
      aria-labelledby="stats-title"
      className="border-t border-border bg-background py-10 sm:py-14"
    >
      <div className="site-container">
        <h2 id="stats-title" className="sr-only">
          الخولي بالأرقام
        </h2>

        {!statsConfig.isVerified && (
          <p className="mb-6 text-center text-xs leading-6 text-muted">
            أرقام تجريبية لمعاينة التصميم، وليست إحصاءات معتمدة.
          </p>
        )}

        <dl className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
          {statsConfig.items.map((stat, index) => (
            <div
              key={stat.id}
              className={`flex flex-col items-center gap-3 px-4 text-center ${
                index % 2 === 1
                  ? "border-s border-border"
                  : index > 0
                    ? "md:border-s md:border-border"
                    : ""
              }`}
            >
              <dt className="order-2 text-sm font-medium text-muted">
                {stat.label}
              </dt>

              <dd className="order-1 text-3xl font-semibold leading-tight tracking-tight text-primary tabular-nums sm:text-4xl lg:text-5xl">
                <span dir="ltr" className="inline-block">
                  {numberFormatter.format(stat.value)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
