begin;

alter table public.orders
  add column archived_at timestamptz,
  add column archived_by uuid
    references auth.users(id)
    on delete set null;

alter table public.orders
  add constraint orders_archive_terminal_only
  check (
    archived_at is null
    or status in ('completed', 'cancelled')
  );

create index orders_unarchived_created_idx
  on public.orders(created_at desc, id)
  where archived_at is null;


create function public.set_customer_order_archived(
  p_order_id uuid,
  p_expected_archived boolean,
  p_archived boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_is_archived boolean;
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception using
      errcode = '42501',
      message = 'ADMIN_ACCESS_REQUIRED';
  end if;

  if p_order_id is null
    or p_expected_archived is null
    or p_archived is null
  then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_ARCHIVE_REQUEST';
  end if;

  select customer_order.*
  into v_order
  from public.orders as customer_order
  where customer_order.id = p_order_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'ORDER_NOT_FOUND';
  end if;

  v_is_archived := v_order.archived_at is not null;

  if v_is_archived <> p_expected_archived then
    raise exception using
      errcode = 'P0001',
      message = 'ORDER_ARCHIVE_CHANGED';
  end if;

  if v_is_archived = p_archived then
    return v_is_archived;
  end if;

  if p_archived and v_order.status not in ('completed', 'cancelled') then
    raise exception using
      errcode = 'P0001',
      message = 'ORDER_NOT_TERMINAL';
  end if;

  update public.orders
  set
    archived_at = case when p_archived then now() else null end,
    archived_by = case when p_archived then auth.uid() else null end
  where id = v_order.id;

  return p_archived;
end;
$$;

revoke all privileges
on function public.set_customer_order_archived(uuid, boolean, boolean)
from public, anon, authenticated;

grant execute
on function public.set_customer_order_archived(uuid, boolean, boolean)
to authenticated;

commit;