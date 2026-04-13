import { useState } from 'react';
import { TextField, Typography, Stack, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CalculatorDefinition, CalculatorMeta } from '../registry/types';

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
  title: 'API Rate Limit Calculator — Total Requests Over Time (Free 2026)',
  shortTitle: 'Rate Limit',
  description: 'Calculate total API requests allowed in any time window from your rate limit. Enter RPS and duration to plan capacity and avoid 429 throttling errors.',
  keywords: ['api rate limit calculator', 'requests per second calculator', 'api throttle calculator', 'rate limiting formula', 'api quota calculator', 'avoid api 429 error', 'api capacity planning tool'],
  category: 'api',
  icon: 'Speed',
  intro: 'Hitting a 429 Too Many Requests error in production is painful — especially when the root cause is a rate limit you could have planned around. API rate limits define how many requests you can make per second, minute, or hour, and exceeding them triggers retries, backoff delays, and degraded user experience.\n\nThis API rate limit calculator tells you exactly how many total requests your integration can make in any time window. Enter your rate in requests per second and a duration, and you\'ll see the total request budget instantly.\n\nUnit conversion is automatic — work in seconds, minutes, or hours without manual math.\n\nUse it to size a data sync job within your API quota, determine how long a batch of N requests will take at your current rate, validate whether a polling interval keeps you safely under the limit, or compare throughput across API tiers.',
  howItWorks: '1. Enter your rate limit in requests per second (RPS). If your API specifies requests per minute, divide by 60 to convert.\n2. Enter the duration of your time window.\n3. Select the unit: seconds, minutes, or hours.\n4. The calculator converts duration to seconds and multiplies by your RPS to give the total allowed requests.',
  formula: 'Total Requests = Requests per Second (RPS) × Duration in Seconds\n\nDuration conversions:\n- Minutes → multiply by 60\n- Hours   → multiply by 3,600\n\nUseful conversions:\n- 100 req/min = 100 ÷ 60 ≈ 1.67 RPS\n- 1,000 req/hr = 1,000 ÷ 3,600 ≈ 0.28 RPS',
  example: 'Scenario: hourly sync job against an API capped at 50 requests/second\n\nDuration: 1 hour = 3,600 seconds\nTotal allowed = 50 × 3,600 = 180,000 requests\n\nIf the sync needs to process 200,000 records:\n200,000 ÷ 180,000 = 1.11 hours — won\'t finish in one window\n\nFix: extend to a 2-hour window (360,000 budget) or split across two API keys (100 RPS aggregate).',
  faq: [
    { question: 'What is an API rate limit?', answer: 'A rate limit caps the number of requests a client can make in a given time window. It protects server resources and ensures fair usage across all clients on a shared platform.' },
    { question: 'What is the difference between rate limit and quota?', answer: 'A rate limit is a short-window cap (e.g. 100 req/sec). A quota is a longer-period total (e.g. 10,000 req/day). You can hit either independently — stay within both.' },
    { question: 'How do I avoid hitting a 429 rate limit error?', answer: 'Use exponential backoff on 429 responses, queue requests to smooth out bursts, cache responses where possible, and monitor your request rate in real time.' },
    { question: 'What does 429 Too Many Requests mean?', answer: 'The server is rejecting your request because you exceeded the rate limit. Most APIs return a Retry-After header indicating when you can safely retry.' },
    { question: 'How do I calculate throughput across multiple API keys?', answer: 'If N clients each operate at R RPS, total throughput = N × R. Distribute requests across keys so no single key exceeds its individual limit.' },
  ],
  relatedSlugs: ['openai-cost-calculator', 'base64-size-calculator'],
};

export const apiRateLimitCalculator: CalculatorDefinition = { meta, Component: ApiRateLimitUI };
