import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { MoneyField, NumberField, SelectField, CheckField, ResultCard, Notices, EmptyResult, check, fmtMoney, fmtPct } from '../primitives';
import { etsyFees, type EtsyOrder } from '../logic/etsy';
import etsy from '../../data/fees/etsy.json';

function EtsyFeeUI() {
  const [price, setPrice] = useState('25');
  const [qty, setQty] = useState('1');
  const [ship, setShip] = useState('5');
  const [wrap, setWrap] = useState('0');
  const [tax, setTax] = useState('0');
  const [ads, setAds] = useState<EtsyOrder['offsiteAds']>('none');
  const [conv, setConv] = useState(false);
  const [cost, setCost] = useState('8');
  const [shipCost, setShipCost] = useState('4.50');

  const f = {
    price: check(price, { min: 0 }),
    qty: check(qty, { min: 1 }),
    ship: check(ship, { min: 0 }),
    wrap: check(wrap, { min: 0 }),
    tax: check(tax, { min: 0 }),
    cost: check(cost, { min: 0 }),
    shipCost: check(shipCost, { min: 0 }),
  };
  const valid = Object.values(f).every((x) => x.value !== null);
  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];
  if (f.qty.value !== null && !Number.isInteger(f.qty.value)) notices.push({ severity: 'warning', text: 'Quantity should be a whole number.' });

  let result = null;
  if (valid) {
    const r = etsyFees({
      itemPrice: f.price.value!, quantity: Math.round(f.qty.value!), shippingCharged: f.ship.value!, giftWrap: f.wrap.value!,
      salesTax: f.tax.value!, offsiteAds: ads, currencyConversion: conv, itemCost: f.cost.value!, shippingCost: f.shipCost.value!,
    }, etsy);
    if (r.profit < 0) notices.push({ severity: 'warning', text: 'This sale loses money after fees and costs.' });
    if (ads !== 'none' && r.offsiteAdsFee >= etsy.offsiteAds.capPerOrder) notices.push({ severity: 'info', text: `Offsite Ads fee hit the $${etsy.offsiteAds.capPerOrder} per-order cap.` });
    result = (
      <ResultCard
        label="Total Etsy fees"
        value={fmtMoney(r.totalFees)}
        sub={`${fmtPct(r.feePct, 1)} of the order · profit ${fmtMoney(r.profit)}`}
        rows={[
          { label: 'Order revenue (items + shipping + gift wrap)', value: fmtMoney(r.orderRevenue) },
          { label: `Listing fee ($${etsy.listingFee.toFixed(2)} × items)`, value: fmtMoney(r.listingFees) },
          { label: `Transaction fee (${etsy.transactionFeePct}%)`, value: fmtMoney(r.transactionFee) },
          { label: `Payment processing (${etsy.processing.pct}% + $${etsy.processing.fixed.toFixed(2)})`, value: fmtMoney(r.processingFee) },
          ...(ads !== 'none' ? [{ label: `Offsite Ads (${ads === 'standard' ? etsy.offsiteAds.standardPct : etsy.offsiteAds.reducedPct}%)`, value: fmtMoney(r.offsiteAdsFee) }] : []),
          ...(conv ? [{ label: `Currency conversion (${etsy.currencyConversionPct}%)`, value: fmtMoney(r.conversionFee) }] : []),
          { label: 'Total fees', value: fmtMoney(r.totalFees), strong: true },
          { label: 'Etsy pays you', value: fmtMoney(r.payout) },
          { label: 'Your costs (items + shipping)', value: fmtMoney(f.cost.value! + f.shipCost.value!) },
          { label: 'Profit', value: fmtMoney(r.profit), strong: true },
          { label: 'Profit margin', value: fmtPct(r.marginPct, 1) },
        ]}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Etsy Fees and Profit</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <MoneyField label="Item price" value={price} onChange={setPrice} error={f.price.error} />
        <NumberField label="Quantity" value={qty} onChange={setQty} error={f.qty.error} step="1" />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <MoneyField label="Shipping charged to buyer" value={ship} onChange={setShip} error={f.ship.error} />
        <MoneyField label="Gift wrap charged" value={wrap} onChange={setWrap} error={f.wrap.error} />
      </Stack>
      <MoneyField label="Sales tax collected by Etsy" value={tax} onChange={setTax} error={f.tax.error} helperText="Counts toward the processing fee only" />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <MoneyField label="Your item cost (whole order)" value={cost} onChange={setCost} error={f.cost.error} />
        <MoneyField label="Your shipping cost" value={shipCost} onChange={setShipCost} error={f.shipCost.error} />
      </Stack>
      <SelectField
        label="Did the sale come from an Offsite Ad?"
        value={ads}
        onChange={setAds}
        options={[
          { value: 'none', label: 'No' },
          { value: 'standard', label: `Yes — ${etsy.offsiteAds.standardPct}% (shops under $10k/yr)` },
          { value: 'reduced', label: `Yes — ${etsy.offsiteAds.reducedPct}% (shops at $10k+/yr)` },
        ]}
      />
      <CheckField label={`Listed in a different currency from my payment account (+${etsy.currencyConversionPct}%)`} checked={conv} onChange={setConv} />
      {result ?? <EmptyResult />}
      <Notices items={notices} />
      <Typography variant="caption" color="text.secondary">
        US seller, Etsy Payments, USD. Rates from Etsy&apos;s Fees &amp; Payments Policy (updated {etsy.sourcePageUpdated}). Etsy Ads, shipping labels and subscriptions are not included.
      </Typography>
    </Stack>
  );
}

const ex = (price: number, ship: number, tax = 0, adsPct = 0) => {
  const rev = price + ship;
  const listing = etsy.listingFee;
  const txn = Math.round(rev * etsy.transactionFeePct) / 100;
  const proc = Math.round((rev + tax) * etsy.processing.pct + etsy.processing.fixed * 100) / 100;
  const adsFee = Math.min(Math.round(rev * adsPct) / 100, etsy.offsiteAds.capPerOrder);
  return { rev, listing, txn, proc, adsFee, total: Math.round((listing + txn + proc + adsFee) * 100) / 100 };
};
const e1 = ex(25, 5);
const e2 = ex(40, 0, 3.2);
const e3 = ex(60, 8, 0, etsy.offsiteAds.standardPct);

const meta: CalculatorMeta = {
  slug: 'etsy-fee-calculator',
  title: 'Etsy Fee Calculator',
  h1: 'Etsy Fee Calculator (US Sellers)',
  shortTitle: 'Etsy Fee',
  description: 'Etsy fee calculator for US sellers: listing, 6.5% transaction, payment processing and Offsite Ads fees on one order, with your payout, profit and margin.',
  keywords: ['etsy fee calculator', 'etsy fees', 'etsy profit calculator', 'etsy transaction fee', 'etsy processing fee', 'etsy offsite ads fee'],
  category: 'business',
  icon: 'Storefront',
  tagline: 'Enter one order and see every Etsy fee line by line — listing, transaction, processing and Offsite Ads — plus what you keep after your own costs.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `This Etsy fee calculator itemizes what Etsy charges a US seller on a single order, then subtracts your own item and shipping costs to give your real profit.\n\nEach Etsy fee is charged on a slightly different base. The ${etsy.transactionFeePct}% transaction fee applies to the item price plus shipping and gift wrap, but not to sales tax. The payment processing fee of ${etsy.processing.pct}% + $${etsy.processing.fixed.toFixed(2)} applies to the whole order total, including sales tax. Offsite Ads, when a sale comes from one, take ${etsy.offsiteAds.standardPct}% (or ${etsy.offsiteAds.reducedPct}% for larger shops), capped at $${etsy.offsiteAds.capPerOrder} per order. The calculator applies each fee to its own base so the total matches how Etsy actually bills.\n\nUse it to check a price before you list, to see how much free shipping really costs you, or to understand why the deposit is smaller than the sale.`,
  howItWorksTitle: 'How Etsy Fees Are Calculated',
  howItWorks: `1. <strong>Listing fee:</strong> $${etsy.listingFee.toFixed(2)} per item sold. You pay it when you list, and again each time a unit sells and the listing auto-renews.\n2. <strong>Transaction fee:</strong> ${etsy.transactionFeePct}% of (item price × quantity + shipping + gift wrap). Sales tax is excluded for US sellers.\n3. <strong>Payment processing:</strong> ${etsy.processing.pct}% of the full order total, including shipping and sales tax, plus $${etsy.processing.fixed.toFixed(2)} once per order.\n4. <strong>Offsite Ads</strong> (only if the buyer came from an Etsy ad on another site within 30 days): ${etsy.offsiteAds.standardPct}% or ${etsy.offsiteAds.reducedPct}% of the order, never more than $${etsy.offsiteAds.capPerOrder}.\n5. <strong>Profit</strong> = item price + shipping + gift wrap − all fees − your item cost − your shipping cost.`,
  formula: `Revenue      = Price × Qty + Shipping + Gift wrap\nListing      = $${etsy.listingFee.toFixed(2)} × Qty\nTransaction  = Revenue × ${etsy.transactionFeePct}%\nProcessing   = (Revenue + Sales tax) × ${etsy.processing.pct}% + $${etsy.processing.fixed.toFixed(2)}\nOffsite Ads  = min(Revenue × ${etsy.offsiteAds.standardPct}% or ${etsy.offsiteAds.reducedPct}%, $${etsy.offsiteAds.capPerOrder})\nTotal fees   = Listing + Transaction + Processing + Offsite Ads\nProfit       = Revenue − Total fees − Item cost − Shipping cost\n\nSales tax is collected and passed through to the tax authority — it is not your revenue,\nbut Etsy's processing fee is still charged on it.`,
  examplesTitle: 'Etsy Fee Examples',
  example: '',
  examples: [
    { title: 'Example 1 — $25 item + $5 shipping', body: `Listing:     $${e1.listing.toFixed(2)}\nTransaction: $30.00 × ${etsy.transactionFeePct}% = $${e1.txn.toFixed(2)}\nProcessing:  $30.00 × ${etsy.processing.pct}% + $${etsy.processing.fixed.toFixed(2)} = $${e1.proc.toFixed(2)}\nTotal fees:  $${e1.total.toFixed(2)}  →  Etsy pays you $${(e1.rev - e1.total).toFixed(2)}` },
    { title: 'Example 2 — $40 item, free shipping, $3.20 sales tax', body: `Listing:     $${e2.listing.toFixed(2)}\nTransaction: $40.00 × ${etsy.transactionFeePct}% = $${e2.txn.toFixed(2)}   (tax excluded)\nProcessing:  $43.20 × ${etsy.processing.pct}% + $${etsy.processing.fixed.toFixed(2)} = $${e2.proc.toFixed(2)}   (tax included)\nTotal fees:  $${e2.total.toFixed(2)}  →  Etsy pays you $${(e2.rev - e2.total).toFixed(2)}` },
    { title: `Example 3 — $60 item + $8 shipping, sold through an Offsite Ad (${etsy.offsiteAds.standardPct}%)`, body: `Listing:     $${e3.listing.toFixed(2)}\nTransaction: $68.00 × ${etsy.transactionFeePct}% = $${e3.txn.toFixed(2)}\nProcessing:  $68.00 × ${etsy.processing.pct}% + $${etsy.processing.fixed.toFixed(2)} = $${e3.proc.toFixed(2)}\nOffsite Ads: $68.00 × ${etsy.offsiteAds.standardPct}% = $${e3.adsFee.toFixed(2)}\nTotal fees:  $${e3.total.toFixed(2)}  (${((e3.total / e3.rev) * 100).toFixed(1)}% of the order)` },
  ],
  referenceTables: [
    {
      title: 'Etsy Fees for US Sellers Used by This Calculator',
      columns: ['Fee', 'Rate', 'Charged on'],
      rows: [
        ['Listing fee', `$${etsy.listingFee.toFixed(2)}`, 'Each listing, renewal, and unit sold'],
        ['Transaction fee', `${etsy.transactionFeePct}%`, 'Item price + shipping + gift wrap (not sales tax)'],
        ['Payment processing (US)', `${etsy.processing.pct}% + $${etsy.processing.fixed.toFixed(2)}`, 'Order total incl. shipping and sales tax; fixed part per order'],
        ['Offsite Ads', `${etsy.offsiteAds.standardPct}% / ${etsy.offsiteAds.reducedPct}%`, `Attributed orders; ${etsy.offsiteAds.reducedPct}% once a shop passes $10,000 in 12-month sales; max $${etsy.offsiteAds.capPerOrder}/order`],
        ['Currency conversion', `${etsy.currencyConversionPct}%`, 'Sale amount, only if listing currency ≠ payment account currency'],
      ],
      note: `Sources: <a href="https://www.etsy.com/legal/fees/" rel="noopener">Etsy Fees &amp; Payments Policy</a> (last updated by Etsy ${etsy.sourcePageUpdated}) and Etsy Help's payment processing fee table.`,
    },
  ],
  tipsTitle: 'Ways to Keep More of Each Etsy Sale',
  tips: [
    'Build shipping into the item price only after checking the numbers: the transaction fee applies to shipping either way, so "free shipping" changes the fee very little.',
    'Bundle items into one order where you can. The processing fee\'s fixed part is charged once per order, not per item.',
    'Know your Offsite Ads exposure. One attributed sale can cost 12–15% extra, so price with that possibility in mind.',
    'Work out your price from cost first with the <a href="/calculators/markup-calculator">markup calculator</a>, then check the result here.',
  ],
  methodology: {
    verified: etsy.lastVerified,
    assumptions: [
      'A seller <strong>based in the US</strong>, paid through Etsy Payments in USD.',
      'One listing fee per unit sold (the listing auto-renews after each sale). Listing fees you paid on items that never sold are not counted.',
      'Sales tax entered is tax Etsy collects and remits. It is charged the processing fee but not the transaction or Offsite Ads fees.',
      'Currency conversion, when ticked, is applied to the order revenue excluding tax.',
      `Rates were checked against Etsy's published Fees &amp; Payments Policy (last updated by Etsy ${etsy.sourcePageUpdated}). Etsy's site blocks automated retrieval, so we checked an archived copy of that policy page captured on 2026-09-19.`,
    ],
    exclusions: etsy.excluded,
    sources: etsy.sources,
  },
  faq: [
    {
      question: 'How much does Etsy take from a $25 sale?',
      answer: `With $5 shipping and no Offsite Ad, Etsy's fees come to $${e1.total.toFixed(2)}: a $${e1.listing.toFixed(2)} listing fee, $${e1.txn.toFixed(2)} transaction fee and $${e1.proc.toFixed(2)} processing fee. That is about ${((e1.total / e1.rev) * 100).toFixed(1)}% of the $30 order, before your own material and shipping costs.`,
    },
    {
      question: 'Does Etsy charge fees on shipping and sales tax?',
      answer: `Shipping, yes: both the ${etsy.transactionFeePct}% transaction fee and the processing fee include it. Sales tax is excluded from the transaction fee for US sellers but included in the ${etsy.processing.pct}% processing fee, so tax slightly increases what you pay.`,
    },
    {
      question: 'Can I avoid the Offsite Ads fee?',
      answer: 'Shops with under $10,000 in sales over the past 12 months can opt out of Offsite Ads in their shop settings. Shops over that threshold are enrolled automatically at the lower rate. You only pay the fee on orders that Etsy attributes to an ad click.',
    },
  ],
  relatedSlugs: ['paypal-fee-calculator', 'stripe-fee-calculator', 'markup-calculator'],
};

export const etsyFeeCalculator: CalculatorDefinition = { meta, Component: EtsyFeeUI };
