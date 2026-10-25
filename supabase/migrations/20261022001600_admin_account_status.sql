begin;

create function app_private.set_catalog_admin_active(
  p_user_id uuid,
  p_is_active boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_role text;
begin
  if not coalesce(app_private.is_owner(), false) then
    raise exception using
      errcode = '42501',
      message = 'Owner access required';
  end if;

  if p_is_active is null then
    raise exception using
      errcode = '22023',
      message = 'Account status is required';
  end if;

  if p_user_id = (select auth.uid()) then
    raise exception using
      errcode = '23514',
      message = 'cannot_change_own_admin_status';
  end if;

  select admin_record.role
  into target_role
  from app_private.admin_users as admin_record
  where admin_record.user_id = p_user_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Admin account not found';
  end if;

  if target_role = 'owner' then
    raise exception using
      errcode = '23514',
      message = 'owner_account_protected';
  end if;

  update app_private.admin_users
  set is_active = p_is_active
  where user_id = p_user_id;

  return p_is_active;
end;
$$;

revoke all
on function app_private.set_catalog_admin_active(uuid, boolean)
from public, anon, authenticated;

grant execute
on function app_private.set_catalog_admin_active(uuid, boolean)
to authenticated;


create function public.set_catalog_admin_active(
  p_user_id uuid,
  p_is_active boolean
)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select app_private.set_catalog_admin_active(
    p_user_id,
    p_is_active
  );
$$;

revoke all
on function public.set_catalog_admin_active(uuid, boolean)
from public, anon, authenticated;

grant execute
on function public.set_catalog_admin_active(uuid, boolean)
to authenticated;

commit;