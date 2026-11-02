begin;

alter table public.order_status_events
  add column reason text not null default '';

alter table public.order_status_events
  add constraint order_status_events_reason_length
  check (length(reason) <= 1000);

-- Replace the old signature rather than keeping ambiguous overloads.
-- The default reason keeps ordinary three-argument status calls valid.
drop function public.update_customer_order_status(uuid, text, text);

create function public.update_customer_order_status(
  p_order_id uuid,
  p_expected_status text,
  p_new_status text,
  p_reason text default ''
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_allowed boolean := false;
  v_reason text := regexp_replace(
    coalesce(p_reason, ''), '^[[:space:]]+|[[:space:]]+$', '', 'g'
  );
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception using errcode = '42501', message = 'ADMIN_ACCESS_REQUIRED';
  end if;

  if p_order_id is null or p_expected_status is null or p_new_status is null then
    raise exception using errcode = 'P0001', message = 'INVALID_STATUS_REQUEST';
  end if;

  select customer_order.* into v_order
  from public.orders as customer_order
  where customer_order.id = p_order_id
  for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'ORDER_NOT_FOUND';
  end if;

  if v_order.status <> p_expected_status then
    raise exception using errcode = 'P0001', message = 'ORDER_STATUS_CHANGED';
  end if;

  if v_order.status = p_new_status then
    return v_order.status;
  end if;

  if v_order.archived_at is not null then
    raise exception using errcode = 'P0001', message = 'ORDER_ARCHIVED';
  end if;

  if length(v_reason) > 1000 then
    raise exception using errcode = 'P0001', message = 'ORDER_REASON_TOO_LONG';
  end if;

  if v_order.status = 'cancelled' and p_new_status = 'new' then
    if not coalesce(app_private.is_owner(), false) then
      raise exception using errcode = '42501', message = 'OWNER_ACCESS_REQUIRED';
    end if;
    if length(v_reason) < 5 then
      raise exception using errcode = 'P0001', message = 'ORDER_REASON_REQUIRED';
    end if;
    v_allowed := true;
  else
    v_allowed := case v_order.status
      when 'new' then p_new_status in ('confirmed', 'cancelled')
      when 'confirmed' then p_new_status in ('preparing', 'cancelled')
      when 'preparing' then
        p_new_status = 'cancelled'
        or (v_order.fulfillment_method = 'pickup' and p_new_status = 'ready_for_pickup')
        or (v_order.fulfillment_method = 'delivery' and p_new_status = 'out_for_delivery')
      when 'ready_for_pickup' then p_new_status in ('completed', 'cancelled')
      when 'out_for_delivery' then p_new_status in ('completed', 'cancelled')
      else false
    end;

    if v_allowed and p_new_status = 'cancelled' and length(v_reason) < 5 then
      raise exception using errcode = 'P0001', message = 'ORDER_REASON_REQUIRED';
    end if;
  end if;

  if not v_allowed then
    raise exception using errcode = 'P0001', message = 'INVALID_STATUS_TRANSITION';
  end if;

  update public.orders set status = p_new_status where id = v_order.id;

  insert into public.order_status_events (
    order_id, previous_status, new_status, changed_by, reason
  ) values (
    v_order.id, v_order.status, p_new_status, auth.uid(), v_reason
  );

  return p_new_status;
end;
$$;

revoke all privileges
on function public.update_customer_order_status(uuid, text, text, text)
from public, anon, authenticated;

grant execute
on function public.update_customer_order_status(uuid, text, text, text)
to authenticated;

commit;
