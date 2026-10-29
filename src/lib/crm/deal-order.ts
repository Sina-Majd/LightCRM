type OrderStorage = Pick<Storage, "getItem" | "setItem">;

function storageKey(scope: string): string {
  return `lightcrm_deals_order:${scope}`;
}

export function saveDealOrder(
  deals: readonly { id: string }[],
  scope: string,
  storage?: OrderStorage
): void {
  try {
    const store = storage ?? (typeof window !== "undefined" ? window.localStorage : null);
    store?.setItem(storageKey(scope), JSON.stringify(deals.map((deal) => deal.id)));
  } catch {
    // Ordering remains usable when browser storage is unavailable or full.
  }
}

export function orderDealsBySavedOrder<T extends { id: string }>(
  deals: readonly T[],
  scope: string,
  storage?: OrderStorage
): T[] {
  try {
    const store = storage ?? (typeof window !== "undefined" ? window.localStorage : null);
    const raw = store?.getItem(storageKey(scope));
    if (!raw) return [...deals];
    const order: unknown = JSON.parse(raw);
    if (!Array.isArray(order) || !order.every((id) => typeof id === "string")) {
      return [...deals];
    }
    const positions = new Map(order.map((id, index) => [id, index]));
    return [...deals].sort(
      (a, b) => (positions.get(a.id) ?? Infinity) - (positions.get(b.id) ?? Infinity)
    );
  } catch {
    return [...deals];
  }
}
