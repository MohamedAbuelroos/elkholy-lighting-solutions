begin;

-- =====================================================
-- Orders
-- =====================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),

  -- Reference for staff; this is NOT the secret tracking code.
  order_number bigint generated always as identity unique,

  -- Used to prevent duplicate submissions.
  idempotency_key uuid not null unique,
  request_hash text not null,

  -- Store a hash of the tracking code, not the code itself.
  tracking_code_hash text not null unique,

  customer_name text not null,
  customer_phone text not null,

  fulfillment_method text not null,

  governorate text,
  city text,
  address text,

  customer_notes text not null default '',

  status text not null default 'new',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint orders_request_hash_format
    check (request_hash ~ '^[0-9a-f]{64}$'),

  constraint orders_tracking_hash_format
    check (tracking_code_hash ~ '^[0-9a-f]{64}$'),

  constraint orders_customer_name_length
    check (
      customer_name = trim(customer_name)
      and length(customer_name) between 2 and 150
    ),

  -- Egyptian mobile number stored in international format.
  constraint orders_customer_phone_format
    check (customer_phone ~ '^\+201[0125][0-9]{8}$'),

  constraint orders_fulfillment_method_valid
    check (fulfillment_method in ('pickup', 'delivery')),

  constraint orders_governorate_length
    check (
      governorate is null
      or length(trim(governorate)) between 1 and 100
    ),

  constraint orders_city_length
    check (
      city is null
      or length(trim(city)) between 1 and 150
    ),

  constraint orders_address_length
    check (
      address is null
      or length(trim(address)) between 5 and 1000
    ),

  constraint orders_delivery_address_required
    check (
      fulfillment_method <> 'delivery'
      or (
        governorate is not null
        and city is not null
        and address is not null
      )
    ),

  constraint orders_customer_notes_length
    check (length(customer_notes) <= 2000),

  constraint orders_status_valid
    check (
      status in (
        'new',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'completed',
        'cancelled'
      )
    ),

  constraint orders_status_matches_fulfillment
    check (
      (status <> 'ready_for_pickup' or fulfillment_method = 'pickup')
      and
      (status <> 'out_for_delivery' or fulfillment_method = 'delivery')
    )
);

create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create index orders_created_at_idx
  on public.orders(created_at desc, id);

create index orders_status_created_at_idx
  on public.orders(status, created_at desc, id);


-- =====================================================
-- Product snapshots belonging to each order
-- =====================================================

create table public.order_items (
  id uuid primary key default gen_random_uuid(),

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  -- Preserve the order item if the catalog product is deleted.
  product_id uuid
    references public.products(id)
    on delete set null,

  product_name text not null,
  product_slug text not null,
  product_sku text,

  quantity integer not null,

  original_unit_price numeric(12, 2),
  discount_percent smallint not null default 0,
  unit_price numeric(12, 2),

  line_total numeric(16, 2) generated always as (
    unit_price * quantity
  ) stored,

  created_at timestamptz not null default now(),

  constraint order_items_product_name_length
    check (length(trim(product_name)) between 1 and 200),

  constraint order_items_product_slug_format
    check (
      length(product_slug) between 1 and 150
      and product_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),

  constraint order_items_product_sku_length
    check (
      product_sku is null
      or length(trim(product_sku)) between 1 and 100
    ),

  constraint order_items_quantity_range
    check (quantity between 1 and 999),

  constraint order_items_discount_range
    check (discount_percent between 0 and 99),

  constraint order_items_original_price_valid
    check (
      original_unit_price is null
      or original_unit_price >= 0
    ),

  constraint order_items_unit_price_valid
    check (unit_price is null or unit_price >= 0),

  constraint order_items_price_snapshot_valid
    check (
      (
        original_unit_price is null
        and unit_price is null
        and discount_percent = 0
      )
      or
      (
        original_unit_price is not null
        and unit_price is not null
        and unit_price = round(
          original_unit_price * (100 - discount_percent) / 100,
          2
        )
      )
    )
);

create index order_items_order_id_idx
  on public.order_items(order_id);

create index order_items_product_id_idx
  on public.order_items(product_id)
  where product_id is not null;

create unique index order_items_unique_product_idx
  on public.order_items(order_id, product_id)
  where product_id is not null;


-- =====================================================
-- Permissions and RLS
-- =====================================================

revoke all privileges
on table public.orders, public.order_items
from public, anon, authenticated;

revoke all privileges
on sequence public.orders_order_number_seq
from public, anon, authenticated;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- For now, admins can read only.
-- Creation and status updates will use dedicated operations.
grant select
on table public.orders, public.order_items
to authenticated;

create policy orders_admin_select
on public.orders
for select
to authenticated
using ((select app_private.is_admin()));

create policy order_items_admin_select
on public.order_items
for select
to authenticated
using ((select app_private.is_admin()));

commit;