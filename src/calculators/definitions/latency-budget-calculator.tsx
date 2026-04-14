import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function LatencyBudgetUI() {
  const [budget, setBudget] = useState<string>('500');
  const [s1, setS1] = useState<string>('50');
  const [s1Label, setS1Label] = useState<string>('DNS / Network');
  const [s2, setS2] = useState<string>('30');
  const [s2Label, setS2Label] = useState<string>('Auth Service');
  const [s3, setS3] = useState<string>('150');
  const [s3Label, setS3Label] = useState<string>('API Handler');
  const [s4, setS4] = useState<string>('100');
  const [s4Label, setS4Label] = useState<string>('Database');
  const [s5, setS5] = useState<string>('20');
  const [s5Label, setS5Label] = useState<string>('Response Serialization');

  const totalBudget = parseFloat(budget) || 0;
  const used =
    (parseFloat(s1) || 0) +
    (parseFloat(s2) || 0) +
    (parseFloat(s3) || 0) +
    (parseFloat(s4) || 0) +
    (parseFloat(s5) || 0);
  const remaining = totalBudget - used;
  const pctUsed = totalBudget > 0 ? Math.min((used / totalBudget) * 100, 999) : 0;
  const overBudget = remaining < 0;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Latency Budget</Typography>
      <TextField
        label="Total Latency Budget (ms)"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        slotProps={{ htmlInput: { min: '0', step: '1' } }}
        helperText="The maximum end-to-end response time your SLA allows"
      />
      <Typography variant="subtitle2" color="text.secondary">Service Components</Typography>
      {[
        { label: s1Label, setLabel: setS1Label, val: s1, setVal: setS1 },
        { label: s2Label, setLabel: setS2Label, val: s2, setVal: setS2 },
        { label: s3Label, setLabel: setS3Label, val: s3, setVal: setS3 },
        { label: s4Label, setLabel: setS4Label, val: s4, setVal: setS4 },
        { label: s5Label, setLabel: setS5Label, val: s5, setVal: setS5 },
      ].map(({ label, setLabel, val, setVal }, i) => (
        <Stack key={i} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label={`Service ${i + 1} Name`}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            sx={{ flex: 2 }}
          />
          <TextField
            label="Latency (ms)"
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            slotProps={{ htmlInput: { min: '0', step: '1' } }}
            sx={{ flex: 1 }}
          />
        </Stack>
      ))}
      <Box
        sx={{
          bgcolor: overBudget ? 'error.main' : 'primary.main',
          color: 'primary.contrastText',
          p: 3,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {overBudget ? 'Over Budget by' : 'Remaining Budget'}
        </Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>
          {overBudget ? `+${Math.abs(remaining).toFixed(0)}` : remaining.toFixed(0)} ms
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          {used.toFixed(0)} ms used of {totalBudget.toFixed(0)} ms ({pctUsed.toFixed(1)}%)
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'latency-budget-calculator',
  title: 'Latency Budget Calculator',
  shortTitle: 'Latency Budget',
  description: 'Calculate your latency budget across service components. Allocate ms targets for each layer and instantly see remaining headroom or where you\'re over budget',
  keywords: [
    'latency budget calculator',
    'latency budget',
    'api latency calculator',
    'service latency breakdown',
    'response time budget',
    'p99 latency planning',
    'microservice latency budget',
    'end to end latency calculator',
  ],
  category: 'performance',
  icon: 'Speed',
  tagline: 'Distribute your total response-time SLA across every service layer and instantly see how much headroom remains. Built for backend engineers designing latency-sensitive systems.',
  lastUpdated: 'April 2026',
  intro: 'A latency budget calculator helps you allocate your total end-to-end response time across every layer of your stack — DNS resolution, auth, business logic, database queries, and serialization. Without explicit budgets, each team optimises in isolation and you only discover the problem when the whole system misses its SLA.\n\nDistributed systems engineers, platform teams, and SREs use latency budgets during architecture reviews and capacity planning. If your API promises p99 responses under 500 ms, this tool makes it immediately visible whether your current breakdown leaves sufficient headroom or already exceeds the target.\n\nThe calculation is straightforward: sum each component\'s allocated time and subtract from the total budget. Any positive remainder is headroom; a negative remainder signals you need to optimise at least one layer before shipping. Use the worked examples below as a starting point for common web and microservice architectures.',
  howItWorksTitle: 'How to Calculate a Latency Budget',
  howItWorksImage: '/images/calculators/latency-budget-calculator-how-it-works.svg',
  howItWorks:
    '1. Identify your SLA or target p99 latency — this is your total budget (e.g. 500 ms).\n2. List every service or network hop involved in a single request: DNS, TLS handshake, auth check, main handler, database, caches, downstream APIs, and response serialization.\n3. Assign a realistic latency target to each component based on current benchmarks or p99 measurements from your observability stack.\n4. Sum all component targets and subtract from the total budget.\n5. A positive remainder is headroom for unexpected spikes. Aim for at least 10–20% unallocated buffer.\n6. Re-run the calculator after each optimisation pass to track progress toward your SLA.',
  formula:
    'Remaining Budget = Total Budget − Σ Component Latencies\n\nTotal Budget       — your SLA or p99 target in milliseconds\nComponent Latency  — measured or estimated p99 for each layer\nΣ Components       — sum of all individual component targets\nRemaining Budget   — positive = headroom, negative = over budget',
  examplesTitle: 'Example Latency Budget Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Standard REST API with database (500 ms SLA)',
      body: 'Total Budget:            500 ms\n  DNS / Network:          50 ms\n  TLS + Auth:             30 ms\n  API Handler:            50 ms\n  Primary DB query:      100 ms\n  Cache lookup:           10 ms\n  Response serialization: 20 ms\n                         ────────\n  Total Used:            260 ms\n  Remaining headroom:    240 ms  (48% buffer — healthy)',
    },
    {
      title: 'Example 2 — Microservices fan-out (200 ms SLA)',
      body: 'Total Budget:            200 ms\n  Ingress / LB:           10 ms\n  Auth service:           25 ms\n  Service A (products):   60 ms\n  Service B (inventory):  55 ms\n  Aggregator + render:    30 ms\n  Egress serialization:   15 ms\n                         ────────\n  Total Used:            195 ms\n  Remaining headroom:      5 ms  (2.5% — dangerously thin, optimise Service A or B)',
    },
    {
      title: 'Example 3 — LLM-backed API (3000 ms SLA)',
      body: 'Total Budget:           3000 ms\n  Network round-trip:      80 ms\n  Auth + rate-limit:       20 ms\n  Prompt construction:     50 ms\n  LLM inference:         2400 ms\n  Response parsing:        30 ms\n                         ────────\n  Total Used:            2580 ms\n  Remaining headroom:     420 ms  (14% buffer — acceptable for LLM workloads)',
    },
  ],
  tipsTitle: 'Tips for Managing Your Latency Budget',
  tips: [
    'Measure before you allocate. Use real p99 data from your observability stack (Datadog, Grafana, OpenTelemetry) — not p50 averages. Budget for tail latency, not median.',
    'Reserve 10–20% of your total budget as an unallocated buffer. Unexpected GC pauses, cold starts, and network jitter will consume it.',
    'Treat external API calls as fixed costs. If a downstream service has a p99 of 200 ms you cannot control, build your budget around that constraint first.',
    'Use connection pooling and keep-alives to eliminate repeated TLS handshake latency. A 30 ms handshake per request becomes significant at high traffic.',
    'For database components, distinguish between query execution time and connection acquisition time — both count against the budget and optimise differently.',
    'Re-measure after each deployment. A schema migration, dependency upgrade, or traffic spike can silently shift component latencies and blow your budget.',
  ],
  faq: [
    {
      question: 'What is a latency budget in software engineering?',
      answer: 'A latency budget is the maximum time allocated to each component in a request\'s lifecycle so the total end-to-end response time meets your SLA. For example, if your API must respond in 500 ms, you might allocate 50 ms to the network, 100 ms to the database, and 30 ms to auth — leaving the rest as headroom. It forces explicit ownership of latency across teams.',
    },
    {
      question: 'What is a good latency target for a web API?',
      answer: 'Industry standards vary by use case. Interactive web APIs typically target p99 under 200–500 ms. Payment flows often require sub-100 ms. Real-time communication targets sub-100 ms. LLM-backed APIs commonly accept 1–5 seconds. The right target depends on your users\' expectations — A/B test your specific product to find where latency meaningfully impacts conversion.',
    },
    {
      question: 'How much headroom should I leave in a latency budget?',
      answer: 'A 10–20% unallocated buffer is a common rule of thumb. This absorbs tail-latency spikes, GC pauses, cold starts, and unexpected downstream degradation. For critical paths where you have strict SLAs, lean toward 20%. For internal tooling with softer targets, 10% is acceptable. If you have less than 5% headroom your SLA is at significant risk.',
    },
    {
      question: 'Should I budget for p50, p95, or p99 latency?',
      answer: 'Always budget for p99 or higher for SLA-critical paths. p50 (median) hides the tail experience — if one in a hundred requests blows your budget, that user experiences failure. p99 means 99% of requests are at or below your target. For systems with very high throughput (millions of requests per day), p999 may be worth tracking too.',
    },
    {
      question: 'How do I measure each component\'s latency contribution?',
      answer: 'Use distributed tracing — OpenTelemetry is the standard, with exporters for Jaeger, Tempo, and Datadog APM. Instrument each service boundary with a span. Your trace waterfall view will show exact durations per component. For database queries, enable slow query logging and use EXPLAIN ANALYZE. Once you have p99 measurements per component, plug them directly into this calculator.',
    },
  ],
  relatedSlugs: ['api-rate-limit-calculator', 'json-size-calculator', 'openai-cost-calculator'],
};

export const latencyBudgetCalculator: CalculatorDefinition = { meta, Component: LatencyBudgetUI };
