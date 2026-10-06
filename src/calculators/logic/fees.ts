/**
 * Percentage + fixed processing-fee math shared by the PayPal, Stripe and Etsy
 * calculators. Rates come from src/data/fees/*.json — never hardcode them here.
 */
import { roundCents } from '../primitives/format';

export interface FeeRate {
  /** Percent of the amount, e.g. 3.49 for 3.49%. */
  pct: number;
  /** Fixed fee per transaction, in the account currency. */
  fixed: number;
  /** Optional maximum fee (e.g. ACH caps). */
  cap?: number;
}

/** Fee charged on `amount`, rounded to cents. */
export function feeOn(amount: number, r: FeeRate): number {
  if (amount <= 0) return 0;
  const raw = (amount * r.pct) / 100 + r.fixed;
  return roundCents(r.cap !== undefined ? Math.min(raw, r.cap) : raw);
}

export interface FeeBreakdown {
  amount: number;
  fee: number;
  net: number;
  /** Fee as a percent of the amount. */
  effectivePct: number;
}

export function feeBreakdown(amount: number, r: FeeRate): FeeBreakdown {
  const fee = feeOn(amount, r);
  return { amount, fee, net: roundCents(amount - fee), effectivePct: amount > 0 ? (fee / amount) * 100 : 0 };
}

/**
 * Smallest amount (in cents) to charge so that `amount − fee ≥ targetNet`.
 * Returns null when no amount works (percentage ≥ 100%).
 */
export function grossForNet(targetNet: number, r: FeeRate): number | null {
  if (targetNet <= 0) return 0;
  if (r.pct >= 100) return null;
  let gross = (targetNet + r.fixed) / (1 - r.pct / 100);
  if (r.cap !== undefined && (gross * r.pct) / 100 + r.fixed > r.cap) gross = targetNet + r.cap;
  // Round up to the cent, then step up while per-cent fee rounding leaves us short.
  let cents = Math.ceil(roundCents(gross) * 100 - 1e-9);
  for (let i = 0; i < 5 && cents / 100 - feeOn(cents / 100, r) < targetNet - 1e-9; i++) cents++;
  return cents / 100;
}
