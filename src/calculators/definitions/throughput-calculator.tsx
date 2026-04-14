import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function ThroughputUI() {
  const [totalRequests, setTotalRequests] = useState<string>('10000');
  const [timeWindow, setTimeWindow] = useState<string>('60');
  const [payloadSize, setPayloadSize] = useState<string>('4');

  const req = parseFloat(totalRequests) || 0;
  const secs = parseFloat(timeWindow) || 0;
  const kb = parseFloat(payloadSize) || 0;

  const rps = secs > 0 ? req / secs : 0;
  const mbps = (rps * kb) / 1024;
  const dailyRequests = rps * 86400;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Throughput</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Requests"
          type="number"
          value={totalRequests}
          onChange={(e) => setTotalRequests(e.target.value)}
          fullWidth
        />
        <TextField
          label="Time Window (seconds)"
          type="number"
          value={timeWindow}
          onChange={(e) => setTimeWindow(e.target.value)}
          fullWidth
          slotProps={{ htmlInput: { min: '1' } }}
        />
        <TextField
          label="Avg Response Size (KB)"
          type="number"
          value={payloadSize}
          onChange={(e) => setPayloadSize(e.target.value)}
          fullWidth
          slotProps={{ htmlInput: { step: '0.1', min: '0' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center', flex: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>Throughput</Typography>
          <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{rps.toFixed(2)} RPS</Typography>
        </Box>
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center', flex: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>Data Throughput</Typography>
          <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{mbps.toFixed(3)} MB/s</Typography>
        </Box>
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center', flex: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>Daily Volume</Typography>
          <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{dailyRequests.toLocaleString('en-US', { maximumFractionDigits: 0 })}</Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'throughput-calculator',
  title: 'Throughput Calculator',
  shortTitle: 'Throughput',
  description: 'Calculate throughput in requests per second and MB/s from total requests and time window. Instant API and system capacity planning — no sign-up required.',
  keywords: [
    'throughput calculator',
    'requests per second calculator',
    'api throughput calculator',
    'rps calculator',
    'data throughput calculator',
    'system capacity calculator',
    'network throughput calculator',
    'api performance calculator',
  ],
  category: 'api',
  icon: 'Speed',
  tagline: 'Enter your total requests, time window, and average response size to instantly calculate throughput in RPS and MB/s. Built for API engineers and backend developers planning system capacity.',
  lastUpdated: 'April 2026',
  intro: 'A throughput calculator helps you convert raw request counts into the requests-per-second (RPS) and data throughput figures that matter for API design, load testing, and capacity planning. Whether you are sizing infrastructure for a new service or diagnosing a performance bottleneck, knowing your actual throughput is the starting point.\n\nBackend engineers use throughput metrics to validate that a system meets its SLA targets, set auto-scaling thresholds, and predict bandwidth costs. A service handling 10,000 requests per minute has very different infrastructure needs than one handling 10,000 per second — and the data throughput figure tells you whether your network tier will saturate before your compute does.\n\nThis calculator combines request rate with average payload size to give you both dimensions simultaneously. Pair it with the QPS Calculator when you need to convert queries-per-second for database layers, or use the API Rate Limit Calculator to check whether your throughput stays within upstream provider quotas.',
  howItWorksTitle: 'How to Calculate API Throughput',
  howItWorksImage: '/images/calculators/throughput-calculator-how-it-works.svg',
  howItWorks: '1. Count the total number of requests processed during a known time window — from logs, a load test, or a monitoring dashboard.\n2. Convert the time window to seconds (e.g. 5 minutes = 300 seconds).\n3. Divide total requests by seconds to get Throughput in RPS.\n4. Multiply RPS by the average response payload size in KB, then divide by 1,024 to get data throughput in MB/s.\n5. Multiply RPS by 86,400 to estimate the daily request volume at that sustained rate.',
  formula: 'Throughput (RPS)    = Total Requests ÷ Time Window (seconds)\nData Throughput     = (RPS × Avg Response Size KB) ÷ 1,024   [MB/s]\nDaily Volume        = RPS × 86,400\n\nTotal Requests      — number of requests observed or expected in the window\nTime Window         — duration of the observation period in seconds\nAvg Response Size   — mean payload size returned per request, in kilobytes',
  examplesTitle: 'Example Throughput Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — REST API load test',
      body: 'Total Requests:  10,000   over   60 seconds\nAvg Response:    4 KB\n\nThroughput = 10,000 ÷ 60 = 166.67 RPS\nData throughput = (166.67 × 4) ÷ 1,024 = 0.651 MB/s\nDaily volume at this rate = 166.67 × 86,400 ≈ 14,400,480 requests/day',
    },
    {
      title: 'Example 2 — High-traffic JSON API',
      body: 'Total Requests:  500,000   over   300 seconds (5 min)\nAvg Response:    12 KB\n\nThroughput = 500,000 ÷ 300 = 1,666.67 RPS\nData throughput = (1,666.67 × 12) ÷ 1,024 = 19.53 MB/s\nDaily volume at this rate = 1,666.67 × 86,400 ≈ 144,000,288 requests/day',
    },
    {
      title: 'Example 3 — Lightweight health-check endpoint',
      body: 'Total Requests:  3,600   over   3,600 seconds (1 hour)\nAvg Response:    0.5 KB\n\nThroughput = 3,600 ÷ 3,600 = 1.00 RPS\nData throughput = (1.00 × 0.5) ÷ 1,024 = 0.000488 MB/s\nDaily volume at this rate = 1.00 × 86,400 = 86,400 requests/day',
    },
  ],
  tipsTitle: 'Tips for Optimising API Throughput',
  tips: [
    'Measure throughput over representative time windows — a 10-second spike after a cache warm-up will overstate steady-state RPS. Use a 5-minute window for meaningful baselines.',
    'Reduce average response size with field filtering (GraphQL selections, REST sparse fieldsets). Halving payload size halves your bandwidth cost and often doubles effective throughput at the same RPS.',
    'Use the <a href="/calculators/qps-calculator">QPS Calculator</a> alongside this tool to model database query load driven by your API tier — high RPS with a high queries-per-request ratio saturates DB connections long before app servers.',
    'Check your <a href="/calculators/api-rate-limit-calculator">API rate limits</a> before assuming you can sustain peak RPS — provider quotas cap throughput independently of your infrastructure capacity.',
    'Enable HTTP/2 or HTTP/3 on your API gateway. Multiplexing reduces connection overhead and typically improves sustainable RPS by 20–40% under real-world mixed-request workloads.',
    'Monitor p95 and p99 latency alongside throughput. A system can sustain 1,000 RPS with a 99th-percentile latency of 5 seconds — that is a queue building, not healthy throughput.',
  ],
  faq: [
    {
      question: 'What is the difference between throughput and latency?',
      answer: 'Throughput is the rate of successful work completed — requests per second or MB/s. Latency is the time a single request takes end-to-end. They are related but independent: a system can have high throughput (many parallel requests) with high latency (each one slow), or low throughput with low latency. Use the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> to model per-request timing alongside throughput.',
    },
    {
      question: 'How do I calculate RPS from requests per minute?',
      answer: 'Divide requests per minute by 60. If your monitoring shows 6,000 RPM, that is 6,000 ÷ 60 = 100 RPS. For requests per hour, divide by 3,600. For requests per day, divide by 86,400. Enter the converted seconds value directly in the Time Window field above.',
    },
    {
      question: 'What is a good throughput for a REST API?',
      answer: 'It depends entirely on your use case. Internal microservices often target 500–5,000 RPS per instance. Public-facing APIs vary from single-digit RPS for free tiers to millions for CDN-backed endpoints. A more useful benchmark is whether your observed throughput meets your SLA at acceptable latency under your expected peak load.',
    },
    {
      question: 'How does payload size affect throughput?',
      answer: 'Larger payloads increase serialisation time, network transfer time, and memory pressure — all of which reduce the maximum sustainable RPS. A 100 KB JSON response takes roughly 25× more bandwidth than a 4 KB one. At 500 RPS, that difference is 48.8 MB/s vs 1.95 MB/s — potentially the difference between staying within and exceeding your network egress limits.',
    },
    {
      question: 'How do I convert throughput to bandwidth cost?',
      answer: 'Take your data throughput in MB/s, multiply by 3,600 to get MB/hour, then by 24 for MB/day, then by 30 for monthly GB. Divide by 1,024 to convert MB to GB if your cloud provider bills in GB. Most providers charge $0.08–$0.12 per GB of outbound data transfer — multiply monthly GB by that rate for a rough bandwidth cost estimate.',
    },
  ],
  relatedSlugs: ['qps-calculator', 'api-rate-limit-calculator', 'latency-budget-calculator'],
};

export const throughputCalculator: CalculatorDefinition = { meta, Component: ThroughputUI };
