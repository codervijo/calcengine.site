import { useState } from 'react';
import { TextField, Typography, Stack, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

type TimeUnit = 'seconds' | 'minutes' | 'hours';

function ApiRateLimitUI() {
  const [rps, setRps] = useState<string>('100');
  const [duration, setDuration] = useState<string>('60');
  const [unit, setUnit] = useState<TimeUnit>('seconds');

  const r = parseFloat(rps) || 0;
  const d = parseFloat(duration) || 0;

  const multiplier: Record<TimeUnit, number> = { seconds: 1, minutes: 60, hours: 3600 };
  const totalSeconds = d * multiplier[unit];
  const totalRequests = r * totalSeconds;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Total Requests</Typography>
      <TextField label="Requests per Second" type="number" value={rps} onChange={(e) => setRps(e.target.value)} />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <TextField label="Duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <ToggleButtonGroup value={unit} exclusive onChange={(_, v) => v && setUnit(v)} size="small">
          <ToggleButton value="seconds">Sec</ToggleButton>
          <ToggleButton value="minutes">Min</ToggleButton>
          <ToggleButton value="hours">Hr</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Allowed Requests</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{totalRequests.toLocaleString()}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'api-rate-limit-calculator',
  title: 'API Rate Limit Calculator',
  shortTitle: 'Rate Limit',
  description: 'Calculate total API requests allowed in any time window from your rate limit. Enter RPS and duration to plan capacity and avoid 429 throttling errors.',
  keywords: ['api rate limit calculator', 'requests per second calculator', 'api throttle calculator', 'rate limiting formula', 'api quota calculator', 'avoid api 429 error', 'api capacity planning tool'],
  category: 'api',
  icon: 'Speed',
  tagline: 'Enter your rate limit and time window to see the total request budget instantly. Works in seconds, minutes, or hours — no manual unit conversion.',
  lastUpdated: 'April 2026',
  intro: 'Hitting a 429 Too Many Requests error in production is painful — especially when the root cause is a rate limit you could have planned around. API rate limits define how many requests you can make per second, minute, or hour, and exceeding them triggers retries, backoff delays, and degraded user experience.\n\nThis API rate limit calculator tells you exactly how many total requests your integration can make in any time window. Enter your rate in requests per second and a duration, and you\'ll see the total request budget instantly.\n\nUnit conversion is automatic — work in seconds, minutes, or hours without manual math.\n\nUse it to size a data sync job within your API quota, determine how long a batch of N requests will take at your current rate, validate whether a polling interval keeps you safely under the limit, or compare throughput across API tiers.',
  howItWorksTitle: 'How to Calculate API Rate Limits',
  howItWorksImage: '/images/calculators/api-rate-limit-how-it-works.svg',
  howItWorks: '1. Enter your rate limit in requests per second (RPS). If your API specifies requests per minute, divide by 60 to convert.\n2. Enter the duration of your time window.\n3. Select the unit: seconds, minutes, or hours.\n4. The calculator converts duration to seconds and multiplies by your RPS to give the total allowed requests.',
  formula: 'Total Requests = Requests per Second (RPS) × Duration in Seconds\n\nDuration conversions:\n- Minutes → multiply by 60\n- Hours   → multiply by 3,600\n\nUseful conversions:\n- 100 req/min = 100 ÷ 60 ≈ 1.67 RPS\n- 1,000 req/hr = 1,000 ÷ 3,600 ≈ 0.28 RPS',
  examplesTitle: 'Example Rate Limit Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Hourly sync job (50 RPS limit)',
      body: 'RPS: 50   Duration: 1 hour = 3,600 seconds\nTotal budget = 50 × 3,600 = 180,000 requests\n\nIf the job needs 200,000 records:\n200,000 ÷ 180,000 = 1.11 hours — won\'t finish in one window\nFix: extend to 2 hours (360,000 budget) or split across two API keys.',
    },
    {
      title: 'Example 2 — Real-time webhook consumer (10 RPS limit)',
      body: 'RPS: 10   Duration: 5 minutes = 300 seconds\nTotal budget = 10 × 300 = 3,000 requests per 5-minute window\n\nAt peak load of 50 events/sec, you\'ll exhaust the budget in 60 seconds.\nFix: queue events and process at ≤10 RPS, or request a higher tier.',
    },
    {
      title: 'Example 3 — Bulk data export (1,000 req/min limit)',
      body: 'API limit: 1,000 req/min = 1,000 ÷ 60 ≈ 16.67 RPS\nDuration: 30 minutes = 1,800 seconds\nTotal budget = 16.67 × 1,800 = 30,000 requests\n\nAt 1 record per request: 30,000 records exportable in 30 minutes.',
    },
  ],
  tipsTitle: 'Tips to Stay Within API Rate Limits',
  tips: [
    'Convert your rate limit to RPS first. Most APIs specify per-minute or per-hour limits — divide by 60 or 3,600 to get RPS for easy comparison.',
    'Use exponential backoff on 429 responses. Start with a 1-second delay, double on each retry, cap at 60 seconds. Most APIs include a Retry-After header.',
    'Queue and throttle at the application level. A token bucket or leaky bucket algorithm smooths request spikes before they hit the API.',
    'Cache aggressively. If two requests would return the same data, cache the first response and skip the second. Even a 30-second TTL can cut API calls dramatically at scale.',
    'Monitor your actual request rate in production. Log the timestamp of every API call and alert when your rolling average exceeds 80% of the limit.',
  ],
  faq: [
    {
      question: 'What is an API rate limit?',
      answer: 'A rate limit caps the number of requests a client can make in a given time window. It protects server resources and ensures fair usage across all clients. Exceeding it results in a 429 Too Many Requests response.',
    },
    {
      question: 'What is the difference between rate limit and quota?',
      answer: 'A rate limit is a short-window cap (e.g. 100 req/sec). A quota is a longer-period total (e.g. 10,000 req/day). You can hit either independently — a request that stays under the per-second rate limit can still exhaust the daily quota.',
    },
    {
      question: 'How do I avoid 429 Too Many Requests errors?',
      answer: 'Implement exponential backoff, queue requests to smooth bursts, cache responses where possible, and monitor your rolling request rate. Use the <a href="/calculators/api-rate-limit-calculator">API Rate Limit Calculator</a> to verify your batch sizes fit within the window before running them.',
    },
    {
      question: 'What does Retry-After mean in a 429 response?',
      answer: 'The Retry-After header tells you how many seconds to wait before retrying. Honour it exactly — retrying earlier will extend your ban window on most APIs. Some APIs use X-RateLimit-Reset with a Unix timestamp instead.',
    },
    {
      question: 'How do I calculate throughput across multiple API keys?',
      answer: 'If N keys each allow R RPS, total throughput = N × R. Distribute requests round-robin across keys so no single key exceeds its individual limit. Keep keys in separate processes to avoid shared-state race conditions.',
    },
  ],
  relatedSlugs: ['openai-cost-calculator', 'json-size-calculator', 'base64-size-calculator'],
};

export const apiRateLimitCalculator: CalculatorDefinition = { meta, Component: ApiRateLimitUI };
