begin;

-- Internal helpers, outside the public API schema.
create schema if not exists app_private;

revoke all on schema app_private from public;
grant usage on schema app_private to anon, authenticated;


-- Check the category and its full chain of ancestors.
create function app_private.is_category_visible(
  target_category_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  with recursive category_chain as (
    select
      category.id,
      category.parent_id,
      category.is_active,
      array[category.id] as visited_ids

    from public.categories as category
    where category.id = target_category_id

    union all

    select
      parent.id,
      parent.parent_id,
      parent.is_active,
      chain.visited_ids || parent.id

    from category_chain as chain
    join public.categories as parent
      on parent.id = chain.parent_id

    where not (parent.id = any(chain.visited_ids))
  )

  select coalesce(
    bool_and(chain.is_active)
    and bool_or(chain.parent_id is null),
    false
  )
  from category_chain as chain;
$$;

revoke all
on function app_private.is_category_visible(uuid)
from public, anon, authenticated;

grant execute
on function app_private.is_category_visible(uuid)
to anon, authenticated;


-- Replace the original category SELECT policy.
drop policy categories_read_active
on public.categories;

create policy categories_read_active
on public.categories
for select
to anon, authenticated
using (
  app_private.is_category_visible(id)
);


-- Replace the original product SELECT policy.
drop policy products_read_active
on public.products;

create policy products_read_active
on public.products
for select
to anon, authenticated
using (
  is_active = true
  and app_private.is_category_visible(category_id)
);

commit;