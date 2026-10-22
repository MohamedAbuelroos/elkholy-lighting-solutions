begin;

update storage.buckets
set
  file_size_limit = 512000,
  allowed_mime_types = array['image/webp']
where id = 'product-images';

commit;