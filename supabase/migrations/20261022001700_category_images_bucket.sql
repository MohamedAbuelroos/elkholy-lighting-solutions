-- صور الفئات: WebP فقط، بحد أقصى 500 KiB للصورة.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'category-images',
  'category-images',
  true,
  512000,
  array['image/webp']::text[]
);

-- قراءة بيانات الملفات داخل التخزين للمشرفين.
create policy "Admins can select category images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'category-images'
  and (select app_private.is_admin())
);

-- الرفع داخل مجلد يحمل معرّف فئة موجودة.
-- المسار: category-id/random-id.webp
create policy "Admins can upload category images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'category-images'
  and (select app_private.is_admin())
  and name ~
    '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
  and exists (
    select 1
    from public.categories as category
    where category.id::text = (storage.foldername(name))[1]
  )
);

-- حذف الملفات للمشرفين.
create policy "Admins can delete category images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'category-images'
  and (select app_private.is_admin())
);