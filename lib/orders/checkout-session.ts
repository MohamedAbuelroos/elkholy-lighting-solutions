import type { CartItem } from "@/lib/cart/store";
import type { OrderReceipt } from "@/lib/orders/order-form-types";

export type CheckoutFields = {
  customer_name: string;
  customer_phone: string;
  fulfillment_method: "pickup" | "delivery";
  governorate: string;
  city: string;
  address: string;
  customer_notes: string;
};

export const emptyCheckoutFields: CheckoutFields = {
  customer_name: "",
  customer_phone: "",
  fulfillment_method: "pickup",
  governorate: "",
  city: "",
  address: "",
  customer_notes: "",
};

export type CheckoutAttempt = {
  key: string;
  fields: CheckoutFields;
  items: CartItem[];
  isDirectOrder: boolean;
};

export type SavedCheckout =
  | { version: 1; phase: "pending"; attempt: CheckoutAttempt }
  | {
      version: 1;
      phase: "success";
      receipt: OrderReceipt;
      items: CartItem[];
      isDirectOrder: boolean;
    };

// Keep development and production receipts separate on localhost.
const STORAGE_KEY = `elkholy:checkout:v1:${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "unconfigured"}`;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCartItems(value: unknown): value is CartItem[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 50) return false;
  const seen = new Set<string>();
  return value.every((item: unknown) => {
    if (!isRecord(item) || typeof item.productId !== "string" ||
      !UUID_PATTERN.test(item.productId) || typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) return false;
    const id = item.productId.toLowerCase();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function isFields(value: unknown): value is CheckoutFields {
  if (!isRecord(value)) return false;
  const limits = {
    customer_name: 150, customer_phone: 40, governorate: 100,
    city: 150, address: 1000, customer_notes: 2000,
  };
  return (value.fulfillment_method === "pickup" || value.fulfillment_method === "delivery") &&
    Object.entries(limits).every(([key, limit]) =>
      typeof value[key] === "string" && value[key].length <= limit);
}

function isReceipt(value: unknown): value is OrderReceipt {
  return isRecord(value) &&
    typeof value.orderId === "string" && UUID_PATTERN.test(value.orderId) &&
    typeof value.orderNumber === "string" && /^\d+$/.test(value.orderNumber) &&
    typeof value.trackingCode === "string" && /^KH(?:-[0-9A-F]{4}){6}$/.test(value.trackingCode) &&
    typeof value.createdAt === "string" && Number.isFinite(Date.parse(value.createdAt));
}

// Throws if browser storage is blocked or corrupted. Never silently
// discard a pending submission and create a new key instead.
export function readSavedCheckout(): SavedCheckout | null {
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  if (raw.length > 50000) throw new Error("Invalid checkout session.");
  const value: unknown = JSON.parse(raw);
  if (!isRecord(value) || value.version !== 1) throw new Error("Invalid checkout session.");

  if (value.phase === "pending" && isRecord(value.attempt)) {
    const attempt = value.attempt;
    if (typeof attempt.key === "string" && UUID_PATTERN.test(attempt.key) &&
      isFields(attempt.fields) && isCartItems(attempt.items) &&
      typeof attempt.isDirectOrder === "boolean") {
      return { version: 1, phase: "pending", attempt: {
        key: attempt.key, fields: attempt.fields,
        items: attempt.items, isDirectOrder: attempt.isDirectOrder,
      } };
    }
  }

  if (value.phase === "success" && isReceipt(value.receipt) &&
    isCartItems(value.items) && typeof value.isDirectOrder === "boolean") {
    return { version: 1, phase: "success", receipt: value.receipt,
      items: value.items, isDirectOrder: value.isDirectOrder };
  }

  throw new Error("Invalid checkout session.");
}

export function saveCheckout(value: SavedCheckout) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function clearSavedCheckout() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function attemptToFormData(attempt: CheckoutAttempt): FormData {
  const data = new FormData();
  for (const [name, value] of Object.entries(attempt.fields)) data.set(name, value);
  data.set("submission_key", attempt.key);
  data.set("items", JSON.stringify(attempt.items));
  return data;
}
