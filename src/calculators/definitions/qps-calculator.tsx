import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function QPSCalculatorUI() {
  const [totalRequests, setTotalRequests] = useState<string>('1000000');
  const [timeWindowSeconds, setTimeWindowSeconds] = useState<string>('86400');
  const [peakMultiplier, setPeakMultiplier] = useState<string>('3');

  const req = parseFloat(totalRequests) || 0;
  const tw = parseFloat(timeWindowSeconds) || 1;
  const pm = parseFloat(peakMultiplier) || 1;

  const avgQPS = req / tw;
  const peakQPS = avgQPS * pm;

  const formatQPS = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(2)}k` : v.toFixed(2);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate QPS</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Requests"
          type="number"
          value={totalRequests}
          onChange={(e) => setTotalRequests(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
        <TextField
          label="Time Window (seconds)"
          type="number"
          value={timeWindowSeconds}
          onChange={(e) => setTimeWindowSeconds(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
          helperText="86400 = 1 day · 3600 = 1 hour · 60 = 1 min"
        />
        <TextField
          label="Peak Multiplier"
          type="number"
          value={peakMultiplier}
          onChange={(e) => setPeakMultiplier(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '0.1' } }}
          helperText="Typical: 2–5× average"
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center">
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Average QPS</Typography>
            <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatQPS(avgQPS)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Peak QPS</Typography>
            <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatQPS(peakQPS)}</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'qps-calculator',
  title: 'QPS Calculator',
  shortTitle: 'QPS',
  description: 'Calculate QPS (queries per second) from request volume and time window. Estimate average and peak throughput for API capacity planning — no sign-up required',
  keywords: ['qps calculator', 'queries per second calculator', 'api throughput calculator', 'rps calculator', 'requests per second', 'peak qps estimator', 'api capacity planning'],
  category: 'api',
  icon: 'Speed',
  tagline: 'Enter your total request count and time window to calculate average and peak QPS instantly. Built for backend engineers sizing APIs, rate limits, and infrastructure.',
  lastUpdated: 'April 2026',
  intro: 'A QPS calculator converts raw request counts into the queries-per-second rate your system must sustain, which is the metric that actually drives infrastructure sizing decisions. Knowing your average QPS tells you how much steady-state capacity you need; knowing your peak QPS tells you how much headroom to build in before you start dropping requests.\n\nBackend engineers use QPS to set rate limits, size connection pools, choose instance counts, and negotiate SLAs. SREs use it to decide when to trigger autoscaling and what runbook thresholds to set. If you\'re planning a new service, forecasting traffic growth, or post-morteming an incident, the first question is always "what was the QPS at the time?"\n\nThe peak multiplier accounts for the fact that traffic is never flat. A service handling 1M requests/day on average might see 3–5× that rate during a flash sale, a viral moment, or a scheduled batch job. Industry convention is to provision for 2–3× average QPS for consumer APIs and 4–5× for event-driven or batch-adjacent workloads.\n\nThis calculator works for any unit — HTTP requests, database queries, message-queue events, gRPC calls. The formula is the same: divide total events by the observation window in seconds.',
  howItWorksTitle: 'How to Calculate QPS (Queries Per Second)',
  howItWorksImage: '/images/calculators/qps-calculator-how-it-works.svg',
  howItWorks: '1. Count the total number of requests (or queries, events, or messages) in a given period.\n2. Convert your observation window to seconds — 1 hour = 3,600 s, 1 day = 86,400 s.\n3. Divide total requests by seconds to get Average QPS.\n4. Multiply Average QPS by your Peak Multiplier (typically 2–5×) to get Peak QPS.\n5. Use Peak QPS to size your servers, connection pools, and rate-limit thresholds.',
  formula: 'Average QPS = Total Requests ÷ Time Window (seconds)\nPeak QPS    = Average QPS × Peak Multiplier\n\nTotal Requests  — number of requests (HTTP, DB queries, events, etc.) in the window\nTime Window     — observation period in seconds (86400 = 1 day, 3600 = 1 hour)\nPeak Multiplier — ratio of peak traffic to average (commonly 2–5×)',
  examplesTitle: 'Example QPS Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — REST API with 1M daily requests',
      body: 'Total Requests: 1,000,000\nTime Window:    86,400 seconds (1 day)\nAverage QPS:    1,000,000 ÷ 86,400  =  11.57 QPS\nPeak Multiplier: 3×\nPeak QPS:       11.57 × 3  =  34.72 QPS\n→ Provision for ~35 QPS; each 2-vCPU instance handling 50 QPS gives you 1 instance + headroom.',
    },
    {
      title: 'Example 2 — High-traffic e-commerce checkout during sale (10M requests/hour)',
      body: 'Total Requests: 10,000,000\nTime Window:    3,600 seconds (1 hour)\nAverage QPS:    10,000,000 ÷ 3,600  =  2,778 QPS\nPeak Multiplier: 5× (flash-sale spike)\nPeak QPS:       2,778 × 5  =  13,889 QPS\n→ Need infrastructure able to sustain ~14k QPS; consider horizontal autoscaling triggered at 70% capacity.',
    },
    {
      title: 'Example 3 — Database read replica sizing (500k queries over 10 minutes)',
      body: 'Total Requests: 500,000\nTime Window:    600 seconds (10 minutes)\nAverage QPS:    500,000 ÷ 600  =  833 QPS\nPeak Multiplier: 2×\nPeak QPS:       833 × 2  =  1,667 QPS\n→ A single read replica rated at 2,000 QPS covers peak with 17% spare capacity — add a second replica for HA.',
    },
  ],
  tipsTitle: 'Tips for QPS Capacity Planning',
  tips: [
    'Always size for peak, not average. Average QPS tells you baseline cost; peak QPS tells you the failure threshold. Set autoscaling triggers at 60–70% of your peak-rated capacity.',
    'Use a 3× peak multiplier as a starting point for consumer-facing APIs. Increase to 5× if you run time-limited promotions, batch jobs that overlap with live traffic, or have upstream services that retry aggressively.',
    'Convert to the right granularity before comparing. A dashboard showing "10k RPM" means 167 RPS — always normalise to per-second before feeding numbers into rate limiters or quotas, which operate in per-second windows.',
    'Log actual peak QPS in your APM tool (Datadog, Grafana, CloudWatch) and compare it against your provisioned ceiling each quarter. Capacity that felt generous at launch often looks tight after 6 months of growth.',
    'If your service is behind an API gateway, use the <a href="/calculators/api-rate-limit-calculator">API Rate Limit Calculator</a> to align gateway throttle limits with your infrastructure\'s sustainable QPS so upstream limits fire before downstream systems saturate.',
    'For latency-sensitive APIs, check that your p99 latency stays within budget at peak QPS using the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> — high QPS and tight latency targets together define your real concurrency requirement.',
  ],
  faq: [
    {
      question: 'What is QPS and why does it matter?',
      answer: 'QPS stands for Queries Per Second — the rate at which a system processes requests, queries, or events. It\'s the standard unit for measuring API throughput, database load, and service capacity. Engineers use QPS to size infrastructure, set rate limits, plan autoscaling thresholds, and write SLOs. Exceeding your system\'s sustainable QPS causes latency spikes, connection exhaustion, and dropped requests.',
    },
    {
      question: 'What is a good peak multiplier to use?',
      answer: 'For most consumer-facing REST APIs, 3× average QPS is a reasonable starting point. Use 5× or higher for event-driven workloads, marketing-heavy products with flash sales, or services that receive retry storms. Internal microservices with predictable callers can often use 2×. The right number comes from your traffic percentile data — compare your p99 one-minute rate against the daily average.',
    },
    {
      question: 'What is the difference between QPS, RPS, and TPS?',
      answer: 'QPS (queries per second), RPS (requests per second), and TPS (transactions per second) all measure throughput rate and use the same formula. The terms differ by context: QPS is common for databases and search systems, RPS for HTTP APIs, and TPS for transactional databases or payment systems. In practice they are interchangeable in calculations — use the one that matches your monitoring tool\'s terminology.',
    },
    {
      question: 'How do I find my actual QPS from logs or metrics?',
      answer: 'In most APM tools, look for the "request rate" or "throughput" metric, which is already expressed as per-second. From raw logs, count requests in a fixed window and divide by window seconds. In SQL: <code>COUNT(*) / TIMESTAMPDIFF(SECOND, MIN(ts), MAX(ts))</code>. In PromQL: <code>rate(http_requests_total[5m])</code> gives you a 5-minute rolling average QPS. Always sample a representative weekday, not just off-peak windows.',
    },
    {
      question: 'How many servers do I need to handle a given QPS?',
      answer: 'Divide your Peak QPS by the per-instance sustainable throughput — benchmark this under realistic load, not synthetic no-op tests. Add 20–30% headroom for GC pauses, health checks, and gradual rollouts. For example, if peak is 3,000 QPS and each instance handles 400 QPS, you need 3,000 ÷ 400 = 7.5 → 8 instances, then add 2 for headroom = 10 instances minimum. Use the <a href="/calculators/cache-hit-rate-calculator">Cache Hit Rate Calculator</a> to reduce the QPS that actually reaches your backend.',
    },
  ],
  relatedSlugs: ['api-rate-limit-calculator', 'latency-budget-calculator', 'cache-hit-rate-calculator'],
};

export const qpsCalculator: CalculatorDefinition = { meta, Component: QPSCalculatorUI };
