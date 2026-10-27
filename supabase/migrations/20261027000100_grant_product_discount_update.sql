begin;

do $$
begin
  if not exists (
    select 1
    from pg_class
    where oid = 'public.products'::regclass
      and relrowsecurity = true
  ) then
    raise exception 'RLS is not enabled on public.products';
  end if;
end;
$$;

grant update (discount_percent)
on table public.products
to authenticated;

commit;