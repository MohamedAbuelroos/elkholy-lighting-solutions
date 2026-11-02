"use server";

import { createHash } from "node:crypto";

import { checkOrderRequestLimit } from "@/lib/orders/rate-limit";
import { isOrderStatus } from "@/lib/orders/status";
import type { OrderTrackingState } from "@/lib/orders/tracking-types";
import { createOrdersServerClient } from "@/lib/supabase/orders-server";

const INVALID_CODE_MESSAGE =
  "لم نعثر على طلب بهذا الكود. راجع الكود كاملًا وحاول مرة أخرى.";

export async function trackOrder(
  _previousState: OrderTrackingState,
  formData: FormData,
): Promise<OrderTrackingState> {
  if (process.env.ORDER_TRACKING_ENABLED !== "true") {
    return {
      error: "متابعة الطلبات غير متاحة حاليًا. تواصل مع فريق الخولي.",
      order: null,
    };
  }

  const requestLimit = await checkOrderRequestLimit("track-request");
  if (!requestLimit.allowed) {
    return { error: requestLimit.message, order: null };
  }

  const value = formData.get("tracking_code");
  if (typeof value !== "string" || value.length > 80) {
    return { error: INVALID_CODE_MESSAGE, order: null };
  }

  const canonicalCode = value.replace(/[\s-]/g, "").toUpperCase();
  if (!/^KH[0-9A-F]{24}$/.test(canonicalCode)) {
    return { error: INVALID_CODE_MESSAGE, order: null };
  }

  const trackingHash = createHash("sha256").update(canonicalCode).digest("hex");

  try {
    const supabase = createOrdersServerClient();
    const { data, error } = await supabase.rpc("get_customer_order_tracking", {
      p_tracking_code_hash: trackingHash,
    });

    if (error) {
      console.error("Failed to track customer order", { code: error.code });
      return {
        error: "تعذّر تحميل حالة الطلب. حاول مرة أخرى بعد قليل.",
        order: null,
      };
    }

    const order = data?.[0];
    if (!order) return { error: INVALID_CODE_MESSAGE, order: null };

    if (!isOrderStatus(order.status) ||
      (order.fulfillment_method !== "pickup" && order.fulfillment_method !== "delivery")) {
      console.error("Unexpected order tracking result.");
      return { error: "تعذّر عرض حالة الطلب حاليًا.", order: null };
    }

    return {
      error: null,
      order: {
        orderNumber: order.order_number,
        status: order.status,
        fulfillmentMethod: order.fulfillment_method,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      },
    };
  } catch {
    console.error("Order tracking encountered a server error.");
    return {
      error: "تعذّر تحميل حالة الطلب. حاول مرة أخرى بعد قليل.",
      order: null,
    };
  }
}
