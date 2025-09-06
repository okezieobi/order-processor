// Utility to normalize various shapes of order_total_amount_history into
// a plain array of objects with { time: string, total_amount: number }.
export function normalizeOrderTotalAmountHistory(input: any): Array<{ time: string; total_amount: number }> {
  const tryParse = (val: any) => {
    if (val && typeof val === 'object') return val;
    if (typeof val !== 'string') return null;
    try {
      return JSON.parse(val);
    } catch {
      try {
        const unescaped = val.replace(/\\"/g, '"').replace(/^"/, '').replace(/"$/, '');
        return JSON.parse(unescaped);
      } catch {
        return null;
      }
    }
  };

  let hist: any = input;
  if (typeof hist === 'string') {
    const p = tryParse(hist);
    hist = Array.isArray(p) ? p : [];
  }

  if (!Array.isArray(hist)) return [];

  const normalized: Array<{ time: string; total_amount: number }> = [];
  for (const it of hist) {
    let obj: any = it;
    if (typeof it === 'string') {
      const p = tryParse(it);
      obj = p || { time: '', total_amount: 0 };
    }

    // Accept both camelCase and snake_case incoming shapes
    if (obj && obj.totalAmount !== undefined && obj.total_amount === undefined) {
      obj = { time: obj.time, total_amount: Number(obj.totalAmount) };
    }

    if (obj && obj.total_amount !== undefined) {
      normalized.push({ time: String(obj.time), total_amount: Number(obj.total_amount) });
    } else {
      normalized.push({ time: String((obj && obj.time) || ''), total_amount: Number((obj && (obj.total_amount ?? obj.totalAmount)) || 0) });
    }
  }

  return normalized;
}
