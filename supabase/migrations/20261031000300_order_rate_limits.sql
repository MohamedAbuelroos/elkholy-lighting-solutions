begin;

create table app_private.order_rate_limits (
  scope text not null,
  subject_hash text not null,
  request_count integer not null default 0,
  expires_at timestamptz not null,
  primary key (scope, subject_hash),
  constraint order_rate_limits_scope_valid check (
    scope in ('submit-request', 'recover-request', 'track-request', 'new-order-ip', 'new-order-phone')
  ),
  constraint order_rate_limits_hash_valid check (subject_hash ~ '^[0-9a-f]{64}$'),
  constraint order_rate_limits_count_valid check (request_count >= 0)
);

create index order_rate_limits_expiry_idx
  on app_private.order_rate_limits(expires_at);

revoke all privileges on table app_private.order_rate_limits
  from public, anon, authenticated, service_role;

alter table app_private.order_rate_limits enable row level security;

-- All counters are held in Postgres, not process memory.
-- This RPC is callable only by the trusted server client.
create function public.consume_order_rate_limit(
  p_scope text,
  p_subject_hash text
)
returns table (allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit integer;
  v_window_seconds integer;
  v_bucket app_private.order_rate_limits%rowtype;
  v_now timestamptz;
begin
  case p_scope
    when 'submit-request' then v_limit := 30; v_window_seconds := 60;
    when 'recover-request' then v_limit := 30; v_window_seconds := 60;
    when 'track-request' then v_limit := 20; v_window_seconds := 60;
    when 'new-order-ip' then v_limit := 10; v_window_seconds := 900;
    when 'new-order-phone' then v_limit := 3; v_window_seconds := 900;
    else raise exception using errcode = 'P0001', message = 'INVALID_RATE_LIMIT_SCOPE';
  end case;

  if p_subject_hash is null or p_subject_hash !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = 'P0001', message = 'INVALID_RATE_LIMIT_SUBJECT';
  end if;

  -- Bounded cleanup; do not block on buckets used by other requests.
  delete from app_private.order_rate_limits as expired
  where expired.ctid in (
    select bucket.ctid
    from app_private.order_rate_limits as bucket
    where bucket.expires_at < clock_timestamp() - interval '1 day'
    order by bucket.expires_at
    limit 100
    for update skip locked
  );

  insert into app_private.order_rate_limits (scope, subject_hash, request_count, expires_at)
  values (p_scope, p_subject_hash, 0, clock_timestamp())
  on conflict (scope, subject_hash) do nothing;

  select bucket.* into v_bucket
  from app_private.order_rate_limits as bucket
  where bucket.scope = p_scope and bucket.subject_hash = p_subject_hash
  for update;

  v_now := clock_timestamp();

  if v_bucket.expires_at <= v_now then
    update app_private.order_rate_limits as bucket
    set request_count = 1,
        expires_at = v_now + make_interval(secs => v_window_seconds)
    where bucket.scope = p_scope and bucket.subject_hash = p_subject_hash;
    return query select true, 0;
    return;
  end if;

  if v_bucket.request_count >= v_limit then
    return query select false,
      greatest(1, ceil(extract(epoch from (v_bucket.expires_at - v_now)))::integer);
    return;
  end if;

  update app_private.order_rate_limits as bucket
  set request_count = bucket.request_count + 1
  where bucket.scope = p_scope and bucket.subject_hash = p_subject_hash;

  return query select true, 0;
end;
$$;

revoke all privileges on function public.consume_order_rate_limit(text, text)
  from public, anon, authenticated;
grant execute on function public.consume_order_rate_limit(text, text) to service_role;


-- Keep the existing order-creation transaction and validations intact.
-- The outer operation holds the SAME submission lock while deciding
-- whether this is a new order or a replay of an existing submission.
create function public.create_customer_order_guarded(
  p_idempotency_key uuid,
  p_tracking_code_hash text,
  p_customer_name text,
  p_customer_phone text,
  p_fulfillment_method text,
  p_items jsonb,
  p_client_hash text,
  p_phone_hash text,
  p_governorate text default null,
  p_city text default null,
  p_address text default null,
  p_customer_notes text default ''
)
returns table (
  order_id uuid,
  order_number bigint,
  created_at timestamptz,
  reused boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_allowed boolean;
begin
  if p_idempotency_key is null then
    raise exception using errcode = 'P0001', message = 'INVALID_SUBMISSION_KEY';
  end if;

  if p_client_hash is null or p_client_hash !~ '^[0-9a-f]{64}$'
    or p_phone_hash is null or p_phone_hash !~ '^[0-9a-f]{64}$'
  then
    raise exception using errcode = 'P0001', message = 'INVALID_RATE_LIMIT_SUBJECT';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_idempotency_key::text, 0));

  if not exists (
    select 1 from public.orders as customer_order
    where customer_order.idempotency_key = p_idempotency_key
  ) then
    select limit_result.allowed into v_allowed
    from public.consume_order_rate_limit('new-order-ip', p_client_hash) as limit_result;

    if not v_allowed then
      raise exception using errcode = 'P0001', message = 'NEW_ORDER_RATE_LIMITED';
    end if;

    select limit_result.allowed into v_allowed
    from public.consume_order_rate_limit('new-order-phone', p_phone_hash) as limit_result;

    if not v_allowed then
      raise exception using errcode = 'P0001', message = 'NEW_ORDER_RATE_LIMITED';
    end if;
  end if;

  -- This checks the original fingerprint too. A reused key with changed
  -- customer/cart data still raises SUBMISSION_KEY_CONFLICT.
  return query
  select * from public.create_customer_order(
    p_idempotency_key => p_idempotency_key,
    p_tracking_code_hash => p_tracking_code_hash,
    p_customer_name => p_customer_name,
    p_customer_phone => p_customer_phone,
    p_fulfillment_method => p_fulfillment_method,
    p_items => p_items,
    p_governorate => p_governorate,
    p_city => p_city,
    p_address => p_address,
    p_customer_notes => p_customer_notes
  );
end;
$$;

revoke all privileges
on function public.create_customer_order_guarded(uuid,text,text,text,text,jsonb,text,text,text,text,text,text)
from public, anon, authenticated;

grant execute
on function public.create_customer_order_guarded(uuid,text,text,text,text,jsonb,text,text,text,text,text,text)
to service_role;

commit;
