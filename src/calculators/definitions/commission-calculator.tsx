import { useState } from 'react';
import { Stack, Typography, Button, IconButton, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { MoneyField, PercentField, ModeToggle, ResultCard, Notices, EmptyResult, check, num, fmtMoney, fmtPct } from '../primitives';
import { commission, salesForCommission, validateTiers, type Tier } from '../logic/commission';

type Kind = 'flat' | 'graduated' | 'whole';
type TierInput = { upTo: string; pct: string };

function CommissionUI() {
  const [kind, setKind] = useState<Kind>('flat');
  const [sales, setSales] = useState('50000');
  const [rate, setRate] = useState('5');
  const [split, setSplit] = useState('100');
  const [base, setBase] = useState('0');
  const [target, setTarget] = useState('');
  const [tiers, setTiers] = useState<TierInput[]>([
    { upTo: '10000', pct: '5' },
    { upTo: '25000', pct: '7' },
    { upTo: '', pct: '10' },
  ]);

  const s = check(sales, { min: 0 });
  const r = check(rate, { min: 0, max: 100 });
  const sp = check(split, { min: 0, max: 100 });
  const b = check(base, { min: 0 });
  const t = check(target, { min: 0, exclusiveMin: true, required: false });
  const parsedTiers: Tier[] = tiers.map((x, i) => ({ upTo: i === tiers.length - 1 && x.upTo.trim() === '' ? null : num(x.upTo), pct: num(x.pct) ?? NaN }));
  const tierError = kind === 'flat' ? null
    : parsedTiers.some((x, i) => Number.isNaN(x.pct) || (x.upTo === null && i !== tiers.length - 1)) ? 'Fill in every tier (leave only the last limit blank)'
    : validateTiers(parsedTiers);

  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];
  if (tierError) notices.push({ severity: 'error', text: tierError });

  let result = null;
  const ok = s.value !== null && sp.value !== null && b.value !== null && (kind !== 'flat' || r.value !== null) && !tierError;
  if (ok) {
    const plan = kind === 'flat' ? { kind: 'flat' as const, pct: r.value! } : { kind, tiers: parsedTiers };
    const res = commission(s.value!, plan, sp.value!, b.value!);
    const rowsOut = [
      { label: 'Sales', value: fmtMoney(s.value!) },
      ...res.perTier.filter((p) => p.amount > 0 || p.from < s.value!).map((p) => ({
        label: `${fmtMoney(p.from)} – ${p.to === null ? 'and up' : fmtMoney(p.to)} at ${fmtPct(p.pct, 1)}`,
        value: fmtMoney(p.amount),
      })),
      { label: 'Gross commission', value: fmtMoney(res.commission) },
      ...(sp.value! < 100 ? [{ label: `Your share (${fmtPct(sp.value!, 0)} split)`, value: fmtMoney(res.yourCommission) }] : []),
      ...(b.value! > 0 ? [{ label: 'Base pay', value: fmtMoney(b.value!) }, { label: 'Total pay', value: fmtMoney(res.totalPay), strong: true }] : []),
      { label: 'Effective commission rate', value: fmtPct(res.effectivePct) },
    ];
    if (kind === 'flat' && t.value !== null) {
      const need = salesForCommission(t.value, r.value!, sp.value!);
      rowsOut.push({ label: `Sales needed to earn ${fmtMoney(t.value)}`, value: need === null ? 'n/a (0% rate)' : fmtMoney(need), strong: true });
    }
    result = <ResultCard label={sp.value! < 100 ? 'Your commission' : 'Commission'} value={fmtMoney(res.yourCommission)} sub={b.value! > 0 ? `Total pay ${fmtMoney(res.totalPay)}` : undefined} rows={rowsOut} />;
  }

  const setTier = (i: number, k: keyof TierInput) => (v: string) => setTiers((ts) => ts.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Commission</Typography>
      <ModeToggle
        label="Commission plan"
        value={kind}
        onChange={setKind}
        options={[{ value: 'flat', label: 'Flat rate' }, { value: 'graduated', label: 'Tiered (each band)' }, { value: 'whole', label: 'Tiered (whole sale)' }]}
      />
      <MoneyField label="Sales amount" value={sales} onChange={setSales} error={s.error} />
      {kind === 'flat' ? (
        <PercentField label="Commission rate" value={rate} onChange={setRate} error={r.error} />
      ) : (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            {kind === 'graduated' ? 'Each rate applies only to the sales inside its band.' : 'The rate of the band your total lands in applies to all sales.'}
          </Typography>
          {tiers.map((x, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <MoneyField label={i === tiers.length - 1 ? 'Up to (blank = no limit)' : `Tier ${i + 1} up to`} value={x.upTo} onChange={setTier(i, 'upTo')} />
              <PercentField label="Rate" value={x.pct} onChange={setTier(i, 'pct')} />
              <IconButton aria-label={`Remove tier ${i + 1}`} disabled={tiers.length <= 1} onClick={() => setTiers((ts) => ts.filter((_, j) => j !== i))} sx={{ mt: 1 }}>×</IconButton>
            </Box>
          ))}
          <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }} disabled={tiers.length >= 6} onClick={() => setTiers((ts) => [...ts.slice(0, -1), { upTo: '', pct: '' }, ts[ts.length - 1]])}>Add tier</Button>
        </Stack>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <PercentField label="Your split of the commission" value={split} onChange={setSplit} error={sp.error} helperText="100% unless you share it (e.g. with a broker)" />
        <MoneyField label="Base pay for the period" value={base} onChange={setBase} error={b.error} />
      </Stack>
      {kind === 'flat' && <MoneyField label="Target commission (optional)" value={target} onChange={setTarget} error={t.error} helperText="Shows the sales you need to reach it" />}
      {result ?? (notices.length === 0 && <EmptyResult />)}
      <Notices items={notices} />
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'commission-calculator',
  title: 'Commission Calculator',
  h1: 'Commission Calculator',
  shortTitle: 'Commission',
  description: 'Commission calculator for flat-rate and tiered plans: sales commission, your share after a split, total pay with base salary, and the sales needed to hit a target.',
  keywords: ['commission calculator', 'sales commission calculator', 'tiered commission calculator', 'real estate commission calculator', 'commission split calculator', 'how to calculate commission'],
  category: 'business',
  icon: 'Percent',
  tagline: 'Flat or tiered commission, with an optional split and base pay — see what a deal or a month of sales actually pays you.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `This commission calculator handles the three plan structures you are most likely to meet.\n\n<strong>Flat rate:</strong> one percentage on all sales. <strong>Tiered by band</strong> (also called graduated or marginal): each rate applies only to the sales that fall inside its band, the way income tax brackets work. <strong>Tiered on the whole sale:</strong> once your total reaches a band, that band's rate applies to every dollar.\n\nOn the same sales total, the two tiered methods can pay very different amounts. Read your plan document carefully to see which one it uses.\n\nIf you share the commission — a real estate agent splitting with a brokerage, or a team pooling commission — set your split percentage. Add base pay to see total earnings for the period. For flat plans, enter a target and the calculator works backwards to the sales you need.`,
  howItWorksTitle: 'How to Calculate Commission',
  howItWorks: '1. Flat rate: commission = sales × rate.\n2. Tiered by band: split sales across the bands, multiply each slice by its rate, and add them up.\n3. Tiered on the whole sale: find the band your total falls in and apply that one rate to all sales.\n4. Apply your split: your commission = gross commission × your split %.\n5. Add base pay for total earnings. Effective rate = your commission ÷ sales.',
  formula: 'Flat:            Commission = Sales × Rate%\nTiered (band):   Commission = Σ (sales inside band i × Rate_i%)\nTiered (whole):  Commission = Sales × Rate% of the band Sales falls in\n\nYour commission = Commission × Split%\nTotal pay       = Base pay + Your commission\nEffective rate  = Your commission ÷ Sales × 100\nSales needed    = Target ÷ (Rate% × Split%)        (flat plans)',
  examplesTitle: 'Commission Examples',
  example: '',
  examples: [
    { title: 'Example 1 — Flat 5% on $50,000 of sales', body: '$50,000 × 5% = $2,500 commission\nWith $3,000 base pay: total pay $5,500 · effective rate 5%' },
    { title: 'Example 2 — Tiered: 5% to $10k, 7% to $25k, 10% above; $30,000 sales', body: 'By band:   $10,000 × 5% = $500\n           $15,000 × 7% = $1,050\n            $5,000 × 10% = $500\n           Total $2,050 (6.83% effective)\n\nWhole sale: $30,000 falls in the 10% band → $3,000' },
    { title: 'Example 3 — 3% commission on a $400,000 home, 70% split', body: 'Gross: $400,000 × 3% = $12,000\nYour share: $12,000 × 70% = $8,400\nEffective rate on the sale price: 2.1%' },
  ],
  tipsTitle: 'Commission Plan Tips',
  tips: [
    'Ask whether tiers are marginal (by band) or retroactive (whole sale). On the same sales, the difference can be thousands.',
    'Check whether commission is calculated on revenue, gross profit or collected payments. This calculator assumes the sales figure you enter is the commission base.',
    'If you set prices, see how commission and your <a href="/calculators/markup-calculator">markup</a> interact. Commission paid on price comes out of margin.',
    'For restaurant and hospitality incentive plans, compare against <a href="/calculators/food-cost-calculator">food cost</a> targets.',
  ],
  faq: [
    {
      question: 'How do you calculate a 10% commission?',
      answer: 'Multiply the sales amount by 0.10. On $8,000 of sales, a 10% commission is $800. If you split commission with someone, multiply again by your share: at a 60% split, you keep $480.',
    },
    {
      question: 'What is a tiered commission structure?',
      answer: 'A plan where the rate rises as sales increase. In a graduated plan, each rate applies only to the sales inside its band. In a whole-sale (retroactive) plan, reaching a higher band raises the rate on all sales. Pick the matching mode above.',
    },
    {
      question: 'How is real estate commission split?',
      answer: 'The total commission (a percentage of the sale price) is usually divided between the buyer\'s and seller\'s brokerages, and each agent then splits their side with their brokerage. Enter the commission percentage your side receives and your personal split to see your share. Rates and splits are negotiable and vary by agreement.',
    },
  ],
  relatedSlugs: ['markup-calculator', 'food-cost-calculator', 'paypal-fee-calculator'],
};

export const commissionCalculator: CalculatorDefinition = { meta, Component: CommissionUI };
