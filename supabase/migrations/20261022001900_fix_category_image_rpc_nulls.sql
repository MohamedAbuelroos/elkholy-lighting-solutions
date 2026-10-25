create or replace function public.set_category_image(
  p_category_id uuid,
  p_expected_src text,
  p_new_src text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_current_src text;
  v_expected_src text := nullif(p_expected_src, '');
  v_new_src text := nullif(p_new_src, '');
begin
  if not app_private.is_admin() then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select image_path
  into v_current_src
  from public.categories
  where id = p_category_id
  for update;

  if not found then
    raise exception 'category_not_found' using errcode = 'P0002';
  end if;

  if v_current_src is distinct from v_expected_src then
    raise exception 'category_image_changed' using errcode = '40001';
  end if;

  if v_new_src is not null then
    if length(v_new_src) > 2048 or length(trim(v_new_src)) = 0 then
      raise exception 'invalid_image_src' using errcode = '22023';
    end if;
  end if;

  update public.categories
  set image_path = v_new_src
  where id = p_category_id;

  return true;
end;
$$;