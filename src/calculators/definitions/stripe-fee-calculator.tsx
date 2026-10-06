import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { MoneyField, SelectField, CheckField, ModeToggle, ResultCard, Notices, EmptyResult, check, fmtMoney, fmtPct, roundCents } from '../primitives';
import { feeOn, grossForNet, type FeeRate } from '../logic/fees';
import stripe from '../../data/fees/stripe.json';

type Mode = 'fee' | 'reverse';

const method = (id: string) => stripe.methods.find((m) => m.id === id)!;
const surcharge = (id: string) => stripe.cardSurcharges.find((s) => s.id === id)!;
const addOn = (id: string) => stripe.addOns.find((s) => s.id === id)!;
const online = method('card-online');

/** Processing rate for the chosen method + card surcharges. Add-ons are billed separately. */
function processingRate(methodId: string, flags: Record<string, boolean>): FeeRate {
  const m = method(methodId);
  const isCard = methodId !== 'ach';
  let pct = m.pct;
  if (isCard) {
    if (flags.international) pct += surcharge('international').pct;
    if (flags.conversion) pct += surcharge('conversion').pct;
    if (flags.manual && methodId === 'card-online') pct += surcharge('manual').pct;
  }
  return { pct, fixed: m.fixed, cap: 'cap' in m ? (m.cap as number) : undefined };
}

function StripeFeeUI() {
  const [mode, setMode] = useState<Mode>('fee');
  const [amount, setAmount] = useState('100');
  const [methodId, setMethodId] = useState('card-online');
  const [flags, setFlags] = useState<Record<string, boolean>>({ international: false, conversion: false, manual: false, billing: false, 'tax-basic': false });
  const setFlag = (k: string) => (v: boolean) => setFlags((f) => ({ ...f, [k]: v }));

  const a = check(amount, { min: 0, exclusiveMin: true });
  const proc = processingRate(methodId, flags);
  const addOnPct = stripe.addOns.reduce((s, x) => s + (flags[x.id] ? x.pct : 0), 0);
  // Starting estimate for reverse mode: processing + add-ons as one uncapped rate.
  const combined: FeeRate = { pct: proc.pct + addOnPct, fixed: proc.fixed };
  const isCard = methodId !== 'ach';
  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];
  if (methodId === 'ach' && addOnPct > 0) notices.push({ severity: 'info', text: 'Add-on percentages are added on top of the capped ACH fee.' });

  const breakdown = (amt: number) => {
    const p = feeOn(amt, proc);
    const extra = roundCents((amt * addOnPct) / 100);
    return { p, extra, total: roundCents(p + extra), net: roundCents(amt - p - extra) };
  };

  let result = null;
  if (a.value !== null) {
    if (mode === 'fee') {
      const b = breakdown(a.value);
      if (b.net <= 0) notices.push({ severity: 'warning', text: 'Fees exceed the payment amount.' });
      result = (
        <ResultCard
          label="Total Stripe fees"
          value={fmtMoney(b.total)}
          sub={`You receive ${fmtMoney(b.net)}`}
          rows={[
            { label: 'Charge amount', value: fmtMoney(a.value) },
            { label: `Processing (${fmtPct(proc.pct)}${proc.fixed ? ` + ${fmtMoney(proc.fixed)}` : ''}${proc.cap !== undefined ? `, cap ${fmtMoney(proc.cap)}` : ''})`, value: fmtMoney(b.p) },
            ...(addOnPct > 0 ? [{ label: `Add-ons (${fmtPct(addOnPct)})`, value: fmtMoney(b.extra) }] : []),
            { label: 'Total fees', value: fmtMoney(b.total), strong: true },
            { label: 'You receive', value: fmtMoney(b.net), strong: true },
            { label: 'Effective fee rate', value: fmtPct((b.total / a.value) * 100) },
          ]}
        />
      );
    } else {
      // Closed form for the common case, then bisect on cents so caps + add-ons stay exact.
      let g = grossForNet(a.value, combined);
      if (g !== null) {
        let lo = Math.round(a.value * 100), hi = Math.round(Math.max(g, a.value) * 2 * 100) + 100;
        while (lo < hi) {
          const mid = Math.floor((lo + hi) / 2);
          if (breakdown(mid / 100).net >= a.value) hi = mid; else lo = mid + 1;
        }
        g = lo / 100;
      }
      if (g !== null) {
        const b = breakdown(g);
        result = (
          <ResultCard
            label="Charge the customer"
            value={fmtMoney(g)}
            sub={`so that ${fmtMoney(a.value)} reaches your balance`}
            rows={[
              { label: 'Amount to charge', value: fmtMoney(g), strong: true },
              { label: 'Stripe fees on that amount', value: fmtMoney(b.total) },
              { label: 'You receive', value: fmtMoney(b.net), strong: true },
            ]}
          />
        );
      }
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Stripe Fees</Typography>
      <ModeToggle label="What do you want to know?" value={mode} onChange={setMode} options={[{ value: 'fee', label: 'Fee on a charge' }, { value: 'reverse', label: 'How much to charge' }]} />
      <MoneyField label={mode === 'fee' ? 'Charge amount (USD)' : 'Amount you want to receive (USD)'} value={amount} onChange={setAmount} error={a.error} />
      <SelectField
        label="Payment method"
        value={methodId}
        onChange={setMethodId}
        options={stripe.methods.map((m) => ({ value: m.id, label: `${m.label} — ${m.pct}%${m.fixed ? ` + ${Math.round(m.fixed * 100)}¢` : ''}${'cap' in m ? ` (max $${(m.cap as number).toFixed(2)})` : ''}` }))}
      />
      {isCard && (
        <Stack>
          <CheckField label={`International card (+${surcharge('international').pct}%)`} checked={flags.international} onChange={setFlag('international')} />
          <CheckField label={`Currency conversion needed (+${surcharge('conversion').pct}%)`} checked={flags.conversion} onChange={setFlag('conversion')} />
          {methodId === 'card-online' && <CheckField label={`Card number typed in manually (+${surcharge('manual').pct}%)`} checked={flags.manual} onChange={setFlag('manual')} />}
        </Stack>
      )}
      <Stack>
        <Typography variant="body2" color="text.secondary">Optional Stripe products on this charge</Typography>
        <CheckField label={`${addOn('billing').label} (+${addOn('billing').pct}%)`} checked={flags.billing} onChange={setFlag('billing')} />
        <CheckField label={`${addOn('tax-basic').label} (+${addOn('tax-basic').pct}%)`} checked={flags['tax-basic']} onChange={setFlag('tax-basic')} />
      </Stack>
      {result ?? <EmptyResult />}
      <Notices items={notices} />
      <Typography variant="caption" color="text.secondary">
        US Stripe account on standard pricing, checked against stripe.com/pricing on {stripe.lastVerified}. Custom (IC+ or volume) pricing, disputes and payouts are not included.
      </Typography>
    </Stack>
  );
}

const intl = surcharge('international');
const conv = surcharge('conversion');
const ach = method('ach');
const ex1 = roundCents(100 * online.pct / 100 + online.fixed);
const ex2 = roundCents(250 * (online.pct + intl.pct + conv.pct) / 100 + online.fixed);
const ex3 = Math.min(roundCents(2000 * ach.pct / 100), ach.cap as number);

const meta: CalculatorMeta = {
  slug: 'stripe-fee-calculator',
  title: 'Stripe Fee Calculator',
  h1: 'Stripe Fee Calculator (US)',
  shortTitle: 'Stripe Fee',
  description: 'Stripe fee calculator for US accounts: card, in-person and ACH fees with international, currency conversion and manual-entry surcharges, plus how much to charge.',
  keywords: ['stripe fee calculator', 'stripe fees', 'stripe processing fee', 'stripe transaction fee', 'stripe ach fee', 'stripe international card fee'],
  category: 'business',
  icon: 'CreditCard',
  tagline: 'Work out Stripe\'s cut of a card, in-person or ACH payment — including international and conversion surcharges — or the amount to charge to net a target.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `This Stripe fee calculator applies Stripe's standard US pricing to one charge. Online card payments cost ${online.pct}% + ${Math.round(online.fixed * 100)}¢ for a domestic card. Stripe adds ${intl.pct}% for an international card, ${conv.pct}% when currency conversion is needed, and ${surcharge('manual').pct}% for a card number typed in manually. ACH Direct Debit is ${ach.pct}%, capped at $${(ach.cap as number).toFixed(2)}.\n\nTick the conditions that apply and the calculator adds the surcharges, shows the processing fee and any add-on product fees separately, and gives the amount that reaches your balance.\n\nUse <em>How much to charge</em> to set a price or invoice amount that nets a specific figure after Stripe's fees.`,
  howItWorksTitle: 'How Stripe Fees Are Calculated',
  howItWorks: `1. Start with the base rate for the payment method: online card, in-person card (Terminal), or ACH Direct Debit.\n2. For cards, add each surcharge that applies: international card, currency conversion, or manually entered card.\n3. Multiply the charge amount by the combined percentage and add the fixed fee (30¢ online, 5¢ in person).\n4. For ACH, apply the cap: the fee never exceeds $${(ach.cap as number).toFixed(2)} per payment.\n5. If you use Stripe Billing or Stripe Tax Basic, add those percentages too. The result is what Stripe deducts before payout.`,
  formula: `Processing fee = Amount × (Base% + Surcharges%) / 100 + Fixed\n                 (ACH: min(Amount × ${ach.pct}% , $${(ach.cap as number).toFixed(2)}))\nAdd-on fees    = Amount × (Billing% + Tax%) / 100\nYou receive    = Amount − Processing fee − Add-on fees\n\nBase%       — ${online.pct}% online card · ${method('card-in-person').pct}% in person · ${ach.pct}% ACH\nSurcharges% — +${intl.pct}% international · +${conv.pct}% conversion · +${surcharge('manual').pct}% manual entry\nFixed       — ${Math.round(online.fixed * 100)}¢ online · ${Math.round(method('card-in-person').fixed * 100)}¢ in person · none for ACH`,
  examplesTitle: 'Stripe Fee Examples',
  example: '',
  examples: [
    { title: 'Example 1 — $100 online payment, US card', body: `$100 × ${online.pct}% + $${online.fixed.toFixed(2)} = $${ex1.toFixed(2)}\nYou receive: $${(100 - ex1).toFixed(2)}` },
    { title: 'Example 2 — $250 from a foreign card with currency conversion', body: `Rate: ${online.pct}% + ${intl.pct}% + ${conv.pct}% = ${(online.pct + intl.pct + conv.pct).toFixed(1)}%\n$250 × ${(online.pct + intl.pct + conv.pct).toFixed(1)}% + $${online.fixed.toFixed(2)} = $${ex2.toFixed(2)}\nYou receive: $${(250 - ex2).toFixed(2)}` },
    { title: 'Example 3 — $2,000 ACH Direct Debit invoice', body: `$2,000 × ${ach.pct}% = $${roundCents(2000 * ach.pct / 100).toFixed(2)} → capped at $${(ach.cap as number).toFixed(2)}\nFee: $${ex3.toFixed(2)}   You receive: $${(2000 - ex3).toFixed(2)}` },
  ],
  referenceTables: [
    {
      title: 'Stripe US Rates Used by This Calculator',
      columns: ['Item', 'Rate', 'Fixed / cap'],
      rows: [
        ...stripe.methods.map((m) => [m.label, `${m.pct}%`, 'cap' in m ? `cap $${(m.cap as number).toFixed(2)}` : `${Math.round(m.fixed * 100)}¢`]),
        ...stripe.cardSurcharges.map((s) => [`${s.label} (added)`, `+${s.pct}%`, '—']),
        ...stripe.addOns.map((s) => [s.label, `+${s.pct}%`, '—']),
      ],
      note: `Source: <a href="https://stripe.com/pricing" rel="noopener">stripe.com/pricing</a> (no effective date shown on the page), checked ${stripe.lastVerified}.`,
    },
  ],
  tipsTitle: 'Ways to Lower Stripe Fees',
  tips: [
    `For large B2B invoices, ACH Direct Debit is capped at $${(ach.cap as number).toFixed(2)}, so on big amounts it costs far less than a card.`,
    'Price in the customer\'s currency only if conversion costs less than the sales lift. Each converted charge adds a percentage.',
    'Use a payment form or terminal rather than typing card numbers. Manual entry adds a surcharge.',
    'High-volume businesses can ask Stripe about custom pricing. This calculator uses standard rates only.',
    'Compare against PayPal for buyers who prefer it: see the <a href="/calculators/paypal-fee-calculator">PayPal fee calculator</a>.',
  ],
  methodology: {
    verified: stripe.lastVerified,
    assumptions: [
      'A <strong>US Stripe account</strong> on standard (non-negotiated) pricing, charging in USD.',
      'Card surcharges are added to the base percentage. Stripe lists them as "+ X%" lines under the base rate. Combining several (e.g. international + conversion) is our reading of that page.',
      'The manual-entry surcharge applies to online card payments only.',
      'Add-on products (Billing, Tax Basic) are charged as a percentage of the same amount, with no fixed fee or cap.',
      'Fees are rounded to the nearest cent.',
    ],
    exclusions: stripe.excluded,
    sources: stripe.sources,
  },
  faq: [
    {
      question: 'What is Stripe\'s fee on a $100 charge?',
      answer: `For an online payment with a US card, Stripe charges ${online.pct}% + ${Math.round(online.fixed * 100)}¢, which is $${ex1.toFixed(2)}, leaving you $${(100 - ex1).toFixed(2)}. An international card adds ${intl.pct}%, and currency conversion adds another ${conv.pct}%.`,
    },
    {
      question: 'Does Stripe charge more for international cards?',
      answer: `Yes. Stripe's US pricing adds ${intl.pct}% for cards issued outside the US, and ${conv.pct}% more if the charge needs currency conversion. Tick both boxes above to see the combined effect on a payment.`,
    },
    {
      question: 'Is ACH cheaper than card payments on Stripe?',
      answer: `Usually, especially on larger amounts. ACH Direct Debit is ${ach.pct}% with a $${(ach.cap as number).toFixed(2)} cap, so a $2,000 payment costs $${ex3.toFixed(2)} by ACH versus about $${roundCents(2000 * online.pct / 100 + online.fixed).toFixed(2)} by card. ACH payments take longer to clear and can fail for insufficient funds.`,
    },
  ],
  relatedSlugs: ['paypal-fee-calculator', 'markup-calculator', 'commission-calculator'],
};

export const stripeFeeCalculator: CalculatorDefinition = { meta, Component: StripeFeeUI };
