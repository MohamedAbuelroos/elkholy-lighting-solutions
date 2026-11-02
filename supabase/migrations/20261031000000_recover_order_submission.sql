begin;

-- Recovery reads only: it must never create an order.
create function public.recover_customer_order_submission(
  p_idempotency_key uuid,
  p_tracking_code_hash text
)
returns table (
  order_id uuid,
  order_number text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_idempotency_key is null
    or p_tracking_code_hash is null
    or p_tracking_code_hash !~ '^[0-9a-f]{64}$'
  then
    return;
  end if;

  -- Same lock as create_customer_order: wait for a transaction
  -- already saving this submission before looking for its receipt.
  perform pg_advisory_xact_lock(
    hashtextextended(p_idempotency_key::text, 0)
  );

  return query
  select customer_order.id,
         customer_order.order_number::text,
         customer_order.created_at
  from public.orders as customer_order
  where customer_order.idempotency_key = p_idempotency_key
    and customer_order.tracking_code_hash = p_tracking_code_hash;
end;
$$;

revoke all privileges
on function public.recover_customer_order_submission(uuid, text)
from public, anon, authenticated;

grant execute
on function public.recover_customer_order_submission(uuid, text)
to service_role;

commit;
