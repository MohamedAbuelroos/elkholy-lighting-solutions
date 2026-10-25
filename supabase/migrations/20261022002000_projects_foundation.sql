begin;

-- =========================================================
-- Projects
-- =========================================================

create table public.projects (
  id uuid primary key default gen_random_uuid(),

  title_ar text not null,
  title_en text,

  description_ar text not null default '',
  description_en text,

  -- وصف نوع المشروع، وليس ارتباطًا بفئات المنتجات.
  -- مثال: إضاءة سكنية، تشطيبات كهربائية، مشروع تجاري.
  category_ar text not null,
  category_en text,

  -- المشروع يبدأ كمسودة.
  is_active boolean not null default false,
  is_featured boolean not null default false,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint projects_title_ar_valid
    check (length(trim(title_ar)) between 1 and 160),

  constraint projects_title_en_valid
    check (
      title_en is null
      or length(trim(title_en)) between 1 and 160
    ),

  constraint projects_description_ar_length
    check (length(description_ar) <= 5000),

  constraint projects_description_en_length
    check (
      description_en is null
      or length(description_en) <= 5000
    ),

  constraint projects_category_ar_valid
    check (length(trim(category_ar)) between 1 and 100),

  constraint projects_category_en_valid
    check (
      category_en is null
      or length(trim(category_en)) between 1 and 100
    ),

  constraint projects_sort_order_valid
    check (sort_order between 0 and 100000)
);

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create index projects_public_listing_idx
on public.projects (is_active, sort_order, id);

create index projects_featured_listing_idx
on public.projects (is_active, is_featured, sort_order, id);


-- =========================================================
-- Project images
-- =========================================================

create table public.project_images (
  id uuid primary key default gen_random_uuid(),

  project_id uuid not null
    references public.projects(id)
    on delete cascade,

  src text not null,
  alt text not null default '',

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint project_images_src_valid
    check (length(trim(src)) between 1 and 2048),

  constraint project_images_alt_length
    check (length(alt) <= 200),

  constraint project_images_sort_order_valid
    check (sort_order between 0 and 100000),

  constraint project_images_unique_source
    unique (project_id, src)
);

create index project_images_project_sort_idx
on public.project_images (project_id, sort_order, id);

create trigger project_images_set_updated_at
before update on public.project_images
for each row
execute function public.set_updated_at();


-- =========================================================
-- Permissions and RLS
-- =========================================================

alter table public.projects enable row level security;
alter table public.project_images enable row level security;

revoke all on public.projects, public.project_images
from anon, authenticated;

grant select
on public.projects, public.project_images
to anon, authenticated;

grant insert, delete
on public.projects, public.project_images
to authenticated;

-- لا نسمح بتغيير المعرّف أو تاريخ الإنشاء.
grant update (
  title_ar,
  title_en,
  description_ar,
  description_en,
  category_ar,
  category_en,
  is_active,
  is_featured,
  sort_order
)
on public.projects
to authenticated;

-- الصورة تظل تابعة لنفس المشروع.
grant update (
  alt,
  sort_order
)
on public.project_images
to authenticated;


-- الزائر يقرأ المشاريع المنشورة فقط.
create policy projects_public_select
on public.projects
for select
to anon, authenticated
using (is_active = true);

-- المدير الرئيسي ومدير المحتوى يديران المشاريع.
create policy projects_admin_access
on public.projects
for all
to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));


-- الزائر يقرأ سجلات صور المشاريع المنشورة فقط.
create policy project_images_public_select
on public.project_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.projects as project
    where project.id = project_images.project_id
      and project.is_active = true
  )
);

create policy project_images_admin_access
on public.project_images
for all
to authenticated
using ((select app_private.is_admin()))
with check ((select app_private.is_admin()));


-- =========================================================
-- Enforce a maximum of 10 attached images per project
-- =========================================================

create function app_private.enforce_project_image_limit()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  existing_count integer;
  next_sort_order integer;
begin
  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Project image changes require READ COMMITTED isolation';
  end if;

  -- قفل المشروع لتسلسل إضافات الصور المتزامنة.
  perform project.id
  from public.projects as project
  where project.id = new.project_id
  for update;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'project_not_found';
  end if;

  select
    count(*)::integer,
    coalesce(max(image.sort_order) + 1, 0)
  into existing_count, next_sort_order
  from public.project_images as image
  where image.project_id = new.project_id;

  if existing_count >= 10 then
    raise exception using
      errcode = '23514',
      message = 'project_image_limit_exceeded';
  end if;

  new.sort_order := next_sort_order;

  return new;
end;
$$;

revoke all
on function app_private.enforce_project_image_limit()
from public, anon, authenticated;

create trigger project_images_enforce_limit
before insert on public.project_images
for each row
execute function app_private.enforce_project_image_limit();


-- =========================================================
-- Storage: WebP only, maximum 500 KiB per image
-- =========================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'project-images',
  'project-images',
  true,
  512000,
  array['image/webp']::text[]
);

create policy project_images_storage_admin_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'project-images'
  and (select app_private.is_admin())
);

-- PROJECT_UUID/IMAGE_UUID.webp
create policy project_images_storage_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-images'
  and (select app_private.is_admin())
  and name ~
    '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
  and exists (
    select 1
    from public.projects as project
    where project.id::text = (storage.foldername(name))[1]
  )
);

create policy project_images_storage_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-images'
  and (select app_private.is_admin())
);

commit;