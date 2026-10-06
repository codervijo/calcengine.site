/** Weighted arithmetic mean: Σ(value × weight) / Σ(weight). */

export interface WeightedResult {
  weightedAverage: number;
  totalWeight: number;
  simpleAverage: number;
  /** Σ(value × weight). */
  weightedSum: number;
  count: number;
  /** Each row's weight as a percent of the total. */
  shares: number[];
}

export type WeightedError = 'no-rows' | 'zero-weight' | 'negative-weight';

export function weightedAverage(rows: { value: number; weight: number }[]): WeightedResult | WeightedError {
  if (rows.length === 0) return 'no-rows';
  if (rows.some((r) => r.weight < 0)) return 'negative-weight';
  const totalWeight = rows.reduce((a, r) => a + r.weight, 0);
  if (totalWeight === 0) return 'zero-weight';
  const weightedSum = rows.reduce((a, r) => a + r.value * r.weight, 0);
  return {
    weightedAverage: weightedSum / totalWeight,
    totalWeight,
    simpleAverage: rows.reduce((a, r) => a + r.value, 0) / rows.length,
    weightedSum,
    count: rows.length,
    shares: rows.map((r) => (r.weight / totalWeight) * 100),
  };
}
