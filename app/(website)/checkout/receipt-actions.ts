"use server";

import { createHash } from "node:crypto";

import { checkOrderRequestLimit } from "@/lib/orders/rate-limit";
import { getOrderStatusLabel, isOrderStatus } from "@/lib/orders/status";
import type { CustomerReceiptResult } from "@/lib/orders/receipt-types";
import { createOrdersServerClient } from "@/lib/supabase/orders-server";

export async function loadCustomerReceipt(
  trackingCode: string,
): Promise<CustomerReceiptResult> {
  if (process.env.ORDER_TRACKING_ENABLED !== "true") {
    return {
      receipt: null,
      error: "تحميل إيصال الطلب غير متاح حاليًا.",
    };
  }

  const limit = await checkOrderRequestLimit("track-request");

  if (!limit.allowed) {
    return { receipt: null, error: limit.message };
  }

  if (typeof trackingCode !== "string" || trackingCode.length > 80) {
    return { receipt: null, error: "تعذّر التحقق من كود الطلب." };
  }

  const canonicalCode = trackingCode.replace(/[\s-]/g, "").toUpperCase();

  if (!/^KH[0-9A-F]{24}$/.test(canonicalCode)) {
    return { receipt: null, error: "تعذّر التحقق من كود الطلب." };
  }

  const trackingHash = createHash("sha256").update(canonicalCode).digest("hex");

  try {
    const supabase = createOrdersServerClient();

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        order_number,
        created_at,
        status,
        customer_name,
        customer_phone,
        fulfillment_method,
        governorate,
        city,
        address,
        customer_notes,
        order_items (
          id,
          product_name,
          product_sku,
          quantity,
          original_unit_price,
          discount_percent,
          unit_price,
          line_total
        )
      `,
      )
      .eq("tracking_code_hash", trackingHash)
      .maybeSingle();

    if (error) {
      console.error("Failed to load customer receipt", {
        code: error.code,
      });

      return {
        receipt: null,
        error: "تعذّر تحميل الإيصال. حاول مرة أخرى بعد قليل.",
      };
    }

    if (!data) {
      return {
        receipt: null,
        error: "لم نعثر على طلب بهذا الكود.",
      };
    }

    if (
      !isOrderStatus(data.status) ||
      (data.fulfillment_method !== "pickup" &&
        data.fulfillment_method !== "delivery")
    ) {
      return {
        receipt: null,
        error: "تعذّر عرض بيانات الإيصال حاليًا.",
      };
    }

    return {
      error: null,
      receipt: {
        orderNumber: String(data.order_number),
        createdAt: data.created_at,
        statusLabel: getOrderStatusLabel(data.status),
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        fulfillmentMethod: data.fulfillment_method,
        governorate: data.governorate,
        city: data.city,
        address: data.address,
        customerNotes: data.customer_notes,
        items: [...data.order_items].sort((first, second) =>
          first.id.localeCompare(second.id),
        ),
      },
    };
  } catch {
    console.error("Customer receipt encountered a server error.");

    return {
      receipt: null,
      error: "تعذّر تحميل الإيصال. حاول مرة أخرى بعد قليل.",
    };
  }
}
