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
  title: 'API Rate Limit Calculator',
  shortTitle: 'Rate Limit',
  description: 'Calculate how many total API requests are allowed over a given time period based on a rate limit.',
  keywords: ['rate limit', 'api throttle', 'requests per second', 'api calculator', 'rate limiting'],
  category: 'api',
  icon: 'Speed',
  intro: 'Enter your rate limit (requests per second) and a time window to see exactly how many total requests you can make. Useful for capacity planning and API integration.',
  howItWorks: 'Multiply your per-second rate by the total number of seconds in your chosen time period. The calculator converts minutes or hours into seconds automatically.',
  formula: 'Total Requests = Requests per Second × Duration in Seconds',
  example: 'At 100 requests/second over 5 minutes:\n100 × (5 × 60) = 100 × 300 = 30,000 total requests.',
  faq: [
    { question: 'What is a rate limit?', answer: 'A rate limit restricts how many API requests a client can make in a given time window. It protects servers from overload.' },
    { question: 'Do rate limits always use per-second rates?', answer: 'Not always. Some APIs define limits per minute or per hour. Convert them to per-second if needed, or adjust the time unit here.' },
    { question: 'What about burst limits?', answer: 'Burst limits allow short spikes above the sustained rate. This calculator assumes a steady rate without bursting.' },
    { question: 'How do I handle multiple API keys?', answer: 'If you have N API keys each with the same rate limit, multiply the total by N for aggregate throughput.' },
  ],
  relatedSlugs: ['openai-cost-calculator', 'base64-size-calculator'],
};

export const apiRateLimitCalculator: CalculatorDefinition = { meta, Component: ApiRateLimitUI };
