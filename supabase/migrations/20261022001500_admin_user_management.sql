begin;

alter table app_private.admin_users
add column role text not null default 'admin'
constraint admin_users_role_check
check (role in ('owner', 'admin'));


create function app_private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from app_private.admin_users as admin_record
    where admin_record.user_id = (select auth.uid())
      and admin_record.is_active
      and admin_record.role = 'owner'
  );
$$;

revoke all
on function app_private.is_owner()
from public, anon, authenticated;

grant execute
on function app_private.is_owner()
to authenticated;


create function public.current_user_is_owner()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select app_private.is_owner();
$$;

revoke all
on function public.current_user_is_owner()
from public, anon, authenticated;

grant execute
on function public.current_user_is_owner()
to authenticated;


-- قائمة المستخدمين متاحة للمدير الرئيسي فقط.
create function public.get_admin_users()
returns table (
  user_id uuid,
  email text,
  role text,
  is_active boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not coalesce(app_private.is_owner(), false) then
    raise exception using
      errcode = '42501',
      message = 'Owner access required';
  end if;

  return query
  select
    admin_record.user_id,
    account.email::text,
    admin_record.role,
    admin_record.is_active,
    admin_record.created_at,
    account.last_sign_in_at
  from app_private.admin_users as admin_record
  join auth.users as account
    on account.id = admin_record.user_id
  order by admin_record.created_at desc, admin_record.user_id;
end;
$$;

revoke all
on function public.get_admin_users()
from public, anon, authenticated;

grant execute
on function public.get_admin_users()
to authenticated;


-- ربط الحساب الذي ينشئه السيرفر بصلاحية مدير كتالوج.
create function app_private.register_created_catalog_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  creator_id_text text;
begin
  if coalesce(
    new.raw_app_meta_data ->> 'elkholy_catalog_admin',
    'false'
  ) <> 'true' then
    return new;
  end if;

  -- عدم تغيير صلاحية أو إعادة تفعيل حساب موجود.
  if exists (
    select 1
    from app_private.admin_users
    where user_id = new.id
  ) then
    return new;
  end if;

  creator_id_text :=
    new.raw_app_meta_data ->> 'created_by_admin';

  if creator_id_text is null
    or creator_id_text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  then
    raise exception using
      errcode = '23514',
      message = 'Invalid admin creator';
  end if;

  perform admin_record.user_id
  from app_private.admin_users as admin_record
  where admin_record.user_id = creator_id_text::uuid
    and admin_record.is_active
    and admin_record.role = 'owner'
  for share;

  if not found then
    raise exception using
      errcode = '42501',
      message = 'Active owner required';
  end if;

  insert into app_private.admin_users (
    user_id,
    is_active,
    role
  )
  values (
    new.id,
    true,
    'admin'
  );

  return new;
end;
$$;

revoke all
on function app_private.register_created_catalog_admin()
from public, anon, authenticated;

create trigger auth_users_register_catalog_admin
after insert or update of raw_app_meta_data
on auth.users
for each row
execute function app_private.register_created_catalog_admin();

commit;