begin;

-- تبقى المهام موجودة حتى لو المشروع نفسه اتحذف لاحقًا.
create table public.project_image_cleanup_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  src text not null unique check (length(trim(src)) > 0),
  created_at timestamptz not null default now()
);

create index project_image_cleanup_jobs_project_idx
on public.project_image_cleanup_jobs (project_id, created_at, id);

alter table public.project_image_cleanup_jobs enable row level security;

revoke all on public.project_image_cleanup_jobs
from anon, authenticated;

grant select, insert, delete
on public.project_image_cleanup_jobs
to authenticated;

create policy project_image_cleanup_jobs_admin_access
on public.project_image_cleanup_jobs
for all
to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));


-- أي حذف لسجل صورة يسجل مهمة تنظيف في نفس المعاملة.
create function app_private.enqueue_project_image_cleanup()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.project_image_cleanup_jobs (project_id, src)
  values (old.project_id, old.src)
  on conflict (src) do nothing;

  return old;
end;
$$;

revoke all
on function app_private.enqueue_project_image_cleanup()
from public, anon, authenticated;

create trigger project_images_enqueue_cleanup
before delete on public.project_images
for each row
execute function app_private.enqueue_project_image_cleanup();


create function public.manage_project_image(
  p_project_id uuid,
  p_image_id uuid,
  p_action text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  project_is_active boolean;
  image_ids uuid[];
  current_position integer;
  target_position integer;
  temporary_id uuid;
begin
  if not coalesce(app_private.is_admin(), false) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_action is null
    or p_action not in ('earlier', 'later', 'first', 'delete')
  then
    raise exception 'invalid_image_action' using errcode = '22023';
  end if;

  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Project image changes require READ COMMITTED isolation';
  end if;

  -- نفس القفل المستخدم أثناء إضافة الصور.
  select project.is_active
  into project_is_active
  from public.projects as project
  where project.id = p_project_id
  for update;

  if not found then
    raise exception 'project_not_found' using errcode = 'P0002';
  end if;

  select array_agg(image.id order by image.sort_order, image.id)
  into image_ids
  from public.project_images as image
  where image.project_id = p_project_id;

  current_position := array_position(image_ids, p_image_id);

  if current_position is null then
    raise exception 'image_not_found' using errcode = 'P0002';
  end if;

  if p_action = 'delete' then
    if project_is_active
      and coalesce(array_length(image_ids, 1), 0) <= 1
    then
      raise exception 'cannot_delete_last_published_image'
        using errcode = '23514';
    end if;

    delete from public.project_images
    where id = p_image_id
      and project_id = p_project_id;

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
      return true;
    end if;

    temporary_id := image_ids[target_position];
    image_ids[target_position] := p_image_id;
    image_ids[current_position] := temporary_id;
  end if;

  update public.project_images as image
  set sort_order = (ordered.position - 1)::integer
  from unnest(image_ids) with ordinality as ordered(id, position)
  where image.id = ordered.id
    and image.project_id = p_project_id;

  return true;
end;
$$;

revoke all
on function public.manage_project_image(uuid, uuid, text)
from public, anon, authenticated;

grant execute
on function public.manage_project_image(uuid, uuid, text)
to authenticated;

commit;