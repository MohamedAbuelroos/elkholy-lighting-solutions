begin;

create function public.manage_product_image(
  p_product_id uuid,
  p_image_id uuid,
  p_action text
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  product_is_active boolean;
  image_ids uuid[];
  current_position integer;
  target_position integer;
  temporary_id uuid;
  deleted_src text;
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception using
      errcode = '42501',
      message = 'Admin access required';
  end if;

  if p_action is null
    or p_action not in ('earlier', 'later', 'first', 'delete')
  then
    raise exception using
      errcode = '22023',
      message = 'Invalid image action';
  end if;

  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Image changes require READ COMMITTED isolation';
  end if;

  -- نفس قفل المنتج المستخدم أثناء إضافة الصور.
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

  select array_agg(image.id order by image.sort_order, image.id)
  into image_ids
  from public.product_images as image
  where image.product_id = p_product_id;

  current_position := array_position(image_ids, p_image_id);

  if current_position is null then
    raise exception using
      errcode = 'P0002',
      message = 'Image not found';
  end if;

  if p_action = 'delete' then
    if product_is_active
      and coalesce(array_length(image_ids, 1), 0) <= 1
    then
      raise exception using
        errcode = '23514',
        message = 'cannot_delete_last_published_image';
    end if;

    delete from public.product_images
    where id = p_image_id
      and product_id = p_product_id
    returning src into deleted_src;

    image_ids := array_remove(image_ids, p_image_id);

  elsif p_action = 'first' then
    image_ids := array[p_image_id]
      || array_remove(image_ids, p_image_id);

  else
    target_position := case
      when p_action = 'earlier' then current_position - 1
      else current_position + 1
    end;

    if target_position < 1
      or target_position > array_length(image_ids, 1)
    then
      return null;
    end if;

    temporary_id := image_ids[target_position];
    image_ids[target_position] := p_image_id;
    image_ids[current_position] := temporary_id;
  end if;

  -- إعادة ترقيم الصور من صفر، داخل نفس العملية.
  update public.product_images as image
  set sort_order = (ordered.position - 1)::integer
  from unnest(image_ids) with ordinality as ordered(id, position)
  where image.id = ordered.id
    and image.product_id = p_product_id;

  -- عند الحذف نرجع الرابط للسيرفر لتنظيف الملف من Storage.
  return deleted_src;
end;
$$;

revoke all
on function public.manage_product_image(uuid, uuid, text)
from public, anon, authenticated;

grant execute
on function public.manage_product_image(uuid, uuid, text)
to authenticated;

commit;