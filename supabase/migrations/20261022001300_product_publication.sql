begin;

create function public.set_product_publication(
  p_product_id uuid,
  p_is_active boolean
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_category_id uuid;
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception using
      errcode = '42501',
      message = 'Admin access required';
  end if;

  if p_is_active is null then
    raise exception using
      errcode = '22023',
      message = 'Publication status is required';
  end if;

  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Publication changes require READ COMMITTED isolation';
  end if;

  -- نفس قفل المنتج المستخدم في عمليات إدارة الصور.
  select product.category_id
  into selected_category_id
  from public.products as product
  where product.id = p_product_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Product not found';
  end if;

  if p_is_active then
    if not exists (
      select 1
      from public.product_images as image
      where image.product_id = p_product_id
    ) then
      raise exception using
        errcode = '23514',
        message = 'product_requires_image';
    end if;

    if not coalesce(
      app_private.is_category_visible(selected_category_id),
      false
    ) then
      raise exception using
        errcode = '23514',
        message = 'product_category_not_visible';
    end if;
  end if;

  update public.products
  set is_active = p_is_active
  where id = p_product_id;

  return p_is_active;
end;
$$;

revoke all
on function public.set_product_publication(uuid, boolean)
from public, anon, authenticated;

grant execute
on function public.set_product_publication(uuid, boolean)
to authenticated;

commit;