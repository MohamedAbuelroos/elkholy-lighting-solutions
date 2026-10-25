"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getFavoritesSnapshot,
  getServerFavoritesSnapshot,
  parseFavoriteIds,
  subscribeToFavorites,
  toggleFavorite,
} from "@/lib/favorites/store";

export function useFavorites() {
  const snapshot = useSyncExternalStore(
    subscribeToFavorites,
    getFavoritesSnapshot,
    getServerFavoritesSnapshot,
  );

  const favoriteIds = useMemo(() => parseFavoriteIds(snapshot), [snapshot]);

  return {
    favoriteIds,
    count: favoriteIds.length,
    toggleFavorite,
  };
}
