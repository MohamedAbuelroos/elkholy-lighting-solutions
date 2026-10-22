begin;

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),

  category_id uuid not null
    references public.categories(id)
    on delete restrict,

  slug text not null unique,

  name_ar text not null,
  name_en text,

  description_ar text not null default '',
  description_en text,

  sku text unique,
  price numeric(12, 2),

  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_popular boolean not null default false,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint products_name_ar_not_empty
    check (length(trim(name_ar)) > 0),

  constraint products_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  constraint products_sku_not_empty
    check (
      sku is null
      or (
        sku = trim(sku)
        and length(sku) > 0
      )
    ),

  constraint products_price_non_negative
    check (price is null or price >= 0),

  constraint products_sort_order_non_negative
    check (sort_order >= 0)
);

create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();


-- Product images
create table public.product_images (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references public.products(id)
    on delete cascade,

  src text not null,
  alt text not null default '',

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint product_images_src_not_empty
    check (length(trim(src)) > 0),

  constraint product_images_sort_order_non_negative
    check (sort_order >= 0),

  constraint product_images_unique_source
    unique (product_id, src)
);

create trigger product_images_set_updated_at
before update on public.product_images
for each row
execute function public.set_updated_at();


-- Indexes
create index products_category_id_idx
  on public.products(category_id);

create index products_active_sort_idx
  on public.products(sort_order, id)
  where is_active = true;

create index products_featured_sort_idx
  on public.products(sort_order, id)
  where is_active = true and is_featured = true;

create index products_popular_sort_idx
  on public.products(sort_order, id)
  where is_active = true and is_popular = true;

create index product_images_product_sort_idx
  on public.product_images(product_id, sort_order, id);


-- Explicit Data API permissions
revoke all privileges on table public.products
  from anon, authenticated;

revoke all privileges on table public.product_images
  from anon, authenticated;

grant select on table public.products
  to anon, authenticated;

grant select on table public.product_images
  to anon, authenticated;


-- Row Level Security
alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy products_read_active
on public.products
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.categories as category
    where category.id = products.category_id
      and category.is_active = true
  )
);

create policy product_images_read_visible_products
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products as product
    where product.id = product_images.product_id
  )
);

commit;