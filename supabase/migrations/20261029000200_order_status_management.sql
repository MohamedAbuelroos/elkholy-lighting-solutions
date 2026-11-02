begin;

-- Internal audit history. Never exposed to public tracking.
create table public.order_status_events (
  id uuid primary key default gen_random_uuid(),

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  previous_status text not null,
  new_status text not null,

  changed_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  constraint order_status_events_previous_valid
    check (
      previous_status in (
        'new',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'completed',
        'cancelled'
      )
    ),

  constraint order_status_events_new_valid
    check (
      new_status in (
        'new',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'completed',
        'cancelled'
      )
    ),

  constraint order_status_events_changed
    check (previous_status <> new_status)
);

create index order_status_events_order_created_idx
  on public.order_status_events(order_id, created_at, id);

revoke all privileges
on table public.order_status_events
from public, anon, authenticated;

alter table public.order_status_events enable row level security;

grant select
on table public.order_status_events
to authenticated;

create policy order_status_events_admin_select
on public.order_status_events
for select
to authenticated
using ((select app_private.is_admin()));


create function public.update_customer_order_status(
  p_order_id uuid,
  p_expected_status text,
  p_new_status text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_allowed boolean := false;
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception using
      errcode = '42501',
      message = 'ADMIN_ACCESS_REQUIRED';
  end if;

  if p_order_id is null
    or p_expected_status is null
    or p_new_status is null
  then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_STATUS_REQUEST';
  end if;

  select existing_order.*
  into v_order
  from public.orders as existing_order
  where existing_order.id = p_order_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'ORDER_NOT_FOUND';
  end if;

  if v_order.status <> p_expected_status then
    raise exception using
      errcode = 'P0001',
      message = 'ORDER_STATUS_CHANGED';
  end if;

  -- Repeating an already completed update is harmless.
  if v_order.status = p_new_status then
    return v_order.status;
  end if;

  v_allowed := case v_order.status
    when 'new' then
      p_new_status in ('confirmed', 'cancelled')

    when 'confirmed' then
      p_new_status in ('preparing', 'cancelled')

    when 'preparing' then
      p_new_status = 'cancelled'
      or (
        v_order.fulfillment_method = 'pickup'
        and p_new_status = 'ready_for_pickup'
      )
      or (
        v_order.fulfillment_method = 'delivery'
        and p_new_status = 'out_for_delivery'
      )

    when 'ready_for_pickup' then
      p_new_status in ('completed', 'cancelled')

    when 'out_for_delivery' then
      p_new_status in ('completed', 'cancelled')

    else false
  end;

  if not v_allowed then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_STATUS_TRANSITION';
  end if;

  update public.orders
  set status = p_new_status
  where id = v_order.id;

  insert into public.order_status_events (
    order_id,
    previous_status,
    new_status,
    changed_by
  )
  values (
    v_order.id,
    v_order.status,
    p_new_status,
    auth.uid()
  );

  return p_new_status;
end;
$$;

revoke all privileges
on function public.update_customer_order_status(uuid, text, text)
from public, anon, authenticated;

grant execute
on function public.update_customer_order_status(uuid, text, text)
to authenticated;

commit;