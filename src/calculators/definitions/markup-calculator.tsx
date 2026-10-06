import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { MoneyField, PercentField, ModeToggle, ResultCard, Notices, EmptyResult, check, fmtMoney, fmtPct } from '../primitives';
import { solveMarkup, type MarkupSolveFrom } from '../logic/markup';

function MarkupUI() {
  const [from, setFrom] = useState<MarkupSolveFrom>('markup');
  const [cost, setCost] = useState('40');
  const [value, setValue] = useState('50');

  const c = check(cost, { min: 0 });
  const v = check(value, from === 'price' ? { min: 0, exclusiveMin: true } : { min: from === 'margin' ? -1e9 : -100 });
  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];

  let result = null;
  if (c.value !== null && v.value !== null) {
    const r = solveMarkup(c.value, from, v.value);
    if (r === 'margin-too-high') notices.push({ severity: 'error', text: 'Margin must be below 100% — at 100% the price would be infinite.' });
    else if (r === 'price-not-positive') notices.push({ severity: 'error', text: 'That combination gives a price of zero or less.' });
    else if (r === 'cost-negative') notices.push({ severity: 'error', text: 'Cost cannot be negative.' });
    else {
      if (r.profit < 0) notices.push({ severity: 'warning', text: 'The selling price is below cost — this sale loses money.' });
      result = (
        <ResultCard
          label={from === 'price' ? 'Markup' : 'Selling price'}
          value={from === 'price' ? (r.markupPct === null ? 'n/a' : fmtPct(r.markupPct)) : fmtMoney(r.price)}
          sub={`Margin ${fmtPct(r.marginPct)} · profit ${fmtMoney(r.profit)} per unit`}
          rows={[
            { label: 'Cost', value: fmtMoney(r.cost) },
            { label: 'Selling price', value: fmtMoney(r.price), strong: true },
            { label: 'Profit per unit', value: fmtMoney(r.profit) },
            { label: 'Markup (profit ÷ cost)', value: r.markupPct === null ? 'n/a (cost is 0)' : fmtPct(r.markupPct), strong: true },
            { label: 'Gross margin (profit ÷ price)', value: fmtPct(r.marginPct), strong: true },
          ]}
        />
      );
    }
  }

  const valueLabel = from === 'markup' ? 'Markup' : from === 'margin' ? 'Target gross margin' : 'Selling price';

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Markup, Margin and Price</Typography>
      <ModeToggle
        label="You know the cost and…"
        value={from}
        onChange={(m) => { setFrom(m); setValue(m === 'markup' ? '50' : m === 'margin' ? '30' : '60'); }}
        options={[{ value: 'markup', label: 'the markup %' }, { value: 'margin', label: 'the margin %' }, { value: 'price', label: 'the selling price' }]}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <MoneyField label="Cost per unit" value={cost} onChange={setCost} error={c.error} />
        {from === 'price'
          ? <MoneyField label={valueLabel} value={value} onChange={setValue} error={v.error} />
          : <PercentField label={valueLabel} value={value} onChange={setValue} error={v.error} />}
      </Stack>
      {result ?? (notices.length === 0 && <EmptyResult />)}
      <Notices items={notices} />
    </Stack>
  );
}

const rows = [10, 20, 25, 30, 40, 50, 60, 75, 100, 150, 200].map((m) => [`${m}%`, `${((m / (100 + m)) * 100).toFixed(1)}%`, `$${(10 * (1 + m / 100)).toFixed(2)}`]);

const meta: CalculatorMeta = {
  slug: 'markup-calculator',
  title: 'Markup Calculator',
  h1: 'Markup Calculator',
  shortTitle: 'Markup',
  description: 'Markup calculator: find the selling price from cost and markup, the markup from cost and price, or the price that hits a target margin — with markup vs margin explained.',
  keywords: ['markup calculator', 'markup percentage calculator', 'markup vs margin', 'how to calculate markup', 'selling price calculator', 'markup formula'],
  category: 'business',
  icon: 'TrendingUp',
  tagline: 'Enter a cost plus a markup, a target margin or a selling price — get the other numbers, including the markup-versus-margin difference that trips people up.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `Markup is how much you add on top of what something costs you, expressed as a percentage of the cost. If an item costs $40 and you sell it for $60, the $20 profit is a 50% markup.\n\nMarkup is easy to confuse with <strong>gross margin</strong>, which expresses the same $20 as a share of the <em>selling price</em>: $20 ÷ $60 = 33.3%. The two are never equal (except at zero), and mixing them up is a common pricing mistake. If you need a 50% margin and apply a 50% markup instead, you end up with only 33.3% margin.\n\nThis markup calculator works from any starting point. Give it the cost and a markup to get a price. Give it the cost and a target margin to get the price that hits that margin. Or give it the cost and an existing price to see the markup and margin you are actually earning.`,
  howItWorksTitle: 'How to Calculate Markup',
  howItWorks: '1. Start with your cost per unit: what you paid, or what it cost to make.\n2. To price from a markup: selling price = cost × (1 + markup ÷ 100).\n3. To price from a target margin: selling price = cost ÷ (1 − margin ÷ 100).\n4. To find the markup on an existing price: markup = (price − cost) ÷ cost × 100.\n5. Margin is always profit ÷ price, so it is smaller than the markup on the same sale.',
  formula: 'Profit        = Price − Cost\nMarkup %      = Profit ÷ Cost × 100\nMargin %      = Profit ÷ Price × 100\n\nPrice from markup = Cost × (1 + Markup% ÷ 100)\nPrice from margin = Cost ÷ (1 − Margin% ÷ 100)\n\nMarkup → margin:  Margin% = Markup% ÷ (100 + Markup%) × 100\nMargin → markup:  Markup% = Margin% ÷ (100 − Margin%) × 100',
  examplesTitle: 'Markup Examples',
  example: '',
  examples: [
    { title: 'Example 1 — Price from a 50% markup', body: 'Cost $40 × (1 + 0.50) = $60.00 selling price\nProfit $20.00 · Markup 50% · Margin 33.3%' },
    { title: 'Example 2 — Price for a 40% gross margin', body: 'Cost $40 ÷ (1 − 0.40) = $66.67 selling price\nProfit $26.67 · Margin 40% · Markup 66.7%' },
    { title: 'Example 3 — Markup on an existing price', body: 'Cost $12.50, price $19.99\nProfit $7.49 → Markup = 7.49 ÷ 12.50 = 59.9% · Margin = 7.49 ÷ 19.99 = 37.5%' },
  ],
  referenceTables: [
    {
      title: 'Markup to Margin Conversion Table',
      columns: ['Markup', 'Gross margin', 'Price on a $10 cost'],
      rows,
      note: 'Margin = markup ÷ (100 + markup). A 100% markup (doubling the cost, called "keystone" pricing in retail) is a 50% margin.',
    },
  ],
  tipsTitle: 'Pricing Tips',
  tips: [
    'Decide whether your target is a markup or a margin before you price. Accountants and most financial statements report margin.',
    'Include every cost that scales with each unit: packaging, payment fees, marketplace fees. The <a href="/calculators/paypal-fee-calculator">PayPal</a> and <a href="/calculators/stripe-fee-calculator">Stripe</a> fee calculators show what each sale really costs.',
    'Selling through a salesperson? Check how a <a href="/calculators/commission-calculator">commission</a> eats into the margin.',
    'In food service, the same idea is called food cost percentage. See the <a href="/calculators/food-cost-calculator">food cost calculator</a>.',
  ],
  faq: [
    {
      question: 'What is the difference between markup and margin?',
      answer: 'Both measure the same profit, against different bases. Markup divides profit by cost; margin divides profit by selling price. On a $40 item sold for $60, markup is 50% and margin is 33.3%. Margin can never reach 100%, but markup can be any size.',
    },
    {
      question: 'How do I calculate a 30% markup?',
      answer: 'Multiply the cost by 1.30. A $50 cost with a 30% markup sells for $65, a $15 profit. That is a 23.1% margin. If you actually need a 30% margin, divide by 0.70 instead: $50 ÷ 0.70 = $71.43.',
    },
    {
      question: 'Is a 100% markup the same as doubling the price?',
      answer: 'Yes. A 100% markup adds a profit equal to the cost, so the selling price is twice the cost. The margin on that sale is 50%.',
    },
  ],
  relatedSlugs: ['commission-calculator', 'food-cost-calculator', 'paypal-fee-calculator'],
};

export const markupCalculator: CalculatorDefinition = { meta, Component: MarkupUI };
