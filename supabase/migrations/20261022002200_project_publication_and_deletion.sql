begin;

create function public.set_project_publication(
  p_project_id uuid,
  p_is_active boolean
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_is_active is null then
    raise exception 'invalid_publication_status' using errcode = '22023';
  end if;

  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Project publication requires READ COMMITTED isolation';
  end if;

  perform project.id
  from public.projects as project
  where project.id = p_project_id
  for update;

  if not found then
    raise exception 'project_not_found' using errcode = 'P0002';
  end if;

  if p_is_active and not exists (
    select 1
    from public.project_images as image
    where image.project_id = p_project_id
  ) then
    raise exception 'project_requires_image' using errcode = '23514';
  end if;

  update public.projects
  set is_active = p_is_active
  where id = p_project_id;

  return p_is_active;
end;
$$;

revoke all
on function public.set_project_publication(uuid, boolean)
from public, anon, authenticated;

grant execute
on function public.set_project_publication(uuid, boolean)
to authenticated;


create function public.delete_catalog_project(
  p_project_id uuid
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  project_is_active boolean;
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Project deletion requires READ COMMITTED isolation';
  end if;

  select project.is_active
  into project_is_active
  from public.projects as project
  where project.id = p_project_id
  for update;

  if not found then
    raise exception 'project_not_found' using errcode = 'P0002';
  end if;

  if project_is_active then
    raise exception 'hide_project_before_deleting'
      using errcode = '23514';
  end if;

  -- حذف الصور المرتبطة يتم بواسطة FK CASCADE.
  -- Trigger الصور يسجل مهام تنظيف ملفات التخزين.
  delete from public.projects
  where id = p_project_id;

  return p_project_id;
end;
$$;

revoke all
on function public.delete_catalog_project(uuid)
from public, anon, authenticated;

grant execute
on function public.delete_catalog_project(uuid)
to authenticated;

commit;