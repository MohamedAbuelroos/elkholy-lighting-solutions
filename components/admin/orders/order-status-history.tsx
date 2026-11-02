import type { OrderStatusHistoryEvent } from "@/lib/admin/queries/order-context";
import { getOrderStatusLabel } from "@/lib/orders/status";

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Cairo",
});

export function OrderStatusHistory({
  events,
}: {
  events: OrderStatusHistoryEvent[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-lg font-medium">سجل حالات الطلب</h2>
      <p className="mt-2 text-xs leading-7 text-muted">
        الأسباب داخلية للإدارة، ولا تظهر في صفحة تتبع العميل. نعرض أحدث 100 تغيير.
      </p>

      {events.length === 0 ? (
        <p className="mt-5 text-sm leading-7 text-muted">
          لا توجد تغييرات مسجّلة بعد.
        </p>
      ) : (
        <ol className="mt-5 divide-y divide-border">
          {events.map((event) => (
            <li key={event.id} className="py-4">
              <p className="text-sm font-medium leading-7 text-foreground">
                {getOrderStatusLabel(event.previous_status)}
                <span className="mx-2 text-muted">←</span>
                {getOrderStatusLabel(event.new_status)}
              </p>

              <time
                dateTime={event.created_at}
                className="mt-1 block text-[11px] leading-6 text-muted"
              >
                {dateFormatter.format(new Date(event.created_at))}
              </time>

              {event.reason && (
                <p className="mt-3 whitespace-pre-line break-words rounded-xl border border-border bg-background p-3 text-xs leading-8 text-foreground">
                  {event.reason}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
