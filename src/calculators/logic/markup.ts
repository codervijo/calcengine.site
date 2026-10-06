/** Markup ↔ margin ↔ price, solved from cost plus any one of the three. */

export type MarkupSolveFrom = 'markup' | 'margin' | 'price';

export interface MarkupResult {
  cost: number;
  price: number;
  profit: number;
  /** (price − cost) / cost × 100. Null when cost is 0. */
  markupPct: number | null;
  /** (price − cost) / price × 100. */
  marginPct: number;
}

export type MarkupError = 'margin-too-high' | 'price-not-positive' | 'cost-negative';

export function solveMarkup(cost: number, from: MarkupSolveFrom, value: number): MarkupResult | MarkupError {
  if (cost < 0) return 'cost-negative';
  let price: number;
  if (from === 'markup') price = cost * (1 + value / 100);
  else if (from === 'margin') {
    if (value >= 100) return 'margin-too-high';
    price = cost / (1 - value / 100);
  } else price = value;
  if (price <= 0) return 'price-not-positive';
  const profit = price - cost;
  return { cost, price, profit, markupPct: cost > 0 ? (profit / cost) * 100 : null, marginPct: (profit / price) * 100 };
}

export const markupToMargin = (m: number) => (m / (100 + m)) * 100;
export const marginToMarkup = (g: number) => (g >= 100 ? Infinity : (g / (100 - g)) * 100);
