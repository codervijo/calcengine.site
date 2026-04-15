import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function RetryBackoffUI() {
  const [initialDelay, setInitialDelay] = useState<string>('100');
  const [multiplier, setMultiplier] = useState<string>('2');
  const [maxRetries, setMaxRetries] = useState<string>('5');
  const [maxDelay, setMaxDelay] = useState<string>('30000');

  const base = parseFloat(initialDelay) || 0;
  const mult = parseFloat(multiplier) || 1;
  const retries = Math.min(Math.max(Math.floor(parseFloat(maxRetries) || 0), 1), 10);
  const cap = parseFloat(maxDelay) || Infinity;

  const attempts = Array.from({ length: retries }, (_, i) => {
    const delay = Math.min(cap, base * Math.pow(mult, i));
    return { attempt: i + 1, delay };
  });

  const totalWait = attempts.reduce((sum, a) => sum + a.delay, 0);

  const fmt = (ms: number) => {
    if (ms >= 60000) return `${(ms / 60000).toFixed(2)} min`;
    if (ms >= 1000) return `${(ms / 1000).toFixed(2)} s`;
    return `${ms.toFixed(0)} ms`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Retry Backoff Delays</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Initial Delay (ms)"
          type="number"
          value={initialDelay}
          onChange={(e) => setInitialDelay(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '50' } }}
        />
        <TextField
          label="Backoff Multiplier"
          type="number"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '0.5' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Max Retries"
          type="number"
          value={maxRetries}
          onChange={(e) => setMaxRetries(e.target.value)}
          slotProps={{ htmlInput: { min: '1', max: '10', step: '1' } }}
        />
        <TextField
          label="Max Delay Cap (ms)"
          type="number"
          value={maxDelay}
          onChange={(e) => setMaxDelay(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1000' } }}
        />
      </Stack>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', bgcolor: 'grey.100', px: 2, py: 1 }}>
          <Typography variant="caption" fontWeight={700}>Attempt</Typography>
          <Typography variant="caption" fontWeight={700}>Delay</Typography>
          <Typography variant="caption" fontWeight={700}>Cumulative Wait</Typography>
        </Box>
        {attempts.reduce<{ rows: JSX.Element[]; cumulative: number }>(
          ({ rows, cumulative }, a) => {
            const newCumulative = cumulative + a.delay;
            rows.push(
              <Box
                key={a.attempt}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  px: 2,
                  py: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: a.attempt % 2 === 0 ? 'grey.50' : 'background.paper',
                }}
              >
                <Typography variant="body2"># {a.attempt}</Typography>
                <Typography variant="body2" fontFamily="monospace">{fmt(a.delay)}</Typography>
                <Typography variant="body2" fontFamily="monospace" color="text.secondary">{fmt(newCumulative)}</Typography>
              </Box>
            );
            return { rows, cumulative: newCumulative };
          },
          { rows: [], cumulative: 0 }
        ).rows}
      </Box>

      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Wait Across All Retries</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{fmt(totalWait)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          {retries} retries · last delay {fmt(attempts[attempts.length - 1]?.delay ?? 0)}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'retry-backoff-calculator',
  title: 'Retry Backoff Calculator',
  shortTitle: 'Retry Backoff',
  description: 'Calculate exponential retry backoff delays for your API calls. Enter initial delay, multiplier, and max retries to see per-attempt wait times and total retry budget instantly.',
  keywords: [
    'retry backoff calculator',
    'exponential backoff calculator',
    'retry delay calculator',
    'api retry strategy',
    'backoff multiplier calculator',
    'retry budget calculator',
    'exponential backoff formula',
    'api error retry timing',
  ],
  category: 'api',
  icon: 'Replay',
  tagline: 'Instantly compute exponential backoff delays for every retry attempt. Tune your initial delay, multiplier, and cap to build a retry strategy that avoids thundering herd while staying within latency budgets.',
  lastUpdated: 'April 2026',
  intro: 'A retry backoff calculator takes the guesswork out of designing fault-tolerant API clients. Exponential backoff is the standard pattern for retrying failed requests — each attempt waits longer than the last, reducing hammering on an already-stressed upstream service.\n\nWithout the right parameters, retries can make outages worse. Too short a base delay floods a degraded API with requests; too long a max cap leaves your users waiting indefinitely. This calculator lets you preview every retry delay and the total wait time before you write a single line of code.\n\nBackend engineers, platform teams, and API integrators use retry backoff settings when connecting to third-party services, cloud APIs (AWS, GCP, Stripe, Twilio), and internal microservices. Getting these numbers right is the difference between graceful degradation and a cascading failure.\n\nThe formula below is provider-agnostic. Whether you are configuring axios-retry, tenacity in Python, Polly in .NET, or a custom fetch wrapper in TypeScript, plug your target values in and validate the timing before deploying.',
  howItWorksTitle: 'How to Calculate Retry Backoff Delays',
  howItWorksImage: '/images/calculators/retry-backoff-calculator-how-it-works.svg',
  howItWorks: '1. Set your initial delay — the wait time in milliseconds before the very first retry (common values: 100 ms, 250 ms, 500 ms).\n2. Choose a backoff multiplier — how much each subsequent delay grows (2× is the standard; 1.5× is gentler).\n3. Set max retries — how many times your client should attempt the call before giving up (3–5 is typical for API calls).\n4. Set a max delay cap — the ceiling for any single retry delay to prevent waits from growing unbounded (5 s–60 s for most APIs).\n5. Read the per-attempt delay table above — each row shows the delay for that attempt and cumulative wait so far.\n6. Add ±25–50% jitter in your code to randomise delays and avoid thundering herd when many clients retry simultaneously.',
  formula: 'Delay(n) = min(MaxDelay, InitialDelay × Multiplier^(n-1))\n\nInitialDelay — wait before first retry, in milliseconds (e.g. 100 ms)\nMultiplier   — growth factor applied each attempt (e.g. 2 for classic doubling)\nn            — retry attempt number, starting at 1\nMaxDelay     — ceiling cap so delays never grow unbounded (e.g. 30,000 ms)\n\nWith jitter (recommended):\nDelay(n) = Delay(n) × uniform(0.5, 1.5)   // ±50% random spread',
  examplesTitle: 'Example Retry Backoff Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Standard 2× doubling (REST API client)',
      body: 'Initial: 200 ms · Multiplier: 2× · Cap: 30,000 ms\n\nAttempt 1:  200 ms\nAttempt 2:  400 ms\nAttempt 3:  800 ms\nAttempt 4:  1,600 ms\nAttempt 5:  3,200 ms\n              ──────────\nTotal wait: 6,200 ms (6.2 s across 5 retries)',
    },
    {
      title: 'Example 2 — Conservative 1.5× growth (rate-limited SaaS API)',
      body: 'Initial: 500 ms · Multiplier: 1.5× · Cap: 10,000 ms\n\nAttempt 1:    500 ms\nAttempt 2:    750 ms\nAttempt 3:  1,125 ms\nAttempt 4:  1,688 ms\nAttempt 5:  2,531 ms\n              ──────────\nTotal wait: 6,594 ms — gentler pressure on the upstream',
    },
    {
      title: 'Example 3 — Capped backoff hitting the ceiling (high-traffic service)',
      body: 'Initial: 1,000 ms · Multiplier: 3× · Cap: 15,000 ms\n\nAttempt 1:  1,000 ms\nAttempt 2:  3,000 ms\nAttempt 3:  9,000 ms\nAttempt 4: 15,000 ms  ← cap reached\nAttempt 5: 15,000 ms  ← cap held\n              ──────────\nTotal wait: 43,000 ms — cap prevents runaway delays after attempt 3',
    },
  ],
  tipsTitle: 'Tips for Building a Reliable Retry Strategy',
  tips: [
    'Always add jitter. A ±25–50% random spread prevents all clients retrying at exactly the same millisecond after a shared outage — the thundering herd problem. Use <code>delay × (0.5 + Math.random() * 1.0)</code> in JS.',
    'Retry on 429 and 503 only. Retrying 400 Bad Request or 422 Unprocessable Entity wastes retries and quota — these are client errors that will not resolve on their own. Only retry transient server-side and network failures.',
    'Honour <code>Retry-After</code> headers. APIs like Stripe, GitHub, and OpenAI return a <code>Retry-After</code> value on 429 responses. Use that value instead of your computed delay — it\'s the provider\'s authoritative signal.',
    'Set a total timeout budget. Track wall-clock time across all retries and abort once you exceed a deadline (e.g. 30 s). Use the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> to size your total budget before setting max retries.',
    'Use idempotency keys for mutating calls. POST requests that create resources can safely retry only when you attach a client-generated idempotency key — without one, each retry may create a duplicate record.',
    'Limit retry scope to network-level calls. Don\'t retry inside deep call stacks — retry at the outermost client boundary so the total retry count stays predictable and observable.',
  ],
  faq: [
    {
      question: 'What is exponential backoff and why should I use it?',
      answer: 'Exponential backoff is a retry strategy where each successive wait time grows by a fixed multiplier (typically 2×). It prevents overloading a service that is already under stress. Without it, all clients retry at the same rate, turning a brief outage into a sustained flood. Exponential backoff is the standard recommendation in AWS, GCP, and RFC 7807 documentation for transient failure handling.',
    },
    {
      question: 'What is a good initial delay for API retries?',
      answer: 'For REST APIs, 100–500 ms is a common starting point. For database connections, 50–200 ms. For cloud provider SDKs, follow the provider\'s SDK defaults (AWS SDK uses 100 ms; Stripe uses 500 ms). Start conservative — too short hammers the upstream; too long degrades user experience. Use the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> to check your retry timing fits within your SLA.',
    },
    {
      question: 'What backoff multiplier should I use?',
      answer: 'A multiplier of 2 (doubling) is the most common choice and works well for most APIs. Use 1.5 if the upstream is rate-limit-sensitive and you want gentler growth. Avoid multipliers above 3 — delays hit the cap too quickly, and you lose the benefit of intermediate attempts. Always pair any multiplier with a max delay cap to prevent unbounded growth.',
    },
    {
      question: 'How many retries should I configure?',
      answer: 'Three to five retries cover the vast majority of transient failures (brief network blips, 503 spikes, rate-limit windows). More than five retries rarely adds meaningful recovery benefit and significantly increases total wait time and held connections. For critical idempotent writes, five retries with jitter is a sensible upper bound. Check your provider\'s own retry guidance first.',
    },
    {
      question: 'What is thundering herd and how does jitter fix it?',
      answer: 'Thundering herd occurs when many clients all fail at the same moment and then retry simultaneously — creating a traffic spike that re-triggers the failure. Jitter adds a random offset (e.g. ±50%) to each computed delay, spreading retries across time. Even a 25% jitter dramatically smooths the retry curve. AWS and Google Cloud documentation both recommend full jitter for distributed systems.',
    },
  ],
  relatedSlugs: ['api-rate-limit-calculator', 'latency-budget-calculator', 'concurrency-calculator', 'qps-calculator'],
};

export const retryBackoffCalculator: CalculatorDefinition = { meta, Component: RetryBackoffUI };
