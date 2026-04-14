import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function ConcurrencyUI() {
  const [rps, setRps] = useState<string>('100');
  const [latencyMs, setLatencyMs] = useState<string>('200');
  const [safetyFactor, setSafetyFactor] = useState<string>('1.5');

  const r = parseFloat(rps) || 0;
  const l = parseFloat(latencyMs) || 0;
  const s = parseFloat(safetyFactor) || 1;

  const baseConcurrency = r * (l / 1000);
  const safeConcurrency = Math.ceil(baseConcurrency * s);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Required Concurrency</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Requests per Second (RPS)"
          type="number"
          value={rps}
          onChange={(e) => setRps(e.target.value)}
        />
        <TextField
          label="Average Response Time (ms)"
          type="number"
          value={latencyMs}
          onChange={(e) => setLatencyMs(e.target.value)}
        />
        <TextField
          label="Safety Factor"
          type="number"
          value={safetyFactor}
          onChange={(e) => setSafetyFactor(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1', min: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Required Concurrent Connections</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{safeConcurrency}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Base: {baseConcurrency.toFixed(1)} × {s}× safety factor = {safeConcurrency}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'concurrency-calculator',
  title: 'Concurrency Calculator',
  shortTitle: 'Concurrency',
  description: 'Calculate required API concurrency using Little\'s Law. Enter RPS and average response time to size connection pools, thread pools, and worker counts instantly.',
  keywords: [
    'concurrency calculator',
    'api concurrency calculator',
    "little's law calculator",
    'connection pool size calculator',
    'thread pool calculator',
    'concurrent requests calculator',
    'worker count calculator',
    'request concurrency estimator',
  ],
  category: 'api',
  icon: 'AccountTree',
  tagline: 'Enter your requests per second and average response time to instantly calculate how many concurrent connections or workers your service needs. Based on Little\'s Law.',
  lastUpdated: 'April 2026',
  intro:
    "The concurrency calculator uses Little's Law — one of the most important results in queuing theory — to determine how many simultaneous connections, threads, or workers a system needs to sustain a target throughput. If you're sizing a connection pool, configuring a thread pool, or setting max_workers on a worker fleet, this is the number you need.\n\nThe formula is simple: Concurrency = RPS × Average Latency (in seconds). At 100 requests per second with a 200 ms average response time, your service must hold 20 requests in flight at any moment. Underestimate this and requests queue up; your p99 latency spikes before your CPU does.\n\nEngineers use this calculator when provisioning database connection pools (pgBouncer, HikariCP), sizing HTTP client pools (httpx, axios), setting Gunicorn or Uvicorn worker counts, or configuring concurrency limits in async job queues like Celery or BullMQ.\n\nThe safety factor field adds headroom above the theoretical minimum — a 1.5× multiplier is common for production services to absorb traffic spikes and GC pauses without exhausting the pool.",
  howItWorksTitle: "How to Calculate API Concurrency with Little's Law",
  howItWorksImage: '/images/calculators/concurrency-calculator-how-it-works.svg',
  howItWorks:
    "1. Measure or estimate your peak requests per second (RPS). Use your APM, load balancer logs, or a target from a load test.\n2. Measure average response time in milliseconds. Use the p50 latency from your observability stack — not p99, which inflates the pool size unnecessarily.\n3. Plug both values into the calculator. The base concurrency is RPS × (latency ÷ 1000).\n4. Apply a safety factor (1.25–2.0×) to absorb burst traffic, GC pauses, and downstream slowdowns.\n5. Round up to the next integer — that's your minimum pool or worker count. Set your connection pool max to at least this value.",
  formula:
    'Concurrency = RPS × (Avg Latency ms ÷ 1000)\nSafe Concurrency = ⌈Concurrency × Safety Factor⌉\n\nRPS            — requests per second at peak load\nAvg Latency ms — average response time in milliseconds (use p50)\nSafety Factor  — headroom multiplier, typically 1.25–2.0\n⌈ ⌉            — ceiling (round up to nearest integer)',
  examplesTitle: 'Example Concurrency Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — REST API with database queries',
      body: 'RPS: 200   Avg latency: 150 ms   Safety: 1.5×\n\nBase concurrency = 200 × (150 ÷ 1000) = 200 × 0.15 = 30\nSafe concurrency = ⌈30 × 1.5⌉ = ⌈45⌉ = 45\n\nSet max_connections = 45 in your connection pool config.',
    },
    {
      title: 'Example 2 — High-throughput event ingestion service',
      body: 'RPS: 5,000   Avg latency: 20 ms   Safety: 2.0×\n\nBase concurrency = 5000 × (20 ÷ 1000) = 5000 × 0.02 = 100\nSafe concurrency = ⌈100 × 2.0⌉ = 200\n\nDeploy 200 async workers or set semaphore limit to 200.',
    },
    {
      title: 'Example 3 — Background job worker fleet (slow LLM calls)',
      body: 'RPS: 10   Avg latency: 8,000 ms (8 s LLM response)   Safety: 1.25×\n\nBase concurrency = 10 × (8000 ÷ 1000) = 10 × 8 = 80\nSafe concurrency = ⌈80 × 1.25⌉ = 100\n\nRun 100 worker processes to keep the queue drained.',
    },
  ],
  tipsTitle: 'Tips for Sizing Concurrency in Production',
  tips: [
    "Use p50 latency — not p99 — as your input. p99 includes tail outliers that skew the pool far too large. Size for the typical request, then add your safety factor for the rest.",
    "Revisit concurrency after every major latency change. A database index addition that cuts avg latency from 200 ms to 50 ms reduces required concurrency by 4×. Oversized pools waste memory and increase connection churn.",
    "For database connection pools, keep the pool smaller than your DB's max_connections limit. PostgreSQL defaults to 100; most apps should stay under 80% of that and use pgBouncer in transaction mode for high-concurrency services.",
    "HTTP client pools need separate sizing from DB pools. An external API call at 500 ms avg latency with 50 RPS requires 25 HTTP connections — configure your httpx.AsyncClient or axios pool accordingly.",
    "Monitor pool wait time, not just pool size. If requests are waiting for a free connection, your pool is undersized. If pool utilisation stays below 30%, it's oversized and wasting resources.",
    "For async frameworks (FastAPI, Node.js), concurrency is handled by the event loop — but external I/O (DB, HTTP) still needs bounded semaphores. Use asyncio.Semaphore or a connection pool to enforce the calculated limit.",
  ],
  faq: [
    {
      question: "What is Little's Law and how does it apply to API concurrency?",
      answer:
        "Little's Law states that the average number of items in a system equals the arrival rate multiplied by the average time each item spends in the system. For APIs: Concurrency = RPS × Avg Response Time (seconds). It applies to any stable system — connection pools, thread pools, message queues. If either RPS or latency rises, required concurrency rises proportionally.",
    },
    {
      question: 'How do I find my average response time for the calculation?',
      answer:
        "Use the p50 (median) latency from your observability tool — Datadog, Grafana, New Relic, or your load balancer access logs. Avoid using p99 or max latency, which inflate the result and lead to oversized, wasteful pools. If you don't have live data yet, run a load test with a tool like k6 or Locust and read the p50 from the output.",
    },
    {
      question: 'What safety factor should I use?',
      answer:
        "A 1.5× factor is a safe default for most production services. Use 1.25× for internal services with predictable traffic. Use 2.0× for consumer-facing endpoints, services with GC-heavy runtimes (JVM, Go), or anything calling a slow external dependency like an LLM API. Never use 1.0× — your theoretical minimum leaves zero headroom for any latency spike.",
    },
    {
      question: 'How many connections should I set in my database connection pool?',
      answer:
        "Calculate concurrency using this tool, then use that as your pool max. For PostgreSQL, the common formula is also: pool size = (core count × 2) + effective_spindle_count, but Little's Law gives you a demand-driven number. Set your application pool to the calculated safe concurrency, and ensure it stays under 80% of the DB's max_connections. Use the <a href=\"/calculators/qps-calculator\">QPS Calculator</a> to verify your queries-per-second headroom.",
    },
    {
      question: 'What happens if my concurrency is too low or too high?',
      answer:
        "Too low: requests queue waiting for a free connection, p99 latency spikes, and clients time out even though your service is healthy. Too high: you exhaust database connection limits, waste memory on idle threads, and increase context-switching overhead. Size it right with this calculator, then monitor pool wait time in production to confirm. See the <a href=\"/calculators/api-rate-limit-calculator\">API Rate Limit Calculator</a> to pair concurrency limits with rate limit planning.",
    },
  ],
  relatedSlugs: ['qps-calculator', 'api-rate-limit-calculator', 'throughput-calculator', 'latency-budget-calculator'],
};

export const concurrencyCalculator: CalculatorDefinition = { meta, Component: ConcurrencyUI };
