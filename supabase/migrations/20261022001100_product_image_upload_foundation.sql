begin;

-- تأكيد حدود التخزين المتفق عليها.
update storage.buckets
set
  file_size_limit = 512000,
  allowed_mime_types = array['image/webp']::text[]
where id = 'product-images';


-- السماح للمدير بعرض وإدارة ملفات صور المنتجات.
create policy product_images_storage_admin_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-images'
  and (select app_private.is_admin())
);


-- الرفع داخل مجلد يحمل معرّف منتج موجود.
-- شكل المسار:
-- PRODUCT_UUID/IMAGE_UUID.webp
create policy product_images_storage_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (select app_private.is_admin())
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$'
  and exists (
    select 1
    from public.products as product
    where product.id::text = (storage.foldername(name))[1]
  )
);


-- مطلوب لحذف الصور وتنظيف الملفات إذا فشل ربطها بالمنتج.
create policy product_images_storage_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and (select app_private.is_admin())
);


-- فرض حد أقصى 5 صور مرتبطة بكل منتج.
create function app_private.enforce_product_image_limit()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  existing_count integer;
  next_sort_order integer;
begin
  if tg_op = 'UPDATE' then
    if new.product_id = old.product_id then
      return new;
    end if;
  end if;

  -- نعتمد على قفل المنتج وتسلسل القراءات في READ COMMITTED.
  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Product image changes require READ COMMITTED isolation';
  end if;

  -- تسلسل الإضافات لنفس المنتج يمنع تجاوز الحد
  -- حتى لو وصلت عمليتا رفع في نفس الوقت.
  perform product.id
  from public.products as product
  where product.id = new.product_id
  for update;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'Product does not exist or is not accessible';
  end if;

  select
    count(*)::integer,
    coalesce(max(image.sort_order) + 1, 0)
  into existing_count, next_sort_order
  from public.product_images as image
  where image.product_id = new.product_id
    and image.id <> new.id;

  if existing_count >= 5 then
    raise exception using
      errcode = '23514',
      message = 'product_image_limit_exceeded';
  end if;

  -- الصورة الجديدة تضاف في نهاية الترتيب.
  new.sort_order := next_sort_order;

  return new;
end;
$$;

revoke all
on function app_private.enforce_product_image_limit()
from public, anon, authenticated;

create trigger product_images_enforce_limit
before insert or update of product_id
on public.product_images
for each row
execute function app_private.enforce_product_image_limit();

commit;