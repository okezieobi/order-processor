// Utility to normalize various shapes of order_total_amount_history into
// a plain array of objects with { time: string, total_amount: number }.
export type NormalizedOrderHistoryEntry = {
  time: string;
  total_amount: number;
};

export function normalizeOrderTotalAmountHistory(
  input: unknown,
): NormalizedOrderHistoryEntry[] {
  const tryParse = (val: unknown): unknown => {
    if (val !== null && typeof val === 'object') return val;
    if (typeof val !== 'string') return null;
    try {
      return JSON.parse(val);
    } catch {
      try {
        const s = val.replace(/\\"/g, '"').replace(/^"/, '').replace(/"$/, '');
        return JSON.parse(s);
      } catch {
        return null;
      }
    }
  };

  const coerceTime = (maybe: unknown): string =>
    typeof maybe === 'string' || typeof maybe === 'number' ? String(maybe) : '';

  const coerceTotal = (rec: Record<string, unknown> | undefined): number =>
    Number((rec && (rec.total_amount ?? rec.totalAmount)) ?? 0);

  let hist: unknown = input;
  if (typeof hist === 'string') {
    const p = tryParse(hist);
    hist = Array.isArray(p) ? p : [];
  }

  if (!Array.isArray(hist)) return [];

  const normalized: NormalizedOrderHistoryEntry[] = [];
  for (const it of hist) {
    let obj: unknown = it;
    if (typeof it === 'string')
      obj = tryParse(it) ?? { time: '', total_amount: 0 };

    const rec = obj as Record<string, unknown> | undefined;
    const time = coerceTime(rec?.time);
    const total_amount = coerceTotal(rec);
    normalized.push({ time, total_amount });
  }

  return normalized;
}
