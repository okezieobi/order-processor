import { normalizeOrderTotalAmountHistory } from '../../src/infrastructure/objection/utils/order-history-normalizer';

describe('normalizeOrderTotalAmountHistory', () => {
  it('returns same normalized array when given snake_case objects', () => {
    const input = [{ time: 't1', total_amount: 100 }];
    const out = normalizeOrderTotalAmountHistory(input);
    expect(out).toEqual([{ time: 't1', total_amount: 100 }]);
  });

  it('converts camelCase objects to snake_case normalized entries', () => {
    const input = [{ time: 't2', totalAmount: 200 } as any];
    const out = normalizeOrderTotalAmountHistory(input);
    expect(out).toEqual([{ time: 't2', total_amount: 200 }]);
  });

  it('parses a JSON string representing an array', () => {
    const arr = [{ time: 't3', total_amount: 300 }];
    const json = JSON.stringify(arr);
    const out = normalizeOrderTotalAmountHistory(json);
    expect(out).toEqual([{ time: 't3', total_amount: 300 }]);
  });

  it('parses array with element-level JSON strings', () => {
    const elementJson = JSON.stringify({ time: 't4', total_amount: 400 });
    const input = [elementJson];
    const out = normalizeOrderTotalAmountHistory(input);
    expect(out).toEqual([{ time: 't4', total_amount: 400 }]);
  });

  it('returns empty array for unsupported/malformed input', () => {
    const out = normalizeOrderTotalAmountHistory(12345 as any);
    expect(out).toEqual([]);
  });
});
