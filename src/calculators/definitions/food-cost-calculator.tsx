import { useState } from 'react';
import { Stack, Typography, Button, IconButton, Box, TextField } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { MoneyField, NumberField, PercentField, ModeToggle, ResultCard, Notices, EmptyResult, check, num, fmtMoney, fmtPct } from '../primitives';
import { plateCost, periodFoodCost } from '../logic/food-cost';

type Mode = 'plate' | 'period';
type Ingredient = { name: string; cost: string };

function FoodCostUI() {
  const [mode, setMode] = useState<Mode>('plate');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: 'Chicken thighs (2 lb)', cost: '7.80' },
    { name: 'Rice (1 lb)', cost: '1.20' },
    { name: 'Vegetables', cost: '3.50' },
    { name: 'Sauce & spices', cost: '1.50' },
  ]);
  const [portions, setPortions] = useState('4');
  const [price, setPrice] = useState('14');
  const [target, setTarget] = useState('30');

  const [begin, setBegin] = useState('8000');
  const [purchases, setPurchases] = useState('22000');
  const [end, setEnd] = useState('7000');
  const [sales, setSales] = useState('75000');

  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];
  let result = null;

  if (mode === 'plate') {
    const costs = ingredients.map((i) => num(i.cost));
    const p = check(portions, { min: 0, exclusiveMin: true });
    const pr = check(price, { min: 0, exclusiveMin: true, required: false });
    const tg = check(target, { min: 0, exclusiveMin: true, max: 100, required: false });
    if (costs.some((c) => c !== null && c < 0)) notices.push({ severity: 'error', text: 'Ingredient costs cannot be negative.' });
    if (p.value !== null && !notices.length) {
      const r = plateCost(costs.map((c) => c ?? 0), p.value, pr.value, tg.value);
      if (r.foodCostPct !== null && r.foodCostPct >= 100) notices.push({ severity: 'warning', text: 'The portion costs more than its menu price.' });
      result = (
        <ResultCard
          label={r.foodCostPct !== null ? 'Food cost percentage' : 'Cost per portion'}
          value={r.foodCostPct !== null ? fmtPct(r.foodCostPct, 1) : fmtMoney(r.portionCost)}
          sub={r.foodCostPct !== null ? `${fmtMoney(r.portionCost)} cost on a ${fmtMoney(pr.value!)} plate` : undefined}
          rows={[
            { label: 'Recipe cost', value: fmtMoney(r.recipeCost) },
            { label: 'Portions', value: String(p.value) },
            { label: 'Cost per portion', value: fmtMoney(r.portionCost), strong: true },
            ...(r.foodCostPct !== null ? [
              { label: 'Food cost %', value: fmtPct(r.foodCostPct, 1), strong: true },
              { label: 'Gross profit per plate', value: fmtMoney(r.grossProfit!) },
            ] : []),
            ...(r.suggestedPrice !== null ? [{ label: `Menu price for ${fmtPct(tg.value!, 0)} food cost`, value: fmtMoney(r.suggestedPrice), strong: true }] : []),
          ]}
        />
      );
    }
  } else {
    const f = { b: check(begin, { min: 0 }), p: check(purchases, { min: 0 }), e: check(end, { min: 0 }), s: check(sales, { min: 0, exclusiveMin: true }) };
    if (Object.values(f).every((x) => x.value !== null)) {
      const r = periodFoodCost(f.b.value!, f.p.value!, f.e.value!, f.s.value!);
      if (r.cogs < 0) notices.push({ severity: 'error', text: 'Ending inventory is larger than beginning inventory plus purchases — check the counts.' });
      else result = (
        <ResultCard
          label="Food cost percentage"
          value={fmtPct(r.foodCostPct!, 1)}
          sub={`${fmtMoney(r.cogs)} of food used against ${fmtMoney(f.s.value!)} of food sales`}
          rows={[
            { label: 'Beginning inventory', value: fmtMoney(f.b.value!) },
            { label: '+ Purchases', value: fmtMoney(f.p.value!) },
            { label: '− Ending inventory', value: fmtMoney(f.e.value!) },
            { label: '= Cost of food sold', value: fmtMoney(r.cogs), strong: true },
            { label: 'Food sales', value: fmtMoney(f.s.value!) },
            { label: 'Food cost %', value: fmtPct(r.foodCostPct!, 1), strong: true },
          ]}
        />
      );
    }
  }

  const setIng = (i: number, k: keyof Ingredient) => (v: string) => setIngredients((xs) => xs.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Food Cost</Typography>
      <ModeToggle label="Calculate for" value={mode} onChange={setMode} options={[{ value: 'plate', label: 'A menu item' }, { value: 'period', label: 'A period (inventory)' }]} />
      {mode === 'plate' ? (
        <>
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">Ingredients for one batch of the recipe</Typography>
            {ingredients.map((x, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField label="Ingredient" value={x.name} onChange={(e) => setIng(i, 'name')(e.target.value)} sx={{ flex: 2 }} />
                <Box sx={{ flex: 1 }}><MoneyField label="Cost" value={x.cost} onChange={setIng(i, 'cost')} /></Box>
                <IconButton aria-label={`Remove ${x.name || 'ingredient'}`} disabled={ingredients.length <= 1} onClick={() => setIngredients((xs) => xs.filter((_, j) => j !== i))} sx={{ mt: 1 }}>×</IconButton>
              </Box>
            ))}
            <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }} onClick={() => setIngredients((xs) => [...xs, { name: '', cost: '' }])}>Add ingredient</Button>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <NumberField label="Portions per batch" value={portions} onChange={setPortions} step="1" />
            <MoneyField label="Menu price per portion" value={price} onChange={setPrice} helperText="Optional" />
            <PercentField label="Target food cost" value={target} onChange={setTarget} helperText="Optional — suggests a price" />
          </Stack>
        </>
      ) : (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <MoneyField label="Beginning inventory" value={begin} onChange={setBegin} />
            <MoneyField label="Purchases during period" value={purchases} onChange={setPurchases} />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <MoneyField label="Ending inventory" value={end} onChange={setEnd} />
            <MoneyField label="Food sales for the period" value={sales} onChange={setSales} />
          </Stack>
        </>
      )}
      {result ?? (notices.length === 0 && <EmptyResult />)}
      <Notices items={notices} />
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'food-cost-calculator',
  title: 'Food Cost Calculator',
  h1: 'Food Cost Calculator',
  shortTitle: 'Food Cost',
  description: 'Food cost calculator for restaurants: plate cost and food cost percentage for a menu item, a menu price for your target food cost, or period food cost from inventory.',
  keywords: ['food cost calculator', 'food cost percentage', 'plate cost calculator', 'recipe cost calculator', 'restaurant food cost formula', 'menu price calculator'],
  category: 'business',
  icon: 'Restaurant',
  tagline: 'Cost a recipe per portion and see its food cost percentage — or work out a menu price for the food cost you want. Includes the inventory method for a whole period.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `Food cost percentage is the share of a menu price (or of total food sales) spent on ingredients. A plate that costs $3.50 to make and sells for $14 has a 25% food cost.\n\nThis food cost calculator works two ways. <strong>Menu item</strong> mode costs a recipe: list each ingredient's cost for one batch, enter how many portions the batch makes, and see the cost per portion, the food cost percentage at your menu price, and the price that would hit a target percentage. <strong>Period</strong> mode uses the standard inventory method — beginning inventory plus purchases minus ending inventory — to find what your kitchen actually used against food sales for a week or month.\n\nThe two numbers answer different questions. Plate cost is the theoretical cost if every portion is made to spec. Period food cost is the actual result, including waste, spoilage, over-portioning and comps. A large gap between the two is worth investigating.`,
  howItWorksTitle: 'How to Calculate Food Cost Percentage',
  howItWorks: '1. Menu item: add up the cost of every ingredient in one batch of the recipe, using what you actually pay for the quantity used.\n2. Divide by the number of portions the batch yields to get cost per portion.\n3. Food cost % = cost per portion ÷ menu price × 100.\n4. To price for a target: menu price = cost per portion ÷ (target % ÷ 100).\n5. Period: cost of food sold = beginning inventory + purchases − ending inventory; food cost % = that ÷ food sales × 100.',
  formula: 'Menu item\n  Portion cost   = Σ ingredient costs ÷ portions\n  Food cost %    = Portion cost ÷ Menu price × 100\n  Price for target = Portion cost ÷ (Target% ÷ 100)\n\nPeriod (inventory method)\n  Cost of food sold = Beginning inventory + Purchases − Ending inventory\n  Food cost %       = Cost of food sold ÷ Food sales × 100',
  examplesTitle: 'Food Cost Examples',
  example: '',
  examples: [
    { title: 'Example 1 — Chicken rice bowl (default inputs)', body: 'Ingredients: $7.80 + $1.20 + $3.50 + $1.50 = $14.00 per batch\nPortions: 4 → $3.50 per bowl\nMenu price $14.00 → food cost 3.50 ÷ 14.00 = 25.0%\nPrice for a 30% target: 3.50 ÷ 0.30 = $11.67' },
    { title: 'Example 2 — Pricing a new dish to a 28% target', body: 'Portion cost: $4.20\nMenu price = 4.20 ÷ 0.28 = $15.00\nGross profit per plate: $10.80' },
    { title: 'Example 3 — Monthly food cost from inventory', body: 'Beginning inventory $8,000 + purchases $22,000 − ending inventory $7,000\n= $23,000 cost of food sold\nFood sales $75,000 → 23,000 ÷ 75,000 = 30.7%' },
  ],
  tipsTitle: 'Food Costing Tips',
  tips: [
    'Cost ingredients at the as-used quantity after trimming and cooking loss, not the as-purchased weight, or plate cost will look lower than reality.',
    'Recost recipes when supplier prices change. A menu priced on last year\'s costs drifts quietly.',
    'Count inventory the same way, at the same time, each period. Period food cost is only as good as the counts.',
    'Food cost is one input to pricing. To see the same relationship as markup or margin, use the <a href="/calculators/markup-calculator">markup calculator</a>.',
  ],
  faq: [
    {
      question: 'How do I calculate food cost percentage?',
      answer: 'Divide the cost of the ingredients in a dish by its menu price and multiply by 100. A dish costing $4 to make that sells for $16 has a 25% food cost. For a whole period, divide cost of food sold (beginning inventory + purchases − ending inventory) by food sales.',
    },
    {
      question: 'How do I set a menu price from food cost?',
      answer: 'Divide the cost per portion by your target food cost as a decimal. For a $4.20 portion and a 30% target, the price is 4.20 ÷ 0.30 = $14.00. Then round to a price that fits your menu and check it against what similar dishes sell for locally.',
    },
    {
      question: 'Why is my actual food cost higher than my plate cost?',
      answer: 'Plate cost assumes every portion is made exactly to recipe with no loss. Actual (period) food cost also includes waste, spoilage, over-portioning, staff meals, comps and theft. Comparing the two each period shows how much is being lost between the recipe card and the plate.',
    },
  ],
  relatedSlugs: ['markup-calculator', 'commission-calculator'],
};

export const foodCostCalculator: CalculatorDefinition = { meta, Component: FoodCostUI };
