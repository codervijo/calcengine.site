import { useState } from 'react';
import { Stack, Typography, Button, IconButton, Box, TextField } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { NumberField, ResultCard, Notices, EmptyResult, num, fmtNum, fmtPct } from '../primitives';
import { weightedAverage } from '../logic/weighted-average';

type Row = { label: string; value: string; weight: string };

function WeightedAverageUI() {
  const [rows, setRows] = useState<Row[]>([
    { label: 'Homework', value: '92', weight: '20' },
    { label: 'Midterm', value: '78', weight: '30' },
    { label: 'Final exam', value: '85', weight: '50' },
  ]);

  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];
  const parsed = rows.map((r, i) => ({ label: r.label.trim() || `Row ${i + 1}`, value: num(r.value), weight: num(r.weight) }));
  const complete = parsed.filter((p): p is { label: string; value: number; weight: number } => p.value !== null && p.weight !== null);
  const partial = parsed.filter((p) => (p.value === null) !== (p.weight === null)).length;
  if (partial > 0) notices.push({ severity: 'info', text: `${partial} row${partial > 1 ? 's are' : ' is'} missing a value or weight and ${partial > 1 ? 'are' : 'is'} ignored.` });

  let result = null;
  const r = weightedAverage(complete);
  if (r === 'negative-weight') notices.push({ severity: 'error', text: 'Weights cannot be negative.' });
  else if (r === 'zero-weight') notices.push({ severity: 'error', text: 'The weights add up to zero — at least one must be positive.' });
  else if (r !== 'no-rows') {
    result = (
      <ResultCard
        label="Weighted average"
        value={fmtNum(r.weightedAverage, 4)}
        sub={`Simple (unweighted) average: ${fmtNum(r.simpleAverage, 4)}`}
        rows={[
          { label: 'Σ (value × weight)', value: fmtNum(r.weightedSum, 4) },
          { label: 'Σ weights', value: fmtNum(r.totalWeight, 4) },
          { label: 'Weighted average', value: fmtNum(r.weightedAverage, 4), strong: true },
          ...complete.map((c, i) => ({ label: `${c.label} — share of weight`, value: fmtPct(r.shares[i], 1) })),
        ]}
      />
    );
  }

  const setRow = (i: number, k: keyof Row) => (v: string) => setRows((xs) => xs.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate a Weighted Average</Typography>
      <Stack spacing={1.5}>
        {rows.map((x, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField label="Label (optional)" value={x.label} onChange={(e) => setRow(i, 'label')(e.target.value)} sx={{ flex: { xs: '1 1 100%', sm: 2 } }} />
            <Box sx={{ flex: 1 }}><NumberField label="Value" value={x.value} onChange={setRow(i, 'value')} /></Box>
            <Box sx={{ flex: 1 }}><NumberField label="Weight" value={x.weight} onChange={setRow(i, 'weight')} /></Box>
            <IconButton aria-label={`Remove row ${i + 1}`} disabled={rows.length <= 1} onClick={() => setRows((xs) => xs.filter((_, j) => j !== i))} sx={{ mt: 1 }}>×</IconButton>
          </Box>
        ))}
        <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }} disabled={rows.length >= 30} onClick={() => setRows((xs) => [...xs, { label: '', value: '', weight: '' }])}>Add row</Button>
      </Stack>
      {result ?? (notices.length === 0 && <EmptyResult text="Enter at least one value with a weight." />)}
      <Notices items={notices} />
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'weighted-average-calculator',
  title: 'Weighted Average Calculator',
  h1: 'Weighted Average Calculator',
  shortTitle: 'Weighted Average',
  description: 'Weighted average calculator: enter values and weights to get the weighted mean, with the formula, each item\'s share of the weight, and examples for grades and prices.',
  keywords: ['weighted average calculator', 'weighted mean calculator', 'weighted average formula', 'how to calculate weighted average', 'weighted grade calculator', 'weighted average price'],
  category: 'math',
  icon: 'Functions',
  tagline: 'Add values and their weights — grades and percentages, prices and quantities, scores and credits — and get the weighted average with the working shown.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `A weighted average gives some values more influence than others. Each value is multiplied by its weight, the products are added up, and the total is divided by the sum of the weights. When every weight is the same, it equals the ordinary average.\n\nYou need one whenever items don't count equally. A final exam worth 50% of a course grade counts more than homework worth 20%. A stock bought as 300 shares counts more toward your average cost than 50 shares bought later. A product's average selling price depends on how many units sold at each price.\n\nWeights can be percentages, credits, quantities or any other positive numbers — they don't have to add up to 100. This weighted average calculator divides by whatever total you enter, and also shows the simple average so you can see how much the weighting changes the result.`,
  howItWorksTitle: 'How to Calculate a Weighted Average',
  howItWorks: '1. List each value with its weight (e.g. score 78, weight 30%).\n2. Multiply each value by its weight.\n3. Add up all those products.\n4. Add up all the weights.\n5. Divide the sum of products by the sum of weights.',
  formula: 'Weighted average = Σ (xᵢ × wᵢ) ÷ Σ wᵢ\n\nxᵢ — each value (score, price, rate…)\nwᵢ — its weight (percentage, credits, quantity…)\n\nIf the weights already sum to 1 (or 100%), the division just undoes the scaling.',
  examplesTitle: 'Weighted Average Examples',
  example: '',
  examples: [
    { title: 'Example 1 — Course grade (default inputs)', body: 'Homework   92 × 20 = 1,840\nMidterm    78 × 30 = 2,340\nFinal      85 × 50 = 4,250\nΣ = 8,430 ÷ Σ weights 100 = 84.3\n(Simple average of the three scores: 85.0)' },
    { title: 'Example 2 — Average cost per share', body: '300 shares at $42.00 → 12,600\n 50 shares at $55.00 →  2,750\nΣ = 15,350 ÷ 350 shares = $43.86 average cost per share' },
    { title: 'Example 3 — GPA with credit hours as weights', body: 'A (4.0) × 4 credits = 16.0\nB (3.0) × 3 credits =  9.0\nC (2.0) × 2 credits =  4.0\nΣ = 29.0 ÷ 9 credits = 3.22' },
  ],
  tipsTitle: 'Getting Weighted Averages Right',
  tips: [
    'Weights do not have to sum to 100. 2:1:1 works the same as 50%:25%:25%.',
    'Use quantities, not prices, as weights when averaging prices: the weight is how much was bought or sold at each price.',
    'A weighted average of percentages needs the right base. To average conversion rates across pages, weight each rate by its visitors, not equally.',
    'Working out what score you need on a final? Enter the grades so far, add the final with its weight, and adjust its value until the average hits your target.',
  ],
  faq: [
    {
      question: 'What is the difference between a weighted average and a regular average?',
      answer: 'A regular (arithmetic) average treats every value equally: add them up and divide by how many there are. A weighted average multiplies each value by a weight first and divides by the total weight, so some values count more. With equal weights the two are identical.',
    },
    {
      question: 'Do the weights need to add up to 100%?',
      answer: 'No. The formula divides by the sum of the weights, so any positive numbers work: percentages, credits, units sold. Weights of 20, 30 and 50 give the same result as 0.2, 0.3 and 0.5, or 2, 3 and 5.',
    },
    {
      question: 'How do I calculate a weighted grade?',
      answer: 'Multiply each category score by its percentage weight, add the results, and divide by the total of the weights. If your syllabus weights only add up to the parts completed so far (say 50%), the result is your current grade on the work done.',
    },
  ],
  relatedSlugs: ['markup-calculator', 'commission-calculator', 'food-cost-calculator'],
};

export const weightedAverageCalculator: CalculatorDefinition = { meta, Component: WeightedAverageUI };
