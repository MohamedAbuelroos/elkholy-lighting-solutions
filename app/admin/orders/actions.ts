"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { OrderStatusFormState } from "@/lib/admin/order-form-types";
import { isOrderStatus } from "@/lib/orders/status";
import type { OrderArchiveFormState } from "@/lib/admin/order-form-types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function updateOrderStatus(
  orderId: string,
  expectedStatus: string,
  _previousState: OrderStatusFormState,
  formData: FormData,
): Promise<OrderStatusFormState> {
  const { supabase } = await requireAdmin();
  const statusValue = formData.get("status");
  const newStatus = typeof statusValue === "string" ? statusValue : "";
  const reasonValue = formData.get("reason");
  const reason = typeof reasonValue === "string" ? reasonValue.trim() : "";

  if (
    !UUID_PATTERN.test(orderId) ||
    !isOrderStatus(expectedStatus) ||
    !isOrderStatus(newStatus)
  ) {
    return { error: "بيانات تغيير الحالة غير صحيحة.", success: null };
  }

  const requiresReason =
    newStatus === "cancelled" ||
    (expectedStatus === "cancelled" && newStatus === "new");

  if (reason.length > 1000 || (requiresReason && reason.length < 5)) {
    return { error: "اكتب سببًا واضحًا من 5 إلى 1000 حرف.", success: null };
  }

  const { error } = await supabase.rpc("update_customer_order_status", {
    p_order_id: orderId,
    p_expected_status: expectedStatus,
    p_new_status: newStatus,
    p_reason: reason,
  });

  if (error) {
    const messages: Record<string, string> = {
      ORDER_STATUS_CHANGED:
        "الحالة اتغيّرت بالفعل. راجع الحالة الحالية ثم حاول مرة أخرى.",
      INVALID_STATUS_TRANSITION: "الانتقال للحالة المختارة غير متاح.",
      ORDER_NOT_FOUND: "الطلب لم يعد موجودًا.",
      ORDER_ARCHIVED: "استرجع الطلب من الأرشيف أولًا قبل تغيير حالته.",
      ORDER_REASON_REQUIRED: "اكتب سببًا واضحًا من 5 إلى 1000 حرف.",
      ORDER_REASON_TOO_LONG: "السبب يجب ألا يتجاوز 1000 حرف.",
      OWNER_ACCESS_REQUIRED: "إعادة فتح الطلب متاحة للمدير الرئيسي فقط.",
      ADMIN_ACCESS_REQUIRED: "ليس لديك صلاحية إدارة الطلبات حاليًا.",
    };

    if (
      error.message === "ORDER_STATUS_CHANGED" ||
      error.message === "ORDER_ARCHIVED"
    ) {
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath("/admin/orders");
    }

    const knownMessage = Object.prototype.hasOwnProperty.call(
      messages,
      error.message,
    )
      ? messages[error.message]
      : null;

    if (!knownMessage) {
      console.error("Failed to update order status", { code: error.code });
    }

    return {
      error:
        knownMessage ??
        "تعذّر تأكيد تحديث الحالة. حدّث الصفحة للتأكد من آخر حالة قبل المحاولة مجددًا.",
      success: null,
    };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");

  return {
    error: null,
    success:
      newStatus === "cancelled"
        ? "تم إلغاء الطلب وتسجيل السبب."
        : expectedStatus === "cancelled" && newStatus === "new"
          ? "تمت إعادة فتح الطلب للمراجعة وتسجيل السبب."
          : "تم تحديث حالة الطلب.",
  };
}

export async function setOrderArchived(
  orderId: string,
  expectedArchived: boolean,
  _previousState: OrderArchiveFormState,
  formData: FormData,
): Promise<OrderArchiveFormState> {
  const { supabase } = await requireAdmin();

  const value = formData.get("archived");

  if (
    !UUID_PATTERN.test(orderId) ||
    typeof expectedArchived !== "boolean" ||
    (value !== "true" && value !== "false")
  ) {
    return {
      error: "بيانات الأرشفة غير صحيحة.",
      success: null,
    };
  }

  const archived = value === "true";

  const { error } = await supabase.rpc("set_customer_order_archived", {
    p_order_id: orderId,
    p_expected_archived: expectedArchived,
    p_archived: archived,
  });

  if (error) {
    if (error.message === "ORDER_ARCHIVE_CHANGED") {
      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);

      return {
        error: "حالة الأرشفة اتغيّرت بالفعل. راجع البيانات الحالية.",
        success: null,
      };
    }

    if (error.message === "ORDER_NOT_TERMINAL") {
      return {
        error: "يمكن أرشفة الطلب المكتمل أو الملغي فقط.",
        success: null,
      };
    }

    if (error.message === "ORDER_NOT_FOUND") {
      return {
        error: "الطلب لم يعد موجودًا.",
        success: null,
      };
    }

    console.error("Failed to update order archive", {
      code: error.code,
    });

    return {
      error: "تعذّر تحديث الأرشفة. حدّث الصفحة وتأكد من النتيجة.",
      success: null,
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return {
    error: null,
    success: archived
      ? "تمت أرشفة الطلب."
      : "تمت إعادة الطلب للقائمة الأساسية.",
  };
}
