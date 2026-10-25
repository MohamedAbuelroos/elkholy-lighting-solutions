begin;

create table public.categories (
  id uuid primary key default gen_random_uuid(),

  name_ar text not null,
  name_en text,

  slug text not null unique,

  description_ar text,
  description_en text,

  image_path text,

  parent_id uuid
    references public.categories(id)
    on delete restrict,

  sort_order integer not null default 0,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint categories_name_ar_not_empty
    check (length(trim(name_ar)) > 0),

  constraint categories_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  constraint categories_sort_order_non_negative
    check (sort_order >= 0),

  constraint categories_not_own_parent
    check (parent_id is null or parent_id <> id)
);

create index categories_parent_id_idx
  on public.categories(parent_id);

create index categories_active_sort_idx
  on public.categories(sort_order, id)
  where is_active = true;

-- Automatically maintain updated_at.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

-- Explicit permissions for requests through the Data API.
revoke all privileges on table public.categories
  from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on table public.categories
  to anon, authenticated;

alter table public.categories enable row level security;

create policy categories_read_active
on public.categories
for select
to anon, authenticated
using (is_active = true);

commit;