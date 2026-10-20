const STORAGE_KEY = "elkholy:favorites:v1";
const CHANGE_EVENT = "elkholy:favorites-changed";

const EMPTY_SNAPSHOT = JSON.stringify({
  version: 1,
  productIds: [],
});

let memorySnapshot = EMPTY_SNAPSHOT;
let memoryOnly = false;

export function parseFavoriteIds(snapshot: string): string[] {
  try {
    const data: unknown = JSON.parse(snapshot);

    if (
      typeof data !== "object" ||
      data === null ||
      !("version" in data) ||
      data.version !== 1 ||
      !("productIds" in data) ||
      !Array.isArray(data.productIds)
    ) {
      return [];
    }

    return [
      ...new Set(
        data.productIds.filter(
          (id): id is string => typeof id === "string" && id.trim().length > 0,
        ),
      ),
    ];
  } catch {
    return [];
  }
}

export function getFavoritesSnapshot(): string {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  if (memoryOnly) return memorySnapshot;

  try {
    memorySnapshot = window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT;

    return memorySnapshot;
  } catch {
    memoryOnly = true;
    return memorySnapshot;
  }
}

export function getServerFavoritesSnapshot(): string {
  return EMPTY_SNAPSHOT;
}

export function subscribeToFavorites(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      onChange();
    }
  }

  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function toggleFavorite(productId: string) {
  if (typeof window === "undefined" || !productId.trim()) return;

  const currentIds = parseFavoriteIds(getFavoritesSnapshot());

  const nextIds = currentIds.includes(productId)
    ? currentIds.filter((id) => id !== productId)
    : [...currentIds, productId];

  memorySnapshot = JSON.stringify({
    version: 1,
    productIds: nextIds,
  });

  if (!memoryOnly) {
    try {
      window.localStorage.setItem(STORAGE_KEY, memorySnapshot);
    } catch {
      // Keep favorites working in memory if storage is unavailable.
      memoryOnly = true;
    }
  }

  // The storage event only fires in other tabs.
  // This event updates components in the current tab.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
