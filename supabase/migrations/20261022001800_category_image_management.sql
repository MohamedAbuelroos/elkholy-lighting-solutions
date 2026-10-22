begin;

-- لا يوجد FK حتى تظل مهمة التنظيف موجودة بعد حذف الفئة.
create table public.category_image_cleanup_jobs (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null,
  src text not null unique check (length(trim(src)) > 0),
  created_at timestamptz not null default now()
);

alter table public.category_image_cleanup_jobs enable row level security;

revoke all on public.category_image_cleanup_jobs from anon, authenticated;

grant select, insert, delete
on public.category_image_cleanup_jobs
to authenticated;

create policy "Admins can read category cleanup jobs"
on public.category_image_cleanup_jobs
for select to authenticated
using ((select app_private.is_admin()));

create policy "Admins can create category cleanup jobs"
on public.category_image_cleanup_jobs
for insert to authenticated
with check ((select app_private.is_admin()));

create policy "Admins can delete category cleanup jobs"
on public.category_image_cleanup_jobs
for delete to authenticated
using ((select app_private.is_admin()));


-- تسجيل الصورة القديمة عند الاستبدال أو حذف الفئة.
create function app_private.enqueue_category_image_cleanup()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if old.image_path is not distinct from new.image_path then
      return new;
    end if;
  end if;

  if old.image_path is not null and length(trim(old.image_path)) > 0 then
    insert into public.category_image_cleanup_jobs (category_id, src)
    values (old.id, old.image_path)
    on conflict (src) do nothing;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all
on function app_private.enqueue_category_image_cleanup()
from public, anon, authenticated;

create trigger enqueue_category_image_cleanup
before update of image_path or delete
on public.categories
for each row
execute function app_private.enqueue_category_image_cleanup();


-- حفظ الصورة مع حماية من التعديل من تبويب قديم.
create function public.set_category_image(
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

  if v_current_src is distinct from p_expected_src then
    raise exception 'category_image_changed' using errcode = '40001';
  end if;

  if p_new_src is not null then
    if length(p_new_src) > 2048 or length(trim(p_new_src)) = 0 then
      raise exception 'invalid_image_src' using errcode = '22023';
    end if;
  end if;

  update public.categories
  set image_path = p_new_src
  where id = p_category_id;

  return true;
end;
$$;

revoke all
on function public.set_category_image(uuid, text, text)
from public, anon, authenticated;

grant execute
on function public.set_category_image(uuid, text, text)
to authenticated;

commit;