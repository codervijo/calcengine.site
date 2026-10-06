/** Sales commission: flat rate, graduated (marginal) tiers, or whole-sale tier rate. */

export interface Tier {
  /** Upper bound of this tier in sales dollars; null = no upper bound. */
  upTo: number | null;
  pct: number;
}

export type CommissionPlan =
  | { kind: 'flat'; pct: number }
  | { kind: 'graduated'; tiers: Tier[] }
  | { kind: 'whole'; tiers: Tier[] };

export interface CommissionResult {
  commission: number;
  /** Commission after the split (your share). */
  yourCommission: number;
  totalPay: number;
  /** yourCommission / sales × 100. */
  effectivePct: number;
  /** Per-tier dollars for graduated plans. */
  perTier: { from: number; to: number | null; pct: number; amount: number }[];
}

export function commission(sales: number, plan: CommissionPlan, splitPct = 100, basePay = 0): CommissionResult {
  let total = 0;
  const perTier: CommissionResult['perTier'] = [];
  if (plan.kind === 'flat') {
    total = (sales * plan.pct) / 100;
  } else if (plan.kind === 'graduated') {
    let lower = 0;
    for (const t of plan.tiers) {
      const upper = t.upTo ?? Infinity;
      const inTier = Math.max(0, Math.min(sales, upper) - lower);
      const amount = (inTier * t.pct) / 100;
      perTier.push({ from: lower, to: t.upTo, pct: t.pct, amount });
      total += amount;
      lower = upper;
      if (sales <= upper) break;
    }
  } else {
    // Whole-sale (retroactive) tier: the rate of the tier the sales total lands in applies to everything.
    const tier = plan.tiers.find((t) => t.upTo === null || sales <= t.upTo) ?? plan.tiers[plan.tiers.length - 1];
    total = tier ? (sales * tier.pct) / 100 : 0;
  }
  const yours = (total * splitPct) / 100;
  return { commission: total, yourCommission: yours, totalPay: basePay + yours, effectivePct: sales > 0 ? (yours / sales) * 100 : 0, perTier };
}

/** Sales needed to earn `target` under a flat rate and split. Null if the rate is 0. */
export function salesForCommission(target: number, pct: number, splitPct = 100): number | null {
  const eff = (pct / 100) * (splitPct / 100);
  return eff > 0 ? target / eff : null;
}

/** Tiers must have strictly increasing upper bounds with only the last unbounded. */
export function validateTiers(tiers: Tier[]): string | null {
  if (tiers.length === 0) return 'Add at least one tier';
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (t.pct < 0) return 'Rates cannot be negative';
    if (t.upTo === null && i !== tiers.length - 1) return 'Only the last tier can be unlimited';
    if (i > 0 && t.upTo !== null && tiers[i - 1].upTo !== null && t.upTo <= (tiers[i - 1].upTo as number)) {
      return 'Tier limits must increase';
    }
  }
  return null;
}
