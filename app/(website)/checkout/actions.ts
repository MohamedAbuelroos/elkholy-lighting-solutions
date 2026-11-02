"use server";

import { createHash, createHmac } from "node:crypto";

import type { OrderFormState } from "@/lib/orders/order-form-types";
import { createOrdersServerClient } from "@/lib/supabase/orders-server";
import { verifyOrderTurnstile } from "@/lib/security/turnstile";
import { checkOrderRequestLimit, hashOrderRateLimitValue } from "@/lib/orders/rate-limit";

type SubmittedItem = { productId: string; quantity: number };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const databaseErrors: Record<string, string> = {
  INVALID_SUBMISSION_KEY: "تعذّر التحقق من محاولة الإرسال.",
  INVALID_CUSTOMER_NAME: "اكتب اسمًا من حرفين إلى 150 حرفًا.",
  INVALID_CUSTOMER_PHONE: "اكتب رقم موبايل مصري صحيحًا.",
  INVALID_FULFILLMENT_METHOD: "اختر طريقة الاستلام.",
  INVALID_CUSTOMER_NOTES: "الملاحظات يجب ألا تتجاوز 2000 حرف.",
  INVALID_DELIVERY_ADDRESS: "أكمل المحافظة والمنطقة والعنوان بالتفصيل.",
  INVALID_CART: "بيانات السلة غير صحيحة. راجع اختياراتك.",
  INVALID_CART_SIZE: "يجب أن تحتوي السلة على منتج واحد إلى 50 منتجًا مختلفًا.",
  INVALID_CART_ITEM: "تعذّر قراءة أحد منتجات السلة.",
  INVALID_PRODUCT_ID: "أحد منتجات السلة غير صحيح. راجع اختياراتك.",
  INVALID_QUANTITY: "كمية كل منتج يجب أن تكون من 1 إلى 999.",
  DUPLICATE_CART_PRODUCT: "يوجد منتج مكرر في بيانات الطلب.",
  CART_PRODUCTS_UNAVAILABLE: "بعض المنتجات لم تعد متاحة. راجع اختياراتك قبل الإرسال.",
};

function failure(error: string, outcome: "editable-error" | "uncertain" | "not-found" | "challenge-error" = "editable-error"): OrderFormState {
  return { error, receipt: null, outcome };
}

function getText(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEgyptianPhone(value: string): string | null {
  const cleaned = value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[\s().-]/g, "");
  if (/^01[0125]\d{8}$/.test(cleaned)) return `+20${cleaned.slice(1)}`;
  if (/^201[0125]\d{8}$/.test(cleaned)) return `+${cleaned}`;
  if (/^00201[0125]\d{8}$/.test(cleaned)) return `+${cleaned.slice(2)}`;
  return /^\+201[0125]\d{8}$/.test(cleaned) ? cleaned : null;
}

function parseItems(value: string): SubmittedItem[] | null {
  if (!value || value.length > 20000) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 50) return null;
    const items: SubmittedItem[] = [];
    const seen = new Set<string>();
    for (const item of parsed) {
      if (typeof item !== "object" || item === null ||
        !("productId" in item) || typeof item.productId !== "string" || !UUID_PATTERN.test(item.productId) ||
        !("quantity" in item) || typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) return null;
      const productId = item.productId.toLowerCase();
      if (seen.has(productId)) return null;
      seen.add(productId);
      items.push({ productId, quantity: item.quantity });
    }
    return items;
  } catch { return null; }
}

function createTrackingDetails(submissionKey: string, secret: string) {
  const suffix = createHmac("sha256", secret)
    .update(`elkholy:order-tracking:v1:${submissionKey}`)
    .digest("hex").slice(0, 24).toUpperCase();
  return {
    code: `KH-${(suffix.match(/.{4}/g) ?? []).join("-")}`,
    hash: createHash("sha256").update(`KH${suffix}`).digest("hex"),
  };
}

export async function recoverOrderSubmission(submissionKey: string): Promise<OrderFormState> {
  if (process.env.ORDER_SUBMISSIONS_ENABLED !== "true") {
    return failure("التحقق من الطلب غير متاح حاليًا. احتفظ بهذه المحاولة وحاول لاحقًا.", "uncertain");
  }
  const requestLimit = await checkOrderRequestLimit("recover-request");
  if (!requestLimit.allowed) return failure(requestLimit.message, "uncertain");

  if (typeof submissionKey !== "string" || !UUID_PATTERN.test(submissionKey)) {
    return failure("تعذّر التحقق من معرّف المحاولة المحفوظة.", "uncertain");
  }
  const secret = process.env.ORDER_TRACKING_SECRET;
  if (!secret || secret.length < 32) {
    console.error("Order tracking configuration is missing.");
    return failure("تعذّر التحقق من الطلب حاليًا.", "uncertain");
  }
  const tracking = createTrackingDetails(submissionKey.toLowerCase(), secret);
  try {
    const supabase = createOrdersServerClient();
    const { data, error } = await supabase.rpc("recover_customer_order_submission", {
      p_idempotency_key: submissionKey.toLowerCase(),
      p_tracking_code_hash: tracking.hash,
    });
    if (error) {
      console.error("Failed to recover order submission", { code: error.code });
      return failure("تعذّر التأكد من نتيجة الطلب. احتفظ بالمحاولة وحاول مرة أخرى.", "uncertain");
    }
    const receipt = data?.[0];
    if (!receipt) {
      return failure("لم نجد طلبًا محفوظًا لهذه المحاولة حتى الآن. يمكنك استكمال نفس الطلب بأمان باستخدام بياناته المحفوظة.", "not-found");
    }
    return { outcome: "success", error: null, receipt: {
      orderId: receipt.order_id, orderNumber: String(receipt.order_number),
      trackingCode: tracking.code, createdAt: receipt.created_at,
    } };
  } catch {
    console.error("Order recovery encountered a server error.");
    return failure("تعذّر التأكد من نتيجة الطلب. حاول مرة أخرى بعد قليل.", "uncertain");
  }
}

export async function submitOrder(_previousState: OrderFormState, formData: FormData): Promise<OrderFormState> {
  // This gate remains closed in production until abuse protection is added.
  if (process.env.ORDER_SUBMISSIONS_ENABLED !== "true") {
    return failure("إرسال الطلبات غير متاح حاليًا. تواصل مع فريق الخولي.", "uncertain");
  }
  const requestLimit = await checkOrderRequestLimit("submit-request");
  if (!requestLimit.allowed) return failure(requestLimit.message, "uncertain");

  const trackingSecret = process.env.ORDER_TRACKING_SECRET;
  if (!trackingSecret || trackingSecret.length < 32) {
    console.error("Order tracking configuration is missing.");
    return failure("تعذّر إرسال الطلب حاليًا. حاول مرة أخرى لاحقًا.", "uncertain");
  }
  const submissionKey = getText(formData, "submission_key").toLowerCase();
  if (!UUID_PATTERN.test(submissionKey)) return failure("تعذّر التحقق من محاولة الإرسال.");
  const customerName = getText(formData, "customer_name");
  const phoneText = getText(formData, "customer_phone");
  const fulfillmentMethod = getText(formData, "fulfillment_method");
  const governorate = getText(formData, "governorate");
  const city = getText(formData, "city");
  const address = getText(formData, "address");
  const notes = getText(formData, "customer_notes");
  if (customerName.length < 2 || customerName.length > 150) return failure(databaseErrors.INVALID_CUSTOMER_NAME);
  if (phoneText.length > 40) return failure(databaseErrors.INVALID_CUSTOMER_PHONE);
  const customerPhone = normalizeEgyptianPhone(phoneText);
  if (!customerPhone) return failure(databaseErrors.INVALID_CUSTOMER_PHONE);
  if (fulfillmentMethod !== "pickup" && fulfillmentMethod !== "delivery") return failure(databaseErrors.INVALID_FULFILLMENT_METHOD);
  if (fulfillmentMethod === "delivery" && (!governorate || governorate.length > 100 ||
    !city || city.length > 150 || address.length < 5 || address.length > 1000)) {
    return failure(databaseErrors.INVALID_DELIVERY_ADDRESS);
  }
  if (notes.length > 2000) return failure(databaseErrors.INVALID_CUSTOMER_NOTES);
  const items = parseItems(getText(formData, "items"));
  if (!items) return failure("راجع منتجات الطلب والكميات، ثم حاول مرة أخرى.");
  const tracking = createTrackingDetails(submissionKey, trackingSecret);
  try {
    const supabase = createOrdersServerClient();
    // A saved submission does not need a fresh challenge. Still call the
    // original guarded operation below to check its request fingerprint.
    const { data: existing, error: lookupError } = await supabase.rpc(
      "recover_customer_order_submission",
      {
        p_idempotency_key: submissionKey,
        p_tracking_code_hash: tracking.hash,
      },
    );

    if (lookupError) {
      console.error("Pre-submission recovery check failed", { code: lookupError.code });
      return failure("تعذّر التأكد من نتيجة المحاولة السابقة. استخدم التحقق من نتيجة الطلب ثم حاول مرة أخرى.", "uncertain");
    }

    if (!existing?.[0]) {
      const verification = await verifyOrderTurnstile(formData.get("turnstile_token"));
      if (!verification.ok) {
        return failure(
          verification.reason === "challenge"
            ? "لم يكتمل التحقق أو انتهت صلاحيته. أعد التحقق ثم أرسل نفس المحاولة."
            : "تعذّر إكمال التحقق حاليًا. بيانات المحاولة محفوظة؛ حاول مرة أخرى بعد قليل.",
          "challenge-error",
        );
      }
    }

    const { data, error } = await supabase.rpc("create_customer_order_guarded", {
      p_idempotency_key: submissionKey,
      p_tracking_code_hash: tracking.hash,
      p_customer_name: customerName,
      p_customer_phone: customerPhone,
      p_fulfillment_method: fulfillmentMethod,
      p_items: items,
      p_client_hash: requestLimit.clientHash,
      p_phone_hash: hashOrderRateLimitValue("phone", customerPhone),
      p_customer_notes: notes,
      ...(fulfillmentMethod === "delivery" ? {
        p_governorate: governorate, p_city: city, p_address: address,
      } : {}),
    });
    if (error) {
      // Only known, transactional validation failures unlock editing.
      // Conflicts and all ambiguous failures retain the original key.
      if (error.code === "P0001" && error.message === "NEW_ORDER_RATE_LIMITED") {
        return failure("وصلت للحد المؤقت لإنشاء طلبات جديدة. انتظر 15 دقيقة قبل المحاولة. لو كنت أرسلت الطلب بالفعل، استخدم التحقق من نتيجة المحاولة.", "uncertain");
      }

      const friendly = error.code === "P0001" &&
        Object.prototype.hasOwnProperty.call(databaseErrors, error.message)
        ? databaseErrors[error.message] : undefined;
      if (friendly) return failure(friendly);
      if (error.message === "SUBMISSION_KEY_CONFLICT") {
        return failure("بيانات المحاولة لا تطابق الطلب المسجّل. تحقّق من نتيجة الطلب بدل بدء محاولة جديدة.", "uncertain");
      }
      console.error("Failed to submit order", { code: error.code });
      return failure("تعذّر تأكيد حفظ الطلب. تحقّق من نتيجته أو أعد إرسال نفس المحاولة.", "uncertain");
    }
    const receipt = data?.[0];
    if (!receipt) return failure("تعذّر تأكيد حفظ الطلب. تحقّق من نتيجته.", "uncertain");
    return { outcome: "success", error: null, receipt: {
      orderId: receipt.order_id, orderNumber: String(receipt.order_number),
      trackingCode: tracking.code, createdAt: receipt.created_at,
    } };
  } catch {
    console.error("Order submission encountered a server error.");
    return failure("انقطع تأكيد الطلب. احتفظ بالمحاولة وتحقّق من نتيجتها.", "uncertain");
  }
}
