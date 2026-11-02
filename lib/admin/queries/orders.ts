import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { OrderStatus } from "@/lib/orders/status";

const PAGE_SIZE = 20;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type AdminOrdersInput = {
  page?: number;
  status?: OrderStatus;
  archive?: "active" | "archived" | "all";
};

export async function getAdminOrders({
  page: requestedPage = 1,
  status,
  archive = "active",
}: AdminOrdersInput = {}) {
  const { supabase } = await requireAdmin();

  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage >= 1 &&
    requestedPage <= 100000
      ? requestedPage
      : 1;

  let request = supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        customer_name,
        customer_phone,
        fulfillment_method,
        status,
        archived_at,
        created_at
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (status) {
    request = request.eq("status", status);
  }

  if (archive === "active") {
    request = request.is("archived_at", null);
  } else if (archive === "archived") {
    request = request.not("archived_at", "is", null);
  }

  const from = (page - 1) * PAGE_SIZE;

  const { data, count, error } = await request.range(
    from,
    from + PAGE_SIZE - 1,
  );

  if (error) {
    console.error("Failed to load admin orders", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل الطلبات.");
  }

  return {
    orders: data ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    hasMore: page * PAGE_SIZE < (count ?? 0),
  };
}

export async function getAdminOrderById(orderId: string) {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(orderId)) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        customer_name,
        customer_phone,
        fulfillment_method,
        governorate,
        city,
        address,
        customer_notes,
        status,
        archived_at,
        created_at,
        updated_at,
        order_items (
          id,
          product_id,
          product_name,
          product_slug,
          product_sku,
          quantity,
          original_unit_price,
          discount_percent,
          unit_price,
          line_total
        )
      `,
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load admin order", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل تفاصيل الطلب.");
  }

  return data;
}
