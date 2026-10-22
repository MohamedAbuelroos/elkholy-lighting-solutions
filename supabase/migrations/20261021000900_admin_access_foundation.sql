begin;

-- Private list of accounts allowed to administer the site.
create table app_private.admin_users (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger admin_users_set_updated_at
before update on app_private.admin_users
for each row
execute function public.set_updated_at();

-- Users cannot read or modify the admin list directly.
revoke all privileges
on table app_private.admin_users
from public, anon, authenticated;

alter table app_private.admin_users
enable row level security;


-- Internal authorization check.
create function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from app_private.admin_users as administrator
    where administrator.user_id = (select auth.uid())
      and administrator.is_active = true
  );
$$;

revoke all
on function app_private.is_admin()
from public, anon, authenticated;

grant execute
on function app_private.is_admin()
to authenticated;


-- Public API function: reports only the caller's own status.
create function public.current_user_is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select app_private.is_admin();
$$;

revoke all
on function public.current_user_is_admin()
from public, anon, authenticated;

grant execute
on function public.current_user_is_admin()
to authenticated;

commit;