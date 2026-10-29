begin;

alter table public.products
  add column discount_percent smallint not null default 0;

alter table public.products
  add constraint products_discount_percent_range
  check (discount_percent between 0 and 99);

alter table public.products
  add constraint products_discount_requires_price
  check (discount_percent = 0 or price is not null);

alter table public.products
  add column sale_price numeric generated always as (
    round(price::numeric * (100 - discount_percent) / 100, 2)
  ) stored;

commit;