import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAdminOrderContext(orderId: string) {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(orderId)) {
    throw new Error("معرّف الطلب غير صحيح.");
  }

  const [ownerResult, historyResult] = await Promise.all([
    supabase.rpc("current_user_is_owner"),
    supabase
      .from("order_status_events")
      .select("id, previous_status, new_status, reason, created_at")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(100),
  ]);

  if (ownerResult.error || historyResult.error) {
    console.error("Failed to load order permissions or history", {
      ownerCode: ownerResult.error?.code,
      historyCode: historyResult.error?.code,
    });
    throw new Error("تعذّر تحميل صلاحيات الطلب أو سجل حالاته.");
  }

  return {
    isOwner: ownerResult.data === true,
    history: historyResult.data ?? [],
  };
}

export type OrderStatusHistoryEvent =
  Awaited<ReturnType<typeof getAdminOrderContext>>["history"][number];
