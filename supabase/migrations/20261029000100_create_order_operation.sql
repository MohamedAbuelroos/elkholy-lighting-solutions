begin;

create function public.create_customer_order(
  p_idempotency_key uuid,
  p_tracking_code_hash text,
  p_customer_name text,
  p_customer_phone text,
  p_fulfillment_method text,
  p_items jsonb,
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
  v_customer_name text;
  v_customer_phone text;
  v_governorate text;
  v_city text;
  v_address text;
  v_customer_notes text;

  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_seen_ids uuid[] := array[]::uuid[];

  v_normalized_items jsonb := '[]'::jsonb;
  v_snapshots jsonb;

  v_request_hash text;
  v_existing public.orders%rowtype;
  v_order public.orders%rowtype;
begin
  -- ===================================================
  -- Validate submission identifiers
  -- ===================================================

  if p_idempotency_key is null then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_SUBMISSION_KEY';
  end if;

  if p_tracking_code_hash is null
    or p_tracking_code_hash !~ '^[0-9a-f]{64}$'
  then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_TRACKING_HASH';
  end if;

  -- ===================================================
  -- Normalize and validate customer information
  -- ===================================================

  v_customer_name := btrim(coalesce(p_customer_name, ''));
  v_customer_phone := btrim(coalesce(p_customer_phone, ''));
  v_customer_notes := btrim(coalesce(p_customer_notes, ''));

  if length(v_customer_name) not between 2 and 150 then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_CUSTOMER_NAME';
  end if;

  if v_customer_phone !~ '^\+201[0125][0-9]{8}$' then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_CUSTOMER_PHONE';
  end if;

  if p_fulfillment_method is null
    or p_fulfillment_method not in ('pickup', 'delivery')
  then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_FULFILLMENT_METHOD';
  end if;

  if length(v_customer_notes) > 2000 then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_CUSTOMER_NOTES';
  end if;

  if p_fulfillment_method = 'delivery' then
    v_governorate := nullif(btrim(p_governorate), '');
    v_city := nullif(btrim(p_city), '');
    v_address := nullif(btrim(p_address), '');

    if v_governorate is null
      or length(v_governorate) > 100
      or v_city is null
      or length(v_city) > 150
      or v_address is null
      or length(v_address) not between 5 and 1000
    then
      raise exception using
        errcode = 'P0001',
        message = 'INVALID_DELIVERY_ADDRESS';
    end if;
  else
    -- Do not retain an address for showroom pickup.
    v_governorate := null;
    v_city := null;
    v_address := null;
  end if;

  -- ===================================================
  -- Validate cart items
  -- ===================================================

  if p_items is null
    or jsonb_typeof(p_items) <> 'array'
  then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_CART';
  end if;

  if jsonb_array_length(p_items) not between 1 and 50 then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_CART_SIZE';
  end if;

  for v_item in
    select value
    from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item) <> 'object' then
      raise exception using
        errcode = 'P0001',
        message = 'INVALID_CART_ITEM';
    end if;

    if jsonb_typeof(v_item -> 'productId')
      is distinct from 'string'
    then
      raise exception using
        errcode = 'P0001',
        message = 'INVALID_PRODUCT_ID';
    end if;

    if (v_item ->> 'productId')
      !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then
      raise exception using
        errcode = 'P0001',
        message = 'INVALID_PRODUCT_ID';
    end if;

    if jsonb_typeof(v_item -> 'quantity')
      is distinct from 'number'
    then
      raise exception using
        errcode = 'P0001',
        message = 'INVALID_QUANTITY';
    end if;

    if (v_item ->> 'quantity') !~ '^[1-9][0-9]{0,2}$' then
      raise exception using
        errcode = 'P0001',
        message = 'INVALID_QUANTITY';
    end if;

    v_product_id := (v_item ->> 'productId')::uuid;
    v_quantity := (v_item ->> 'quantity')::integer;

    if v_product_id = any(v_seen_ids) then
      raise exception using
        errcode = 'P0001',
        message = 'DUPLICATE_CART_PRODUCT';
    end if;

    v_seen_ids := array_append(v_seen_ids, v_product_id);

    v_normalized_items :=
      v_normalized_items || jsonb_build_array(
        jsonb_build_object(
          'productId', v_product_id,
          'quantity', v_quantity
        )
      );
  end loop;

  -- Item ordering must not change the submission fingerprint.
  select jsonb_agg(item.value order by item.value ->> 'productId')
  into v_normalized_items
  from jsonb_array_elements(v_normalized_items) as item(value);

  -- ===================================================
  -- Idempotency
  -- ===================================================

  v_request_hash := encode(
    sha256(
      convert_to(
        jsonb_build_object(
          'customerName', v_customer_name,
          'customerPhone', v_customer_phone,
          'fulfillmentMethod', p_fulfillment_method,
          'governorate', v_governorate,
          'city', v_city,
          'address', v_address,
          'notes', v_customer_notes,
          'items', v_normalized_items
        )::text,
        'UTF8'
      )
    ),
    'hex'
  );

  -- Serialize requests that use the same submission key.
  perform pg_advisory_xact_lock(
    hashtextextended(p_idempotency_key::text, 0)
  );

  select existing_order.*
  into v_existing
  from public.orders as existing_order
  where existing_order.idempotency_key = p_idempotency_key;

  if found then
    if v_existing.request_hash <> v_request_hash
      or v_existing.tracking_code_hash <> p_tracking_code_hash
    then
      raise exception using
        errcode = 'P0001',
        message = 'SUBMISSION_KEY_CONFLICT';
    end if;

    return query
    select
      v_existing.id,
      v_existing.order_number,
      v_existing.created_at,
      true;

    return;
  end if;

  -- ===================================================
  -- Read a single current snapshot of available products.
  -- Client-supplied names or prices are never used.
  -- ===================================================

  select jsonb_agg(
    jsonb_build_object(
      'product_id', product.id,
      'product_name', product.name_ar,
      'product_slug', product.slug,
      'product_sku', product.sku,
      'quantity', (item.value ->> 'quantity')::integer,
      'original_unit_price', product.price,
      'discount_percent', product.discount_percent,
      'unit_price', product.sale_price
    )
    order by product.id
  )
  into v_snapshots
  from jsonb_array_elements(v_normalized_items) as item(value)
  join public.products as product
    on product.id = (item.value ->> 'productId')::uuid
  where product.is_active = true
    and app_private.is_category_visible(product.category_id);

  if coalesce(jsonb_array_length(v_snapshots), 0)
    <> jsonb_array_length(v_normalized_items)
  then
    raise exception using
      errcode = 'P0001',
      message = 'CART_PRODUCTS_UNAVAILABLE';
  end if;

  -- ===================================================
  -- Save the order and its items in the same transaction.
  -- ===================================================

  insert into public.orders (
    idempotency_key,
    request_hash,
    tracking_code_hash,
    customer_name,
    customer_phone,
    fulfillment_method,
    governorate,
    city,
    address,
    customer_notes
  )
  values (
    p_idempotency_key,
    v_request_hash,
    p_tracking_code_hash,
    v_customer_name,
    v_customer_phone,
    p_fulfillment_method,
    v_governorate,
    v_city,
    v_address,
    v_customer_notes
  )
  returning * into v_order;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    product_slug,
    product_sku,
    quantity,
    original_unit_price,
    discount_percent,
    unit_price
  )
  select
    v_order.id,
    snapshot.product_id,
    snapshot.product_name,
    snapshot.product_slug,
    snapshot.product_sku,
    snapshot.quantity,
    snapshot.original_unit_price,
    snapshot.discount_percent,
    snapshot.unit_price
  from jsonb_to_recordset(v_snapshots) as snapshot(
    product_id uuid,
    product_name text,
    product_slug text,
    product_sku text,
    quantity integer,
    original_unit_price numeric,
    discount_percent smallint,
    unit_price numeric
  );

  return query
  select
    v_order.id,
    v_order.order_number,
    v_order.created_at,
    false;
end;
$$;

-- Public callers and admin sessions cannot execute this function.
revoke all privileges
on function public.create_customer_order(
  uuid, text, text, text, text, jsonb, text, text, text, text
)
from public, anon, authenticated;

-- Only the server-side secret client may execute it.
grant execute
on function public.create_customer_order(
  uuid, text, text, text, text, jsonb, text, text, text, text
)
to service_role;

commit;