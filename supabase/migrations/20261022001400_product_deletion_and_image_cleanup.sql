begin;

create table public.product_image_cleanup_jobs (
  id uuid primary key default gen_random_uuid(),

  -- بدون Foreign Key حتى يظل الطلب موجودًا بعد حذف المنتج.
  product_id uuid not null,

  src text not null unique
    check (length(btrim(src)) > 0),

  created_at timestamptz not null default now()
);

create index product_image_cleanup_jobs_created_idx
on public.product_image_cleanup_jobs(created_at, id);

alter table public.product_image_cleanup_jobs
enable row level security;

revoke all
on table public.product_image_cleanup_jobs
from public, anon, authenticated;

grant select, insert, delete
on table public.product_image_cleanup_jobs
to authenticated;

create policy product_image_cleanup_jobs_admin_select
on public.product_image_cleanup_jobs
for select
to authenticated
using ((select app_private.is_admin()));

create policy product_image_cleanup_jobs_admin_insert
on public.product_image_cleanup_jobs
for insert
to authenticated
with check ((select app_private.is_admin()));

create policy product_image_cleanup_jobs_admin_delete
on public.product_image_cleanup_jobs
for delete
to authenticated
using ((select app_private.is_admin()));


-- تسجيل طلب تنظيف مع كل صورة تُحذف:
-- سواء حذف صورة منفردة أو حذف المنتج بالكامل.
create function app_private.enqueue_product_image_cleanup()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.product_image_cleanup_jobs (
    product_id,
    src
  )
  values (
    old.product_id,
    old.src
  )
  on conflict (src) do nothing;

  return old;
end;
$$;

revoke all
on function app_private.enqueue_product_image_cleanup()
from public, anon, authenticated;

create trigger product_images_enqueue_cleanup
before delete
on public.product_images
for each row
execute function app_private.enqueue_product_image_cleanup();


create function public.delete_catalog_product(
  p_product_id uuid
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  product_is_active boolean;
  deleted_product_id uuid;
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception using
      errcode = '42501',
      message = 'Admin access required';
  end if;

  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Product deletion requires READ COMMITTED isolation';
  end if;

  select product.is_active
  into product_is_active
  from public.products as product
  where product.id = p_product_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Product not found';
  end if;

  if product_is_active then
    raise exception using
      errcode = '23514',
      message = 'hide_product_before_deleting';
  end if;

  -- صور المنتج تُحذف تلقائيًا بسبب ON DELETE CASCADE.
  -- الـ trigger يسجل طلبات التنظيف قبل حذف سجلات الصور.
  delete from public.products
  where id = p_product_id
  returning id into deleted_product_id;

  return deleted_product_id;
end;
$$;

revoke all
on function public.delete_catalog_product(uuid)
from public, anon, authenticated;

grant execute
on function public.delete_catalog_product(uuid)
to authenticated;

commit;