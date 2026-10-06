import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { MoneyField, SelectField, CheckField, ModeToggle, ResultCard, Notices, EmptyResult, check, fmtMoney, fmtPct } from '../primitives';
import { feeBreakdown, grossForNet, type FeeRate } from '../logic/fees';
import paypal from '../../data/fees/paypal.json';

type Mode = 'fee' | 'reverse';

function rateFor(id: string, international: boolean): FeeRate & { label: string } {
  const r = paypal.rates.find((x) => x.id === id) ?? paypal.rates[0];
  return { label: r.label, pct: r.pct + (international ? paypal.internationalSurchargePct : 0), fixed: r.fixed };
}

function PayPalFeeUI() {
  const [mode, setMode] = useState<Mode>('fee');
  const [amount, setAmount] = useState('100');
  const [type, setType] = useState('checkout');
  const [international, setInternational] = useState(false);

  const a = check(amount, { min: 0, exclusiveMin: true });
  const rate = rateFor(type, international);
  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];

  let result = null;
  if (a.value !== null) {
    if (mode === 'fee') {
      const b = feeBreakdown(a.value, rate);
      if (b.net <= 0) notices.push({ severity: 'warning', text: 'The fee is larger than the payment — you would receive nothing.' });
      result = (
        <ResultCard
          label="PayPal fee"
          value={fmtMoney(b.fee)}
          sub={`You receive ${fmtMoney(b.net)}`}
          rows={[
            { label: 'Payment amount', value: fmtMoney(b.amount) },
            { label: `Percentage fee (${fmtPct(rate.pct)})`, value: fmtMoney((b.amount * rate.pct) / 100) },
            { label: 'Fixed fee', value: fmtMoney(rate.fixed) },
            { label: 'Total fee', value: fmtMoney(b.fee), strong: true },
            { label: 'You receive', value: fmtMoney(b.net), strong: true },
            { label: 'Effective fee rate', value: fmtPct(b.effectivePct) },
          ]}
        />
      );
    } else {
      const g = grossForNet(a.value, rate);
      if (g !== null) {
        const b = feeBreakdown(g, rate);
        result = (
          <ResultCard
            label="Ask the buyer to pay"
            value={fmtMoney(g)}
            sub={`so that ${fmtMoney(a.value)} lands in your account`}
            rows={[
              { label: 'Amount to request', value: fmtMoney(g), strong: true },
              { label: 'PayPal fee on that amount', value: fmtMoney(b.fee) },
              { label: 'You receive', value: fmtMoney(b.net), strong: true },
              { label: 'Effective fee rate', value: fmtPct(b.effectivePct) },
            ]}
          />
        );
      }
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate PayPal Fees</Typography>
      <ModeToggle
        label="What do you want to know?"
        value={mode}
        onChange={setMode}
        options={[{ value: 'fee', label: 'Fee on a payment' }, { value: 'reverse', label: 'How much to charge' }]}
      />
      <MoneyField
        label={mode === 'fee' ? 'Payment amount (USD)' : 'Amount you want to receive (USD)'}
        value={amount}
        onChange={setAmount}
        error={a.error}
      />
      <SelectField
        label="How the buyer pays"
        value={type}
        onChange={setType}
        options={paypal.rates.map((r) => ({ value: r.id, label: `${r.label} — ${r.pct}%${r.fixed ? ` + $${r.fixed.toFixed(2)}` : ''}` }))}
      />
      <CheckField label={`Buyer is outside the US (+${paypal.internationalSurchargePct}% international fee)`} checked={international} onChange={setInternational} />
      {result ?? <EmptyResult />}
      <Notices items={notices} />
      <Typography variant="caption" color="text.secondary">
        US PayPal account, USD, standard rates from PayPal&apos;s merchant fee page (updated {paypal.sourcePageUpdated}; checked {paypal.lastVerified}). Currency conversion, disputes and negotiated pricing are not included.
      </Typography>
    </Stack>
  );
}

const pct = (id: string) => paypal.rates.find((r) => r.id === id)!;
const checkout = pct('checkout');
const gs = pct('goods-services');

const meta: CalculatorMeta = {
  slug: 'paypal-fee-calculator',
  title: 'PayPal Fee Calculator',
  h1: 'PayPal Fee Calculator (US)',
  shortTitle: 'PayPal Fee',
  description: 'PayPal fee calculator for US accounts: see the fee and what you receive for checkout, cards, Venmo, goods and services and international payments, or how much to charge.',
  keywords: ['paypal fee calculator', 'paypal fees', 'paypal goods and services fee', 'how much does paypal take', 'paypal invoice fee calculator', 'paypal international fee'],
  category: 'business',
  icon: 'Payments',
  tagline: 'See exactly what PayPal takes from a payment and what lands in your account — or work backwards to the amount you should charge.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `This PayPal fee calculator uses PayPal's published US merchant rates. Pick how the buyer pays, enter the amount, and it shows the percentage fee, the fixed fee, the total, and what you actually receive.\n\nThe fee depends on the payment type. A standard PayPal Checkout payment costs ${checkout.pct}% plus a $${checkout.fixed.toFixed(2)} fixed fee. Goods and services payments sent through the PayPal app are listed at ${gs.pct}%, and PayPal's table shows no fixed fee for that row. Payments from buyers outside the US add another ${paypal.internationalSurchargePct}%.\n\nSwitch to <em>How much to charge</em> if you need a specific amount to arrive — for example, to pass the fee on to a client on an invoice. The calculator finds the smallest amount, to the cent, that leaves you with at least your target after fees.`,
  howItWorksTitle: 'How PayPal Fees Are Calculated',
  howItWorks: `1. PayPal looks up the rate for the payment type: Checkout, Guest Checkout, Venmo, card processing, Pay Later, QR code, or goods and services.\n2. It takes that percentage of the payment amount.\n3. It adds the fixed fee for the currency received. For USD this is $0.49 on most commercial payments, $0.29 for Advanced card processing and Virtual Terminal, and $0.09 for QR code payments.\n4. If the buyer is outside the US, it adds the ${paypal.internationalSurchargePct}% international fee to the percentage.\n5. The total is deducted from the payment before the money reaches your balance.`,
  formula: `Fee         = Amount × (Rate% + International%) / 100 + Fixed fee\nYou receive = Amount − Fee\n\nTo receive a target amount (reverse):\nCharge      = (Target + Fixed fee) / (1 − (Rate% + International%) / 100)\n              rounded up to the cent\n\nRate%          — percentage for the payment type (e.g. ${checkout.pct}% PayPal Checkout)\nInternational% — ${paypal.internationalSurchargePct}% if the buyer is outside the US, else 0\nFixed fee      — per-transaction fee in USD (e.g. $${checkout.fixed.toFixed(2)})`,
  examplesTitle: 'PayPal Fee Examples',
  example: '',
  examples: [
    {
      title: 'Example 1 — $100 PayPal Checkout sale',
      body: `Percentage: $100 × ${checkout.pct}% = $${(100 * checkout.pct / 100).toFixed(2)}\nFixed fee:                    $${checkout.fixed.toFixed(2)}\nTotal fee:                    $${(100 * checkout.pct / 100 + checkout.fixed).toFixed(2)}\nYou receive:                  $${(100 - (100 * checkout.pct / 100 + checkout.fixed)).toFixed(2)}`,
    },
    {
      title: 'Example 2 — $50 goods and services payment from a US buyer',
      body: `Percentage: $50 × ${gs.pct}% = $${(50 * gs.pct / 100).toFixed(2)}\nFixed fee:                  $0.00 (none listed for this payment type)\nTotal fee:                  $${(50 * gs.pct / 100).toFixed(2)}\nYou receive:                $${(50 - 50 * gs.pct / 100).toFixed(2)}`,
    },
    {
      title: 'Example 3 — Invoice so that $500 arrives (Checkout, international buyer)',
      body: `Rate: ${checkout.pct}% + ${paypal.internationalSurchargePct}% = ${(checkout.pct + paypal.internationalSurchargePct).toFixed(2)}%\nCharge = ($500 + $${checkout.fixed.toFixed(2)}) / (1 − ${((checkout.pct + paypal.internationalSurchargePct) / 100).toFixed(4)})\n       = $${(Math.ceil(((500 + checkout.fixed) / (1 - (checkout.pct + paypal.internationalSurchargePct) / 100)) * 100) / 100).toFixed(2)}\nCheck: the fee on that amount leaves at least $500.00`,
    },
  ],
  referenceTables: [
    {
      title: 'PayPal US Fee Rates Used by This Calculator',
      columns: ['Payment type', 'Rate', 'Fixed fee (USD)'],
      rows: paypal.rates.map((r) => [r.label, `${r.pct}%`, r.fixed ? `$${r.fixed.toFixed(2)}` : 'none listed']),
      note: `International commercial payments add ${paypal.internationalSurchargePct}%. Source: <a href="https://www.paypal.com/us/business/paypal-business-fees" rel="noopener">PayPal Merchant Fees (US)</a>, last updated by PayPal on ${paypal.sourcePageUpdated}, checked ${paypal.lastVerified}.`,
    },
  ],
  tipsTitle: 'Ways to Pay Less in PayPal Fees',
  tips: [
    'Compare payment types before you send a link. On the same $100, Checkout costs more than a QR code payment — use the dropdown above to see the difference.',
    'If you invoice clients, use the reverse mode to price the fee in rather than absorbing it. Check your local rules and PayPal\'s terms on surcharging first.',
    'Batch small charges where you can. The fixed fee is per transaction, so ten $5 payments cost far more in fixed fees than one $50 payment.',
    'For card-heavy volume, compare against a dedicated card processor — see the <a href="/calculators/stripe-fee-calculator">Stripe fee calculator</a>.',
  ],
  methodology: {
    verified: paypal.lastVerified,
    assumptions: [
      `A <strong>US PayPal account</strong> receiving <strong>US dollars</strong>, on PayPal's standard published rates.`,
      'Fees are rounded to the nearest cent. PayPal\'s own rounding can differ by a cent on some amounts.',
      `"International" means the buyer's account is outside the US. It adds PayPal's ${paypal.internationalSurchargePct}% international commercial fee to the percentage.`,
      'Goods and services payments use the 2.99% rate shown in PayPal\'s table, which lists no fixed fee for that row.',
    ],
    exclusions: paypal.excluded,
    sources: paypal.sources,
  },
  faq: [
    {
      question: 'How much does PayPal take from a $100 payment?',
      answer: `For a standard PayPal Checkout payment from a US buyer, PayPal charges ${checkout.pct}% + $${checkout.fixed.toFixed(2)}, which is $${(100 * checkout.pct / 100 + checkout.fixed).toFixed(2)}, so you receive $${(100 - (100 * checkout.pct / 100 + checkout.fixed)).toFixed(2)}. Other payment types cost different amounts. Pick yours in the calculator above.`,
    },
    {
      question: 'Who pays the PayPal fee, the buyer or the seller?',
      answer: 'On commercial payments the seller (the recipient) pays: the fee is deducted from the money you receive. If you want the buyer to cover it, raise your price or invoice amount. The reverse mode above shows exactly how much to charge.',
    },
    {
      question: 'Does this work for PayPal accounts outside the US?',
      answer: 'No. Rates and fixed fees differ by country, and this calculator uses the US schedule only. If your PayPal account is registered in another country, use the fee page for that country.',
    },
  ],
  relatedSlugs: ['stripe-fee-calculator', 'markup-calculator', 'commission-calculator'],
};

export const paypalFeeCalculator: CalculatorDefinition = { meta, Component: PayPalFeeUI };
