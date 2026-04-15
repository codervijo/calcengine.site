import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function TimeoutUI() {
  const [p99Latency, setP99Latency] = useState<string>('200');
  const [safetyMultiplier, setSafetyMultiplier] = useState<string>('2.0');
  const [retries, setRetries] = useState<string>('2');

  const p99 = parseFloat(p99Latency) || 0;
  const multiplier = parseFloat(safetyMultiplier) || 1;
  const retryCount = parseInt(retries, 10) || 0;

  const recommendedTimeout = Math.ceil(p99 * multiplier);
  const totalDeadline = recommendedTimeout * (retryCount + 1);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Timeout Value</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="P99 Latency (ms)"
          type="number"
          value={p99Latency}
          onChange={(e) => setP99Latency(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '10' } }}
        />
        <TextField
          label="Safety Multiplier"
          type="number"
          value={safetyMultiplier}
          onChange={(e) => setSafetyMultiplier(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '0.5' } }}
        />
        <TextField
          label="Number of Retries"
          type="number"
          value={retries}
          onChange={(e) => setRetries(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Recommended Timeout</Typography>
            <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{recommendedTimeout} ms</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Deadline (with retries)</Typography>
            <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{totalDeadline} ms</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'timeout-calculator',
  title: 'Timeout Calculator',
  shortTitle: 'Timeout',
  description: 'Calculate the optimal timeout value for API calls and network requests. Enter P99 latency and a safety multiplier to get a recommended timeout instantly.',
  keywords: ['timeout calculator', 'api timeout calculator', 'request timeout calculator', 'network timeout value', 'p99 timeout setting', 'http timeout best practice', 'timeout retry calculator'],
  category: 'api',
  icon: 'Timer',
  tagline: 'Enter your P99 latency and safety multiplier to get a recommended timeout value and total deadline with retries. Works for any HTTP API, database, or microservice call.',
  lastUpdated: 'April 2026',
  intro: 'A timeout calculator helps you set a safe, evidence-based timeout for any API call or network request. Setting a timeout too short causes false failures on slow-but-healthy services; setting it too long makes your system hang and cascade failures into dependent services. The right value is derived from measured latency, not guesswork.\n\nThe standard approach is to take your P99 response time — the latency that 99% of requests fall under — and multiply by a safety factor (typically 2–3×). This gives headroom for occasional spikes without allowing runaway requests to stall threads. When retries are involved, the total deadline multiplies accordingly, so you can budget the worst-case wall-clock time before the caller gives up entirely.\n\nThis calculator is useful for backend engineers configuring HTTP clients, database connection pools, gRPC stubs, and message queue consumers. It is equally applicable to infrastructure-level settings like ALB idle timeout, Lambda function timeout, or Kubernetes readiness probe timeouts.\n\nIf you do not have P99 data yet, start with a conservative 3× your average latency as a placeholder and tighten it once you have production metrics from your APM tool.',
  howItWorksTitle: 'How to Calculate the Right Timeout Value',
  howItWorksImage: '/images/calculators/timeout-calculator-how-it-works.svg',
  howItWorks: '1. Measure your P99 latency — the response time that 99% of requests complete within. Pull this from your APM, logs, or load test results.\n2. Choose a safety multiplier. A value of 2× is a common starting point; increase to 3× for high-variance or bursty services.\n3. Recommended Timeout = P99 × Safety Multiplier. This is the per-attempt timeout you configure in your HTTP client or SDK.\n4. Factor in retries. If your client retries on timeout, multiply the per-attempt timeout by (retries + 1) to get the total deadline.\n5. Set your infrastructure timeout (e.g. load balancer, Lambda) to at least the total deadline so the caller is never killed before the final retry completes.',
  formula: 'Recommended Timeout = P99 Latency × Safety Multiplier\n\nTotal Deadline      = Recommended Timeout × (Retries + 1)\n\nP99 Latency        — latency at the 99th percentile (ms)\nSafety Multiplier  — headroom factor, typically 2.0–3.0\nRetries            — number of retry attempts after the initial try',
  examplesTitle: 'Example Timeout Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — REST API with 2 retries',
      body: 'P99 Latency:       200 ms\nSafety Multiplier: × 2.0\n                   ──────────────\nRecommended Timeout: 400 ms per attempt\nRetries:           2  →  (2 + 1) = 3 attempts\nTotal Deadline:    400 ms × 3 = 1,200 ms (1.2 s)',
    },
    {
      title: 'Example 2 — Database query, no retries',
      body: 'P99 Latency:       50 ms\nSafety Multiplier: × 3.0  (high variance OLAP query)\n                   ──────────────\nRecommended Timeout: 150 ms per attempt\nRetries:           0  →  1 attempt only\nTotal Deadline:    150 ms',
    },
    {
      title: 'Example 3 — Slow third-party enrichment API',
      body: 'P99 Latency:       1,200 ms\nSafety Multiplier: × 2.5\n                   ──────────────\nRecommended Timeout: 3,000 ms (3 s) per attempt\nRetries:           1  →  2 attempts\nTotal Deadline:    3,000 ms × 2 = 6,000 ms (6 s)',
    },
  ],
  tipsTitle: 'Tips for Setting Timeouts Correctly',
  tips: [
    'Always derive timeouts from measured P99 latency, not intuition. Pull the value from your APM tool (Datadog, Grafana, New Relic) before configuring any client.',
    'Use different timeouts for different operations. A fast status-check endpoint and a slow report-generation endpoint should never share the same timeout value.',
    'Set your infrastructure timeout (load balancer, Lambda, Kubernetes ingress) to slightly exceed the total deadline including retries, or the outer layer will abort before the final retry completes.',
    'Combine timeouts with circuit breakers. A timeout protects a single call; a circuit breaker stops hammering a degraded service when many calls are timing out. Use both.',
    'Reduce total deadline by shortening retries rather than timeout. Cutting retries from 3 to 1 halves worst-case wall time without changing per-call headroom.',
    'Re-measure P99 after every major traffic increase or dependency upgrade — latency distributions shift and your timeout baseline becomes stale.',
  ],
  faq: [
    {
      question: 'What is a good timeout value for an API call?',
      answer: 'A good starting point is 2–3× your P99 latency. If your API responds in 200 ms at the 99th percentile, set a timeout of 400–600 ms. Avoid round-number defaults like 5 s or 30 s unless you have data supporting them — arbitrary values tend to be either dangerously short or embarrassingly long in production.',
    },
    {
      question: 'Should I use P95 or P99 latency as the baseline?',
      answer: 'Use P99 for most services. P95 leaves 5% of requests timing out unnecessarily, which becomes significant at high QPS — at 1,000 req/s that is 50 false timeouts per second. P99 with a 2× multiplier gives robust coverage. For extremely latency-sensitive paths you might use P999, but measure the tradeoff against increased total deadline.',
    },
    {
      question: 'How do retries affect my timeout strategy?',
      answer: 'Each retry multiplies your worst-case wall time. With a 500 ms timeout and 3 retries, the caller can wait up to 2,000 ms before receiving an error. Always set the outer infrastructure timeout (load balancer, Lambda) to at least the total deadline. Use the <a href="/calculators/retry-backoff-calculator">Retry Backoff Calculator</a> to model cumulative wait time with exponential backoff.',
    },
    {
      question: 'What is the difference between a connection timeout and a read timeout?',
      answer: 'A connection timeout limits how long the client waits for the TCP handshake to complete — typically set to 1–5 s. A read timeout (also called socket timeout) limits how long the client waits for data after the connection is open. Use a short connection timeout to fail fast on network issues, and a latency-derived read timeout to handle slow responses.',
    },
    {
      question: 'How does timeout relate to overall API latency budget?',
      answer: 'Your timeout is a ceiling on one dependency\'s contribution to your total latency budget. If your API must respond in 500 ms end-to-end and you call three downstream services serially, each can consume at most ~150 ms. Use the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> to allocate time across dependencies and verify your timeout settings fit within the budget.',
    },
  ],
  relatedSlugs: ['retry-backoff-calculator', 'latency-budget-calculator', 'api-rate-limit-calculator'],
};

export const timeoutCalculator: CalculatorDefinition = { meta, Component: TimeoutUI };
