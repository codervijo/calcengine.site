/** Shared number formatting for calculator outputs. Pure — safe to unit test. */

export function fmtMoney(n: number, currency = 'USD'): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function fmtPct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(digits)}%`;
}

export function fmtNum(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(n);
}

/** Round to cents the way payment processors report fees. */
export function roundCents(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
