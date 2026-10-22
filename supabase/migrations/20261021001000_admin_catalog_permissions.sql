begin;

-- =========================================================
-- Table permissions
-- RLS will restrict these operations to active administrators.
-- =========================================================

grant select, insert, delete
on public.categories, public.products, public.product_images
to authenticated;

-- Allow editing content, but not identifiers or creation timestamps.
grant update (
  name_ar,
  name_en,
  slug,
  description_ar,
  description_en,
  image_path,
  parent_id,
  sort_order,
  is_active
)
on public.categories
to authenticated;

grant update (
  category_id,
  slug,
  name_ar,
  name_en,
  description_ar,
  description_en,
  sku,
  price,
  is_active,
  is_featured,
  is_popular,
  sort_order
)
on public.products
to authenticated;

grant update (
  product_id,
  src,
  alt,
  sort_order
)
on public.product_images
to authenticated;


-- =========================================================
-- Categories
-- =========================================================

create policy categories_admin_select
on public.categories
for select
to authenticated
using ((select app_private.is_admin()));

create policy categories_admin_insert
on public.categories
for insert
to authenticated
with check ((select app_private.is_admin()));

create policy categories_admin_update
on public.categories
for update
to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy categories_admin_delete
on public.categories
for delete
to authenticated
using ((select app_private.is_admin()));


-- =========================================================
-- Products
-- =========================================================

create policy products_admin_select
on public.products
for select
to authenticated
using ((select app_private.is_admin()));

create policy products_admin_insert
on public.products
for insert
to authenticated
with check ((select app_private.is_admin()));

create policy products_admin_update
on public.products
for update
to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy products_admin_delete
on public.products
for delete
to authenticated
using ((select app_private.is_admin()));


-- =========================================================
-- Product image records
-- =========================================================

create policy product_images_admin_select
on public.product_images
for select
to authenticated
using ((select app_private.is_admin()));

create policy product_images_admin_insert
on public.product_images
for insert
to authenticated
with check ((select app_private.is_admin()));

create policy product_images_admin_update
on public.product_images
for update
to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));

create policy product_images_admin_delete
on public.product_images
for delete
to authenticated
using ((select app_private.is_admin()));

commit;