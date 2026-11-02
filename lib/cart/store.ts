export type CartItem = { productId: string; quantity: number };
type AddToCartResult = "added" | "quantity-limit" | "cart-limit" | "invalid";
export const MAX_CART_ITEMS = 50;
export const MAX_CART_QUANTITY = 999;
const STORAGE_KEY = "elkholy:cart:v1";
const CHANGE_EVENT = "elkholy:cart-changed";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMPTY_SNAPSHOT = JSON.stringify({ version: 1, items: [] });
let memorySnapshot = EMPTY_SNAPSHOT;
let memoryOnly = false;

function isValidQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= MAX_CART_QUANTITY;
}

export function parseCartItems(snapshot: string): CartItem[] {
  try {
    const data: unknown = JSON.parse(snapshot);
    if (typeof data !== "object" || data === null || !("version" in data) || data.version !== 1 ||
      !("items" in data) || !Array.isArray(data.items)) return [];
    const items: CartItem[] = [];
    const seen = new Set<string>();
    for (const item of data.items) {
      if (typeof item !== "object" || item === null || !("productId" in item) ||
        typeof item.productId !== "string" || !UUID_PATTERN.test(item.productId) ||
        !("quantity" in item) || !isValidQuantity(item.quantity)) continue;
      const productId = item.productId.toLowerCase();
      if (seen.has(productId)) continue;
      seen.add(productId);
      items.push({ productId, quantity: item.quantity });
      if (items.length === MAX_CART_ITEMS) break;
    }
    return items;
  } catch { return []; }
}

function parseConsumedOrderIds(snapshot: string): string[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    if (typeof value !== "object" || value === null || !("consumedOrderIds" in value) ||
      !Array.isArray(value.consumedOrderIds)) return [];
    return [...new Set(value.consumedOrderIds.filter(
      (id): id is string => typeof id === "string" && UUID_PATTERN.test(id),
    ).map((id) => id.toLowerCase()))];
  } catch { return []; }
}

export function getCartSnapshot(): string {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  if (memoryOnly) return memorySnapshot;
  try {
    memorySnapshot = window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT;
    return memorySnapshot;
  } catch { memoryOnly = true; return memorySnapshot; }
}

export function getServerCartSnapshot(): string { return EMPTY_SNAPSHOT; }

export function subscribeToCart(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  }
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveCart(items: CartItem[], consumedOrderIds?: string[]) {
  const consumed = consumedOrderIds ?? parseConsumedOrderIds(getCartSnapshot());
  // Save the quantity change and its receipt marker in one storage write.
  memorySnapshot = JSON.stringify({ version: 1, items, consumedOrderIds: consumed });
  if (!memoryOnly) {
    try { window.localStorage.setItem(STORAGE_KEY, memorySnapshot); }
    catch { memoryOnly = true; }
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addToCart(productId: string, quantity = 1): AddToCartResult {
  if (typeof window === "undefined" || !UUID_PATTERN.test(productId) || !isValidQuantity(quantity)) return "invalid";
  const normalizedId = productId.toLowerCase();
  const items = parseCartItems(getCartSnapshot());
  const existing = items.find((item) => item.productId === normalizedId);
  if (existing) {
    if (existing.quantity + quantity > MAX_CART_QUANTITY) return "quantity-limit";
    saveCart(items.map((item) => item.productId === normalizedId ? { ...item, quantity: item.quantity + quantity } : item));
    return "added";
  }
  if (items.length >= MAX_CART_ITEMS) return "cart-limit";
  saveCart([...items, { productId: normalizedId, quantity }]);
  return "added";
}

export function setCartQuantity(productId: string, quantity: number) {
  if (typeof window === "undefined" || !isValidQuantity(quantity)) return;
  const normalizedId = productId.toLowerCase();
  const items = parseCartItems(getCartSnapshot());
  if (!items.some((item) => item.productId === normalizedId)) return;
  saveCart(items.map((item) => item.productId === normalizedId ? { ...item, quantity } : item));
}

export function removeCartItem(productId: string) {
  if (typeof window === "undefined") return;
  const normalizedId = productId.toLowerCase();
  const items = parseCartItems(getCartSnapshot());
  const nextItems = items.filter((item) => item.productId !== normalizedId);
  if (nextItems.length !== items.length) saveCart(nextItems);
}

export function clearCart() {
  if (typeof window !== "undefined") saveCart([]);
}

export function consumeCartItems(orderedItems: readonly CartItem[], orderId: string) {
  if (typeof window === "undefined" || !UUID_PATTERN.test(orderId)) return;
  const snapshot = getCartSnapshot();
  const consumedOrderIds = parseConsumedOrderIds(snapshot);
  const normalizedOrderId = orderId.toLowerCase();
  if (consumedOrderIds.includes(normalizedOrderId)) return;
  const quantities = new Map(orderedItems.map((item) => [item.productId.toLowerCase(), item.quantity]));
  const nextItems = parseCartItems(snapshot).flatMap((item) => {
    const quantity = item.quantity - (quantities.get(item.productId) ?? 0);
    return quantity > 0 ? [{ ...item, quantity }] : [];
  });
  saveCart(nextItems, [...consumedOrderIds, normalizedOrderId]);
}
