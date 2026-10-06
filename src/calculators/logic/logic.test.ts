import { describe, it, expect } from 'vitest';
import { feeOn, feeBreakdown, grossForNet } from './fees';
import { etsyFees } from './etsy';
import { solveMarkup, markupToMargin, marginToMarkup, type MarkupResult } from './markup';
import { commission, salesForCommission, validateTiers } from './commission';
import { plateCost, periodFoodCost } from './food-cost';
import { weightedAverage, type WeightedResult } from './weighted-average';
import { ampsFromWatts, wattsFromAmps, ampsFromVA, inputWattsFromHp } from './electrical';
import { energyCost } from './energy-cost';
import { sizeWire, voltageDrop, defaultTempRating, type SizeRow } from './wire-size';
import paypal from '../../data/fees/paypal.json';
import stripe from '../../data/fees/stripe.json';
import etsy from '../../data/fees/etsy.json';
import conductors from '../../data/electrical/conductors.json';

describe('fees', () => {
  it('PayPal Checkout 3.49% + $0.49 on $100', () => {
    const r = paypal.rates.find((x) => x.id === 'checkout')!;
    expect(feeBreakdown(100, r)).toMatchObject({ fee: 3.98, net: 96.02 });
  });
  it('PayPal goods & services has no fixed fee', () => {
    const r = paypal.rates.find((x) => x.id === 'goods-services')!;
    expect(feeOn(100, r)).toBe(2.99);
  });
  it('Stripe online card 2.9% + 30¢ on $100', () => {
    const m = stripe.methods.find((x) => x.id === 'card-online')!;
    expect(feeOn(100, m)).toBe(3.2);
  });
  it('ACH cap applies', () => {
    const m = stripe.methods.find((x) => x.id === 'ach')!;
    expect(feeOn(10_000, m)).toBe(5);
    expect(feeOn(100, m)).toBe(0.8);
  });
  it('grossForNet round-trips to at least the target', () => {
    for (const r of [{ pct: 3.49, fixed: 0.49 }, { pct: 2.9, fixed: 0.3 }, { pct: 0.8, fixed: 0, cap: 5 }]) {
      for (const target of [1, 9.99, 100, 1234.56, 50_000]) {
        const g = grossForNet(target, r)!;
        expect(g - feeOn(g, r)).toBeGreaterThanOrEqual(target - 1e-9);
        // and one cent less would fall short
        expect(g - 0.01 - feeOn(g - 0.01, r)).toBeLessThan(target);
      }
    }
  });
  it('zero amount → zero fee', () => {
    expect(feeOn(0, { pct: 3, fixed: 0.3 })).toBe(0);
  });
});

describe('etsy', () => {
  const base = { itemPrice: 25, quantity: 1, shippingCharged: 5, giftWrap: 0, salesTax: 0, offsiteAds: 'none' as const, currencyConversion: false, itemCost: 8, shippingCost: 4.5 };
  it('single $25 item + $5 shipping', () => {
    const r = etsyFees(base, etsy);
    expect(r.listingFees).toBe(0.2);
    expect(r.transactionFee).toBe(1.95); // 6.5% of 30
    expect(r.processingFee).toBe(1.15); // 3% of 30 + 0.25
    expect(r.totalFees).toBe(3.3);
    expect(r.payout).toBe(26.7);
    expect(r.profit).toBe(14.2);
  });
  it('sales tax counts toward processing only', () => {
    const r = etsyFees({ ...base, salesTax: 2 }, etsy);
    expect(r.transactionFee).toBe(1.95);
    expect(r.processingFee).toBe(1.21);
  });
  it('offsite ads capped at $100', () => {
    const r = etsyFees({ ...base, itemPrice: 1000, offsiteAds: 'standard' }, etsy);
    expect(r.offsiteAdsFee).toBe(100);
  });
});

describe('markup', () => {
  it('50% markup on $10', () => {
    const r = solveMarkup(10, 'markup', 50);
    expect(r).toMatchObject({ price: 15, profit: 5, marginPct: (5 / 15) * 100 });
  });
  it('40% margin on $60', () => {
    const r = solveMarkup(60, 'margin', 40) as MarkupResult;
    expect(r.price).toBeCloseTo(100);
    expect(r.markupPct).toBeCloseTo(66.6667, 3);
  });
  it('margin ≥ 100% is impossible', () => {
    expect(solveMarkup(10, 'margin', 100)).toBe('margin-too-high');
  });
  it('zero cost → markup undefined', () => {
    expect((solveMarkup(0, 'price', 10) as MarkupResult).markupPct).toBeNull();
  });
  it('conversions', () => {
    expect(markupToMargin(100)).toBe(50);
    expect(marginToMarkup(50)).toBe(100);
  });
});

describe('commission', () => {
  const tiers = [{ upTo: 10_000, pct: 5 }, { upTo: 25_000, pct: 7 }, { upTo: null, pct: 10 }];
  it('flat with split and base', () => {
    const r = commission(400_000, { kind: 'flat', pct: 3 }, 70, 0);
    expect(r.commission).toBe(12_000);
    expect(r.yourCommission).toBe(8_400);
  });
  it('graduated tiers', () => {
    // 10k×5% + 15k×7% + 5k×10% = 500 + 1050 + 500
    expect(commission(30_000, { kind: 'graduated', tiers }).commission).toBeCloseTo(2050);
  });
  it('whole-sale tier', () => {
    expect(commission(30_000, { kind: 'whole', tiers }).commission).toBeCloseTo(3000);
    expect(commission(10_000, { kind: 'whole', tiers }).commission).toBeCloseTo(500);
  });
  it('sales needed', () => {
    expect(salesForCommission(5000, 5)).toBe(100_000);
    expect(salesForCommission(5000, 0)).toBeNull();
  });
  it('tier validation', () => {
    expect(validateTiers(tiers)).toBeNull();
    expect(validateTiers([{ upTo: null, pct: 5 }, { upTo: 10, pct: 6 }])).not.toBeNull();
    expect(validateTiers([{ upTo: 10, pct: 5 }, { upTo: 5, pct: 6 }])).not.toBeNull();
  });
});

describe('food cost', () => {
  it('plate', () => {
    const r = plateCost([12, 6, 2], 4, 18, 30);
    expect(r.portionCost).toBe(5);
    expect(r.foodCostPct).toBeCloseTo(27.78, 2);
    expect(r.suggestedPrice).toBeCloseTo(16.67, 2);
  });
  it('period', () => {
    const r = periodFoodCost(8000, 22000, 7000, 75000);
    expect(r.cogs).toBe(23000);
    expect(r.foodCostPct).toBeCloseTo(30.67, 2);
  });
});

describe('weighted average', () => {
  it('grades', () => {
    const r = weightedAverage([{ value: 90, weight: 20 }, { value: 80, weight: 30 }, { value: 70, weight: 50 }]) as WeightedResult;
    expect(r.weightedAverage).toBe(77);
    expect(r.simpleAverage).toBe(80);
  });
  it('errors', () => {
    expect(weightedAverage([])).toBe('no-rows');
    expect(weightedAverage([{ value: 1, weight: 0 }])).toBe('zero-weight');
    expect(weightedAverage([{ value: 1, weight: -1 }])).toBe('negative-weight');
  });
});

describe('electrical', () => {
  it('amps from watts', () => {
    expect(ampsFromWatts('dc', 120, 12)).toBe(10);
    expect(ampsFromWatts('ac1', 1800, 120)).toBe(15);
    expect(ampsFromWatts('ac3', 10_000, 480, 0.9)).toBeCloseTo(13.365, 3);
  });
  it('round trip', () => {
    expect(wattsFromAmps('ac3', ampsFromWatts('ac3', 5000, 208, 0.85), 208, 0.85)).toBeCloseTo(5000);
  });
  it('kVA', () => {
    expect(ampsFromVA('ac3', 75_000, 208)).toBeCloseTo(208.18, 2);
  });
  it('hp', () => {
    expect(inputWattsFromHp(1, 100)).toBe(746);
  });
});

describe('energy cost', () => {
  it('100 W, 24h, every day, $0.20', () => {
    const r = energyCost(100, 24, 7, 1, 0.2);
    expect(r.kwhPerDay).toBeCloseTo(2.4);
    expect(r.kwhPerYear).toBeCloseTo(876);
    expect(r.costPerYear).toBeCloseTo(175.2);
    expect(r.costPerHour).toBeCloseTo(0.02);
  });
});

describe('wire size', () => {
  const table = conductors.sizes as SizeRow[];
  it('20 A, 120 V, 40 ft copper, 60°C → 12 AWG (2.6% drop)', () => {
    const r = sizeWire({ amps: 20, continuous: false, volts: 120, phase: 'ac1', lengthFt: 40, material: 'cu', tempRating: 60, maxDropPct: 3 }, table);
    expect(r.recommended?.size).toBe('12 AWG');
    expect(r.governedBy).toBe('ampacity');
  });
  it('240.4(D): 18 A copper at 75°C still needs 12 AWG (14 AWG limited to 15 A)', () => {
    const r = sizeWire({ amps: 18, continuous: false, volts: 240, phase: 'ac1', lengthFt: 10, material: 'cu', tempRating: 75, maxDropPct: 3 }, table);
    expect(r.byAmpacity?.size).toBe('12 AWG');
  });
  it('long run is governed by voltage drop', () => {
    const r = sizeWire({ amps: 20, continuous: false, volts: 120, phase: 'ac1', lengthFt: 150, material: 'cu', tempRating: 60, maxDropPct: 3 }, table);
    // 12 AWG: 2×20×1.98×150/1000 = 11.88 V = 9.9%; 8 AWG: 4.67 V = 3.9%; 6 AWG: 2.95 V = 2.46%
    expect(r.recommended?.size).toBe('6 AWG');
    expect(r.governedBy).toBe('voltage-drop');
  });
  it('continuous load sized at 125%', () => {
    const r = sizeWire({ amps: 40, continuous: true, volts: 240, phase: 'ac1', lengthFt: 20, material: 'cu', tempRating: 75, maxDropPct: 3 }, table);
    expect(r.designAmps).toBe(50);
    expect(r.byAmpacity?.size).toBe('8 AWG');
  });
  it('aluminum skips 14 AWG', () => {
    const r = sizeWire({ amps: 10, continuous: false, volts: 120, phase: 'ac1', lengthFt: 10, material: 'al', tempRating: 75, maxDropPct: 3 }, table);
    expect(r.byAmpacity?.size).toBe('12 AWG');
  });
  it('too large → null', () => {
    const r = sizeWire({ amps: 1000, continuous: false, volts: 480, phase: 'ac3', lengthFt: 100, material: 'cu', tempRating: 90, maxDropPct: 3 }, table);
    expect(r.recommended).toBeNull();
  });
  it('three-phase drop uses √3', () => {
    expect(voltageDrop('ac3', 100, 0.1, 100)).toBeCloseTo(1.732, 3);
  });
  it('termination default', () => {
    expect(defaultTempRating(100)).toBe(60);
    expect(defaultTempRating(101)).toBe(75);
  });
});

describe('wire size — same load at 50 ft', () => {
  it('12 AWG would drop 3.3%, so 10 AWG is recommended', () => {
    const r = sizeWire({ amps: 20, continuous: false, volts: 120, phase: 'ac1', lengthFt: 50, material: 'cu', tempRating: 60, maxDropPct: 3 }, conductors.sizes as SizeRow[]);
    expect(r.byAmpacity?.size).toBe('12 AWG');
    expect(r.recommended?.size).toBe('10 AWG');
    expect(r.governedBy).toBe('voltage-drop');
  });
});
