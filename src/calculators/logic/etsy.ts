/** Etsy per-order fee model. Rates are passed in from src/data/fees/etsy.json. */
import { roundCents } from '../primitives/format';

export interface EtsyRates {
  listingFee: number;
  transactionFeePct: number;
  processing: { pct: number; fixed: number };
  offsiteAds: { standardPct: number; reducedPct: number; capPerOrder: number };
  currencyConversionPct: number;
}

export interface EtsyOrder {
  /** Price per item. */
  itemPrice: number;
  quantity: number;
  /** Shipping charged to the buyer. */
  shippingCharged: number;
  giftWrap: number;
  /** Sales tax collected through Etsy (US). */
  salesTax: number;
  offsiteAds: 'none' | 'standard' | 'reduced';
  currencyConversion: boolean;
  /** Your cost to make/buy all items in the order. */
  itemCost: number;
  /** What you pay to ship (label + packaging). */
  shippingCost: number;
}

export interface EtsyResult {
  /** Item subtotal + shipping + gift wrap — the order revenue (tax excluded). */
  orderRevenue: number;
  listingFees: number;
  transactionFee: number;
  processingFee: number;
  offsiteAdsFee: number;
  conversionFee: number;
  totalFees: number;
  /** orderRevenue − totalFees. */
  payout: number;
  profit: number;
  /** Profit / orderRevenue × 100. */
  marginPct: number;
  /** totalFees / orderRevenue × 100. */
  feePct: number;
}

export function etsyFees(o: EtsyOrder, r: EtsyRates): EtsyResult {
  const items = o.itemPrice * o.quantity;
  const orderRevenue = items + o.shippingCharged + o.giftWrap;
  // One $0.20 listing fee per unit sold (initial listing or the auto-renewal after each sale).
  const listingFees = roundCents(r.listingFee * o.quantity);
  // US sellers: transaction fee covers item price + shipping + gift wrap, not sales tax.
  const transactionFee = roundCents((orderRevenue * r.transactionFeePct) / 100);
  // Processing fee is assessed on the total sale including sales tax and shipping; fixed part is per order.
  const processingFee = roundCents(((orderRevenue + o.salesTax) * r.processing.pct) / 100 + r.processing.fixed);
  const adsPct = o.offsiteAds === 'standard' ? r.offsiteAds.standardPct : o.offsiteAds === 'reduced' ? r.offsiteAds.reducedPct : 0;
  const offsiteAdsFee = roundCents(Math.min((orderRevenue * adsPct) / 100, r.offsiteAds.capPerOrder));
  const conversionFee = o.currencyConversion ? roundCents((orderRevenue * r.currencyConversionPct) / 100) : 0;
  const totalFees = roundCents(listingFees + transactionFee + processingFee + offsiteAdsFee + conversionFee);
  const payout = roundCents(orderRevenue - totalFees);
  const profit = roundCents(payout - o.itemCost - o.shippingCost);
  return {
    orderRevenue, listingFees, transactionFee, processingFee, offsiteAdsFee, conversionFee, totalFees, payout, profit,
    marginPct: orderRevenue > 0 ? (profit / orderRevenue) * 100 : 0,
    feePct: orderRevenue > 0 ? (totalFees / orderRevenue) * 100 : 0,
  };
}
