import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { NumberField, MoneyField, ResultCard, Notices, EmptyResult, check, fmtMoney, fmtNum } from '../primitives';
import { energyCost } from '../logic/energy-cost';
import price from '../../data/electrical/electricity-price.json';

const DEFAULT_RATE = (price.centsPerKwh / 100).toFixed(4);

function EnergyCostUI() {
  const [watts, setWatts] = useState('1500');
  const [hours, setHours] = useState('4');
  const [days, setDays] = useState('7');
  const [qty, setQty] = useState('1');
  const [rate, setRate] = useState(DEFAULT_RATE);

  const w = check(watts, { min: 0 });
  const h = check(hours, { min: 0, max: 24 });
  const d = check(days, { min: 0, max: 7 });
  const q = check(qty, { min: 0 });
  const r = check(rate, { min: 0 });
  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];
  if (rate === DEFAULT_RATE) notices.push({ severity: 'info', text: `Using the US residential average of ${price.centsPerKwh}¢/kWh (${price.period}, EIA). Replace it with the rate on your bill for an accurate answer.` });

  let result = null;
  if ([w, h, d, q, r].every((x) => x.value !== null)) {
    const e = energyCost(w.value!, h.value!, d.value!, q.value!, r.value!);
    result = (
      <ResultCard
        label="Cost per month"
        value={fmtMoney(e.costPerMonth)}
        sub={`${fmtMoney(e.costPerYear)} per year · ${fmtNum(e.kwhPerMonth, 1)} kWh per month`}
        rows={[
          { label: 'Cost per hour of use', value: fmtMoney(e.costPerHour) },
          { label: 'Cost per day (average)', value: fmtMoney(e.costPerDay) },
          { label: 'Cost per month', value: fmtMoney(e.costPerMonth), strong: true },
          { label: 'Cost per year', value: fmtMoney(e.costPerYear), strong: true },
          { label: 'Energy per day (average)', value: `${fmtNum(e.kwhPerDay, 3)} kWh` },
          { label: 'Energy per month', value: `${fmtNum(e.kwhPerMonth, 2)} kWh` },
          { label: 'Energy per year', value: `${fmtNum(e.kwhPerYear, 1)} kWh` },
        ]}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Electricity Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <NumberField label="Power draw" value={watts} onChange={setWatts} suffix="W" error={w.error} helperText="From the label, or measured with a plug-in meter" />
        <NumberField label="Number of devices" value={qty} onChange={setQty} error={q.error} step="1" />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <NumberField label="Hours used per day" value={hours} onChange={setHours} suffix="h" error={h.error} />
        <NumberField label="Days used per week" value={days} onChange={setDays} error={d.error} />
      </Stack>
      <MoneyField label="Electricity rate (per kWh)" value={rate} onChange={setRate} error={r.error} helperText="Your bill's total cost ÷ kWh used gives your all-in rate" />
      {result ?? <EmptyResult />}
      <Notices items={notices} />
    </Stack>
  );
}

const avg = price.centsPerKwh / 100;
const ex1 = energyCost(1500, 4, 7, 1, avg);
const ex2 = energyCost(10, 24, 7, 1, avg);
const ex3 = energyCost(150, 8, 5, 4, 0.13);

const meta: CalculatorMeta = {
  slug: 'energy-cost-calculator',
  title: 'Energy Cost Calculator',
  h1: 'Energy Cost Calculator — Electricity Cost of Any Device',
  shortTitle: 'Energy Cost',
  description: 'Energy cost calculator: enter watts, hours of use and your electricity rate to see kWh and running cost per hour, day, month and year for any appliance or device.',
  keywords: ['energy cost calculator', 'electricity cost calculator', 'power consumption calculator', 'kwh cost calculator', 'appliance energy cost', 'cost to run calculator'],
  category: 'electrical',
  icon: 'Bolt',
  tagline: 'How much does it cost to run? Enter the wattage, how long it runs and your rate per kWh to get the cost per hour, month and year.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `Utilities bill electricity by the kilowatt-hour (kWh): 1,000 watts running for one hour. Multiply a device's wattage by its hours of use, divide by 1,000, and you have the kWh. Multiply by your rate and you have the cost.\n\nThis energy cost calculator does that for one device or several identical ones. It accounts for days of use per week, so a work computer used five days a week isn't billed like a fridge running every day. It reports cost per hour of use, the average per day, and totals per month and year.\n\nThe rate box starts at the US residential average from the Energy Information Administration (${price.centsPerKwh}¢/kWh, ${price.period}). Rates vary widely by state and utility, so replace it with yours. Dividing your bill's total by the kWh it lists gives an all-in rate that includes delivery charges.`,
  howItWorksTitle: 'How to Calculate Electricity Cost',
  howItWorks: '1. Find the device\'s power draw in watts. It is on the label or charger, or you can measure it with a plug-in energy meter for devices whose draw varies.\n2. kWh per day of use = watts × hours per day × number of devices ÷ 1,000.\n3. Yearly kWh = kWh per day of use × days per week × 52.14 (365 ÷ 7).\n4. Monthly kWh = yearly ÷ 12.\n5. Cost = kWh × your rate per kWh.',
  formula: 'kWh per use-day = W × h × qty ÷ 1000\nkWh per year     = kWh per use-day × days/week × 365 ÷ 7\nkWh per month    = kWh per year ÷ 12\nCost             = kWh × rate ($/kWh)\nCost per hour    = W × qty ÷ 1000 × rate\n\nW — power draw in watts   h — hours used per day\nqty — number of identical devices   rate — price per kWh',
  examplesTitle: 'Electricity Cost Examples',
  example: '',
  examples: [
    { title: `Example 1 — 1,500 W space heater, 4 h/day, at ${price.centsPerKwh}¢/kWh`, body: `1,500 × 4 ÷ 1000 = 6 kWh per day\nPer month: ${ex1.kwhPerMonth.toFixed(1)} kWh × $${avg.toFixed(4)} = $${ex1.costPerMonth.toFixed(2)}\nPer year:  ${ex1.kwhPerYear.toFixed(0)} kWh × $${avg.toFixed(4)} = $${ex1.costPerYear.toFixed(2)}` },
    { title: `Example 2 — 10 W device left on 24/7, at ${price.centsPerKwh}¢/kWh`, body: `10 × 24 ÷ 1000 = 0.24 kWh per day\nPer year: ${ex2.kwhPerYear.toFixed(1)} kWh → $${ex2.costPerYear.toFixed(2)}` },
    { title: 'Example 3 — Four 150 W office PCs, 8 h/day, 5 days/week, at 13¢/kWh', body: `150 × 8 × 4 ÷ 1000 = 4.8 kWh per workday\nPer year: 4.8 × 5 × 52.14 = ${ex3.kwhPerYear.toFixed(0)} kWh → $${ex3.costPerYear.toFixed(2)}\nPer month: $${ex3.costPerMonth.toFixed(2)}` },
  ],
  tipsTitle: 'Tips for an Accurate Estimate',
  tips: [
    'Label wattage is often a maximum. Fridges, AC units and PCs cycle or vary their draw, so a plug-in meter reading over a day gives a truer kWh.',
    'Use your all-in rate (total bill ÷ kWh) rather than the headline energy charge, which leaves out delivery and other per-kWh fees.',
    'Time-of-use plans charge different rates at different hours. Run the calculation once per rate period if a device runs across them.',
    'Planning a new circuit for a big load? Convert its watts with the <a href="/calculators/amp-calculator">amp calculator</a>, then size the wire with the <a href="/calculators/wire-size-calculator">wire size calculator</a>.',
  ],
  methodology: {
    verified: price.lastVerified,
    assumptions: [
      'Constant power draw while the device is in use. For cycling appliances, enter an average wattage or measured kWh-equivalent hours.',
      'A year is 365 days and a month is one-twelfth of a year. "Cost per day" is the yearly cost averaged over every day, including days the device is off.',
      `The default rate is the US residential average, ${price.centsPerKwh}¢/kWh, for the ${price.period}. ${price.note}`,
      'Tiered and time-of-use pricing, fixed monthly charges and taxes are not modeled. Enter an all-in rate to include them approximately.',
    ],
    sources: price.sources,
  },
  faq: [
    {
      question: 'How do I calculate the cost of running an appliance?',
      answer: 'Multiply its wattage by the hours it runs, divide by 1,000 to get kWh, then multiply by your electricity rate. A 1,000 W appliance running 2 hours uses 2 kWh; at $0.18 per kWh that is $0.36.',
    },
    {
      question: 'What is the average electricity rate in the US?',
      answer: `According to the US Energy Information Administration, the average residential price was ${price.centsPerKwh}¢ per kWh over the ${price.period}. Rates differ a lot between states and utilities, so use the rate from your own bill when you can.`,
    },
    {
      question: 'How many kWh does a device use per month?',
      answer: 'Multiply watts by hours used per day and by days used per month, then divide by 1,000. A 100 W device running 10 hours a day for 30 days uses 100 × 10 × 30 ÷ 1,000 = 30 kWh.',
    },
  ],
  relatedSlugs: ['amp-calculator', 'wire-size-calculator'],
};

export const energyCostCalculator: CalculatorDefinition = { meta, Component: EnergyCostUI };
