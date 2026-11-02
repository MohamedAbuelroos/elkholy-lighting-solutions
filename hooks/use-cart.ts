"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  addToCart,
  clearCart,
  getCartSnapshot,
  getServerCartSnapshot,
  parseCartItems,
  removeCartItem,
  setCartQuantity,
  subscribeToCart,
} from "@/lib/cart/store";

export function useCart() {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const items = useMemo(() => parseCartItems(snapshot), [snapshot]);

  return {
    items,
    count: items.length,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
    addToCart,
    setCartQuantity,
    removeCartItem,
    clearCart,
  };
}
