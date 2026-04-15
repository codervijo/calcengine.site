import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function ApiResponseTimeEstimatorUI() {
  const [networkLatency, setNetworkLatency] = useState<string>('20');
  const [serverProcessing, setServerProcessing] = useState<string>('50');
  const [payloadKB, setPayloadKB] = useState<string>('10');
  const [bandwidthMbps, setBandwidthMbps] = useState<string>('100');
  const [middlewareLayers, setMiddlewareLayers] = useState<string>('3');
  const [middlewareOverhead, setMiddlewareOverhead] = useState<string>('5');

  const latency = parseFloat(networkLatency) || 0;
  const processing = parseFloat(serverProcessing) || 0;
  const payload = parseFloat(payloadKB) || 0;
  const bandwidth = parseFloat(bandwidthMbps) || 0;
  const layers = parseFloat(middlewareLayers) || 0;
  const overhead = parseFloat(middlewareOverhead) || 0;

  const transferTime = bandwidth > 0 ? (payload * 8) / bandwidth : 0;
  const middlewareTotal = layers * overhead;
  const total = latency + processing + transferTime + middlewareTotal;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Estimate API Response Time</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Network Round-Trip Latency (ms)"
          type="number"
          value={networkLatency}
          onChange={(e) => setNetworkLatency(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
        <TextField
          label="Server Processing Time (ms)"
          type="number"
          value={serverProcessing}
          onChange={(e) => setServerProcessing(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Response Payload Size (KB)"
          type="number"
          value={payloadKB}
          onChange={(e) => setPayloadKB(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '0.1' } }}
        />
        <TextField
          label="Available Bandwidth (Mbps)"
          type="number"
          value={bandwidthMbps}
          onChange={(e) => setBandwidthMbps(e.target.value)}
          slotProps={{ htmlInput: { min: '0.1', step: '1' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Middleware Layers"
          type="number"
          value={middlewareLayers}
          onChange={(e) => setMiddlewareLayers(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
        <TextField
          label="Overhead per Layer (ms)"
          type="number"
          value={middlewareOverhead}
          onChange={(e) => setMiddlewareOverhead(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '0.5' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Total Response Time</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{total.toFixed(2)} ms</Typography>
        <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 1.5, opacity: 0.85 }}>
          <Typography variant="caption">Network: {latency.toFixed(1)} ms</Typography>
          <Typography variant="caption">Processing: {processing.toFixed(1)} ms</Typography>
          <Typography variant="caption">Transfer: {transferTime.toFixed(2)} ms</Typography>
          <Typography variant="caption">Middleware: {middlewareTotal.toFixed(1)} ms</Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'api-response-time-estimator',
  title: 'API Response Time Estimator',
  shortTitle: 'Response Time',
  description: 'Estimate API response time by combining network latency, server processing, payload transfer, and middleware overhead — results in milliseconds, no sign-up needed',
  keywords: [
    'api response time estimator',
    'api latency calculator',
    'rest api response time calculator',
    'http response time estimator',
    'network latency calculator',
    'api performance estimator',
    'endpoint response time calculator',
    'api round trip time calculator',
  ],
  category: 'performance',
  icon: 'Speed',
  tagline: 'Estimate how long your API endpoint takes to respond by breaking response time into network latency, server processing, payload transfer, and middleware overhead. Built for backend engineers diagnosing slow endpoints and setting realistic SLO targets.',
  lastUpdated: 'April 2026',
  intro: 'The API response time estimator breaks down the total round-trip time into four measurable components: network latency, server processing time, payload transfer time, and middleware overhead. Understanding where time is spent is the first step to reducing it.\n\nNetwork latency is the unavoidable cost of distance — a request from Europe to a US-East server adds 80–120 ms before a single line of server code runs. Server processing covers your database queries, business logic, and serialisation. Transfer time depends on payload size and bandwidth: a 500 KB JSON response over a 10 Mbps connection contributes 400 ms of transfer time alone. Middleware layers — authentication, logging, rate limiting, tracing — each add a small but compounding overhead per request.\n\nUse this tool when profiling an endpoint and identifying the dominant cost driver, when setting p99 SLO targets for a new service, or when evaluating whether a CDN, edge deployment, or response compression will move the needle. Backend engineers, SREs, and API platform teams use this to reason about latency budgets before committing to infrastructure changes.',
  howItWorksTitle: 'How the API Response Time Estimator Works',
  howItWorksImage: '/images/calculators/api-response-time-estimator-how-it-works.svg',
  howItWorks: '1. Enter the network round-trip latency in milliseconds — measure with ping or traceroute from the client region to your server region.\n2. Enter your server processing time — the time your code takes to handle the request, including database queries. Profile with APM tools or add timing logs.\n3. Enter the response payload size in kilobytes — check your API responses with browser DevTools or curl --write-out.\n4. Enter the available bandwidth in Mbps — use the client\'s connection speed or your CDN throughput figures.\n5. Enter the number of middleware layers and the average overhead per layer — check your framework\'s middleware timing logs.\n6. The calculator sums all four components to give you the total estimated response time.',
  formula: 'Total Response Time (ms) =\n  Network Latency\n  + Server Processing Time\n  + Transfer Time\n  + Middleware Total\n\nTransfer Time (ms)  = (Payload Size in KB × 8) ÷ Bandwidth in Mbps\nMiddleware Total (ms) = Middleware Layers × Overhead per Layer\n\nNetwork Latency     — round-trip time from client to server (ms)\nServer Processing   — time for your code to handle and respond (ms)\nPayload Size        — size of the HTTP response body (KB)\nBandwidth           — effective throughput between client and server (Mbps)\nMiddleware Layers   — count of interceptors, guards, or middleware in the request pipeline\nOverhead per Layer  — average processing time added by each middleware (ms)',
  examplesTitle: 'Example API Response Time Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — REST JSON endpoint, same-region client',
      body: 'Network latency:      5 ms   (same AWS region)\nServer processing:   30 ms   (DB query + serialisation)\nPayload:             50 KB   over 1,000 Mbps LAN  →  0.40 ms transfer\nMiddleware:          3 layers × 2 ms               →  6 ms\n                                                   ──────────────\nTotal: 5 + 30 + 0.40 + 6 = 41.4 ms',
    },
    {
      title: 'Example 2 — Mobile app calling a cloud API over 4G',
      body: 'Network latency:     50 ms   (4G round-trip to EU-West)\nServer processing:   80 ms   (complex aggregation query)\nPayload:            200 KB   over 20 Mbps 4G         →  80 ms transfer\nMiddleware:          5 layers × 5 ms                 →  25 ms\n                                                     ──────────────\nTotal: 50 + 80 + 80 + 25 = 235 ms',
    },
    {
      title: 'Example 3 — Cross-continent API call with large response',
      body: 'Network latency:    120 ms   (US-East → Asia-Pacific)\nServer processing:   40 ms   (cache hit, fast path)\nPayload:            500 KB   over 10 Mbps international link  →  400 ms\nMiddleware:          4 layers × 8 ms                          →   32 ms\n                                                              ──────────────\nTotal: 120 + 40 + 400 + 32 = 592 ms   →  compress payload to cut 300+ ms',
    },
  ],
  tipsTitle: 'Tips to Reduce API Response Time',
  tips: [
    'Compress response payloads with gzip or Brotli — a 500 KB JSON response compresses to ~60 KB, cutting transfer time by up to 88% with negligible CPU cost.',
    'Deploy your API in the region closest to your users. Cross-continental network latency of 120–200 ms cannot be optimised in code — proximity is the only fix.',
    'Cache expensive query results at the application layer. A cache hit that skips a 100 ms database round-trip is the fastest code path of all.',
    'Audit your middleware pipeline. Each layer adds overhead on every request — remove logging, tracing, or validation middleware that is not required for the specific route.',
    'Use HTTP/2 or HTTP/3 for clients that make multiple concurrent API calls — multiplexing eliminates per-request connection overhead and reduces total latency.',
    'Profile under realistic load. Response time often degrades non-linearly under concurrency — a 30 ms p50 can become a 500 ms p99 when the database connection pool is saturated.',
  ],
  faq: [
    {
      question: 'What is a good API response time target?',
      answer: 'Industry convention is under 200 ms for interactive API calls and under 100 ms for user-facing UI data requests. Google\'s research found that delays above 200 ms cause users to perceive lag. For background or batch operations, 1–5 seconds is acceptable. Set your SLO based on p95 or p99 latency, not mean, since tail latency affects real user experience most.',
    },
    {
      question: 'What is the difference between latency and response time?',
      answer: 'Latency is the time for a signal to travel one way between two points — often used for the network segment alone. Response time is the full round-trip duration from when the client sends a request to when it receives the complete response. Response time includes latency (both directions), server processing, and payload transfer. This calculator estimates total response time.',
    },
    {
      question: 'How do I measure my API\'s actual response time?',
      answer: 'Use <code>curl --write-out "%{time_total}"</code> for quick terminal measurements. For structured profiling, use tools like k6, Apache JMeter, or Datadog APM. Browser DevTools network panel shows per-request breakdown including DNS, TCP, TLS, waiting (TTFB), and download phases. Always measure from the client region your users actually connect from.',
    },
    {
      question: 'Why does payload size affect response time so much?',
      answer: 'Large payloads take time to transmit across the network regardless of how fast your server processes the request. A 1 MB uncompressed JSON response over a 10 Mbps connection adds 800 ms of pure transfer time — more than most server processing budgets. Enabling gzip compression and paginating large result sets are the two highest-impact fixes for payload-driven latency.',
    },
    {
      question: 'How many middleware layers is too many?',
      answer: 'There is no universal limit, but each layer adds overhead on every request. If each middleware costs 5 ms and you have 10 layers, that is 50 ms added before your route handler runs — a significant portion of most latency budgets. Audit with your framework\'s profiling tools and consolidate layers that perform similar functions, such as merging logging and tracing into a single interceptor.',
    },
  ],
  relatedSlugs: ['latency-budget-calculator', 'api-rate-limit-calculator', 'timeout-calculator', 'qps-calculator'],
};

export const apiResponseTimeEstimatorCalculator: CalculatorDefinition = { meta, Component: ApiResponseTimeEstimatorUI };
