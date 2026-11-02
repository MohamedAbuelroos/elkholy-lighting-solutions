begin;

create function public.get_customer_order_tracking(
  p_tracking_code_hash text
)
returns table (
  order_number text,
  status text,
  fulfillment_method text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    customer_order.order_number::text,
    customer_order.status,
    customer_order.fulfillment_method,
    customer_order.created_at,
    customer_order.updated_at
  from public.orders as customer_order
  where p_tracking_code_hash ~ '^[0-9a-f]{64}$'
    and customer_order.tracking_code_hash = p_tracking_code_hash;
$$;

revoke all privileges
on function public.get_customer_order_tracking(text)
from public, anon, authenticated;

grant execute
on function public.get_customer_order_tracking(text)
to service_role;

commit;