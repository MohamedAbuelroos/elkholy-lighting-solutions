begin;

create function app_private.prevent_category_cycles()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  invalid_chain boolean;
begin
  -- No hierarchy change means no additional validation is needed.
  if TG_OP = 'UPDATE' then
    if NEW.parent_id is not distinct from OLD.parent_id then
      return NEW;
    end if;
  end if;

  -- Serialize hierarchy changes under the normal API isolation level.
  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception
      'Category hierarchy changes require READ COMMITTED transactions.';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(725001, 1);

  -- Main categories have no parent.
  if NEW.parent_id is null then
    return NEW;
  end if;

  if NEW.parent_id = NEW.id then
    raise exception using
      errcode = '23514',
      message = 'A category cannot be its own parent.';
  end if;

  -- Follow the proposed parent's ancestors.
  with recursive parent_chain as (
    select
      category.id,
      category.parent_id,
      array[category.id] as visited_ids,
      false as has_cycle

    from public.categories as category
    where category.id = NEW.parent_id

    union all

    select
      parent.id,
      parent.parent_id,
      chain.visited_ids || parent.id,
      parent.id = any(chain.visited_ids)

    from parent_chain as chain
    join public.categories as parent
      on parent.id = chain.parent_id

    where not chain.has_cycle
  )

  select exists (
    select 1
    from parent_chain
    where id = NEW.id
       or has_cycle = true
  )
  into invalid_chain;

  if invalid_chain then
    raise exception using
      errcode = '23514',
      message = 'This parent would create a category cycle.';
  end if;

  return NEW;
end;
$$;

revoke all
on function app_private.prevent_category_cycles()
from public, anon, authenticated;

create trigger categories_prevent_cycles
before insert or update of parent_id
on public.categories
for each row
execute function app_private.prevent_category_cycles();

commit;