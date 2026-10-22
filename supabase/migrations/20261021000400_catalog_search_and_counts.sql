begin;

-- Normalize searchable text:
-- remove Arabic diacritics/tatweel and normalize common letters.
create function public.normalize_catalog_search(input text)
returns text
language sql
immutable
security invoker
set search_path = ''
as $$
  select lower(
    translate(
      regexp_replace(
        normalize(coalesce(input, ''), NFKC),
        U&'[\064B-\065F\0670\0640]',
        '',
        'g'
      ),
      'أإآٱى',
      'ااااي'
    )
  );
$$;

-- Automatically updated when product names or SKU change.
alter table public.products
add column search_text text
generated always as (
  public.normalize_catalog_search(
    name_ar
    || ' '
    || coalesce(name_en, '')
    || ' '
    || coalesce(sku, '')
  )
) stored;


-- Category counts include active descendants.
create function public.get_catalog_category_counts()
returns table (
  category_id uuid,
  product_count bigint,
  total_products bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with recursive category_tree as (
    select
      category.id as ancestor_id,
      category.id as descendant_id,
      array[category.id] as visited_ids
    from public.categories as category
    where category.is_active = true

    union all

    select
      tree.ancestor_id,
      child.id,
      tree.visited_ids || child.id
    from category_tree as tree
    join public.categories as child
      on child.parent_id = tree.descendant_id
    where child.is_active = true
      and not (child.id = any(tree.visited_ids))
  ),

  visible_products as (
    select product.id, product.category_id
    from public.products as product
    join public.categories as category
      on category.id = product.category_id
    where product.is_active = true
      and category.is_active = true
  )

  select
    tree.ancestor_id as category_id,
    count(product.id) as product_count,
    (select count(*) from visible_products) as total_products

  from category_tree as tree
  left join visible_products as product
    on product.category_id = tree.descendant_id

  group by tree.ancestor_id;
$$;

revoke execute
on function public.get_catalog_category_counts()
from public, anon, authenticated;

grant execute
on function public.get_catalog_category_counts()
to anon, authenticated;

commit;