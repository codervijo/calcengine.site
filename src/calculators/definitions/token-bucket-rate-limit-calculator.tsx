import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function TokenBucketRateLimitUI() {
  const [bucketCapacity, setBucketCapacity] = useState<string>('100');
  const [refillRate, setRefillRate] = useState<string>('10');
  const [requestCost, setRequestCost] = useState<string>('20');
  const [currentTokens, setCurrentTokens] = useState<string>('80');

  const capacity = parseFloat(bucketCapacity) || 0;
  const rate = parseFloat(refillRate) || 0;
  const cost = parseFloat(requestCost) || 0;
  const current = parseFloat(currentTokens) || 0;

  const allowed = cost > 0 && current >= cost;
  const waitTime = cost > 0 && rate > 0 && !allowed ? (cost - current) / rate : 0;
  const maxRPS = cost > 0 && rate > 0 ? rate / cost : 0;
  const burstCapacity = cost > 0 ? Math.floor(capacity / cost) : 0;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Token Bucket Rate Limit</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Bucket Capacity (tokens)"
          type="number"
          value={bucketCapacity}
          onChange={(e) => setBucketCapacity(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
        <TextField
          label="Refill Rate (tokens/sec)"
          type="number"
          value={refillRate}
          onChange={(e) => setRefillRate(e.target.value)}
          slotProps={{ htmlInput: { min: '0.001', step: '1' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Request Cost (tokens/request)"
          type="number"
          value={requestCost}
          onChange={(e) => setRequestCost(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
        <TextField
          label="Current Token Count"
          type="number"
          value={currentTokens}
          onChange={(e) => setCurrentTokens(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Request Status
        </Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>
          {allowed ? 'Allowed' : waitTime > 0 ? `Blocked — wait ${waitTime.toFixed(2)}s` : 'Blocked'}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={4} sx={{ mt: 1.5 }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>Max RPS (steady state)</Typography>
            <Typography variant="h5" component="p" sx={{ fontWeight: 600 }}>{maxRPS.toFixed(2)} req/s</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>Burst Capacity</Typography>
            <Typography variant="h5" component="p" sx={{ fontWeight: 600 }}>{burstCapacity} requests</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'token-bucket-rate-limit-calculator',
  title: 'Token Bucket Rate Limit Calculator',
  shortTitle: 'Token Bucket',
  description: 'Calculate token bucket rate limits instantly. Enter bucket capacity, refill rate, and request cost to find max RPS, burst capacity, and wait time for blocked requests.',
  keywords: [
    'token bucket rate limit calculator',
    'token bucket algorithm calculator',
    'rate limiter calculator',
    'api rate limit token bucket',
    'burst capacity calculator',
    'refill rate calculator',
    'rate limiting algorithm',
    'requests per second calculator',
  ],
  category: 'api',
  icon: 'Speed',
  tagline: 'Enter your bucket capacity, refill rate, and request cost to instantly see whether a request is allowed, how long to wait if blocked, and your steady-state maximum throughput.',
  lastUpdated: 'April 2026',
  intro: 'The token bucket rate limit calculator helps developers model and tune token bucket rate limiters — the algorithm used by AWS API Gateway, Stripe, GitHub, and most major API platforms. Enter your bucket parameters and current token level to determine whether an incoming request will be allowed or blocked, and exactly how many seconds to wait before retrying.\n\nToken bucket is a leaky-bucket variant that explicitly separates burst capacity from sustained throughput. The bucket holds up to N tokens, refills continuously at R tokens per second, and each API call costs C tokens. This lets clients absorb short traffic spikes (burst) without exceeding the long-run rate (R ÷ C requests per second).\n\nUse this calculator when sizing rate limits for a new API, troubleshooting 429 errors in production, or modeling how a client library should implement retry-after logic. The burst capacity field tells you the maximum number of consecutive requests allowed from a full bucket before throttling kicks in.\n\nThe formula works for any token bucket implementation: AWS API Gateway throttling, Kong rate-limit plugin, nginx limit_req, or a hand-rolled Redis-based limiter. Adjust cost-per-request to model weighted endpoints where complex queries consume more tokens than simple reads.',
  howItWorksTitle: 'How to Calculate Token Bucket Rate Limits',
  howItWorksImage: '/images/calculators/token-bucket-rate-limit-calculator-how-it-works.svg',
  howItWorks: '1. Set your bucket capacity — the maximum number of tokens the bucket can hold. This caps your burst size.\n2. Set the refill rate — tokens added per second. This determines your sustained throughput ceiling.\n3. Set the request cost — tokens consumed per API call. Uniform APIs use 1; weighted endpoints may use 5, 10, or more.\n4. Enter the current token count — how many tokens are in the bucket at the moment of the request.\n5. The calculator checks if current tokens ≥ request cost. If yes, the request is allowed. If no, it computes the wait time: (cost − current) ÷ refill rate.\n6. Steady-state max RPS = refill rate ÷ request cost. Burst capacity = floor(bucket capacity ÷ request cost).',
  formula: 'Allowed          = Current Tokens ≥ Request Cost\nWait Time (s)    = (Request Cost − Current Tokens) ÷ Refill Rate   [when blocked]\nMax RPS          = Refill Rate ÷ Request Cost\nBurst Capacity   = floor(Bucket Capacity ÷ Request Cost)\n\nBucket Capacity  — maximum tokens the bucket can hold\nRefill Rate      — tokens added per second (continuous)\nRequest Cost     — tokens consumed by each API call\nCurrent Tokens   — tokens available at request time',
  examplesTitle: 'Example Token Bucket Rate Limit Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Standard REST API (10 req/s sustained, 50 burst)',
      body: 'Bucket Capacity:  100 tokens\nRefill Rate:       10 tokens/s\nRequest Cost:      10 tokens/request\n\nMax RPS       = 10 ÷ 10 = 1 req/s  ← Wait, let\'s correct:\nActually:      10 tokens/s ÷ 10 tokens/req = 1 req/s sustained\nBurst Cap     = floor(100 ÷ 10) = 10 requests\n\nIf current tokens = 100 (full bucket):\n  First 10 requests → all allowed instantly\n  11th request at t=0 → blocked, wait = (10 − 0) ÷ 10 = 1.00s',
    },
    {
      title: 'Example 2 — GitHub-style API (60 req/min = 1 req/s, burst 10)',
      body: 'Bucket Capacity:   10 tokens\nRefill Rate:        1 token/s   (60 tokens/min)\nRequest Cost:       1 token/request\n\nMax RPS       = 1 ÷ 1 = 1 req/s\nBurst Cap     = floor(10 ÷ 1) = 10 requests\n\nIf current tokens = 3:\n  Request allowed (3 ≥ 1)\n  Tokens after: 2\n\nIf current tokens = 0:\n  Blocked — wait = (1 − 0) ÷ 1 = 1.00s',
    },
    {
      title: 'Example 3 — Weighted endpoint (search = 5 tokens, read = 1 token)',
      body: 'Bucket Capacity:   50 tokens\nRefill Rate:       10 tokens/s\nRequest Cost:       5 tokens  (search endpoint)\n\nMax RPS (search)  = 10 ÷ 5 = 2 req/s\nBurst Cap (search) = floor(50 ÷ 5) = 10 requests\n\nMax RPS (read)    = 10 ÷ 1 = 10 req/s\nBurst Cap (read)  = floor(50 ÷ 1) = 50 requests\n\nIf current tokens = 3, search request (cost 5):\n  Blocked — wait = (5 − 3) ÷ 10 = 0.20s',
    },
  ],
  tipsTitle: 'Tips for Tuning Token Bucket Rate Limits',
  tips: [
    'Size burst capacity at 5–10× your average per-second rate to absorb legitimate traffic spikes without false throttling. A burst of 10 with a 1 req/s sustain is common for GitHub-style personal APIs.',
    'Use weighted request costs for expensive endpoints. Assign a search or aggregation endpoint 5–10 tokens while a simple GET costs 1 token. This prevents one heavy call from consuming the entire burst budget.',
    'Implement the Retry-After header in your API responses. Return the wait time in seconds (the exact value this calculator outputs) so clients can back off precisely instead of using random exponential backoff.',
    'Monitor the P99 token level in your bucket. If the bucket is almost always full, your capacity is oversized — reduce it to get tighter burst control. If it frequently hits zero, increase the refill rate.',
    'For distributed systems, use a shared token counter in Redis with Lua scripts to enforce the bucket atomically across multiple API nodes. Local in-memory buckets per instance will over-allow traffic.',
    'Combine with the <a href="/calculators/retry-backoff-calculator">Retry Backoff Calculator</a> to model the full request lifecycle: when a 429 arrives, use this wait time as the base delay before applying exponential backoff.',
  ],
  faq: [
    {
      question: 'What is the difference between token bucket and leaky bucket rate limiting?',
      answer: 'Token bucket allows bursting: a full bucket lets you send multiple requests instantly until tokens run out. Leaky bucket (also called leaky bucket as a meter) smooths traffic to a constant output rate — requests are queued and released at a fixed pace regardless of bucket fill level. Token bucket is more common for API rate limits because it rewards clients that stay under their quota with burst headroom.',
    },
    {
      question: 'How do I find my API\'s bucket capacity and refill rate?',
      answer: 'Check the X-RateLimit-Limit and X-RateLimit-Remaining headers in API responses. Many APIs also document their rate limit algorithm in their docs. AWS API Gateway publishes default burst limits (5,000 for standard tier) and steady-state RPS separately. For undocumented APIs, probe with requests and observe the 429 Retry-After header value — it encodes the wait time this calculator predicts.',
    },
    {
      question: 'How do I handle 429 Too Many Requests responses in client code?',
      answer: 'Read the Retry-After header — it tells you exactly how many seconds to wait (the wait time this calculator computes). If absent, use exponential backoff starting at 1 second and capping at 60 seconds. Never retry immediately on a 429 — doing so depletes any remaining tokens and delays recovery. Use the <a href="/calculators/retry-backoff-calculator">Retry Backoff Calculator</a> to model your backoff strategy alongside the token refill curve.',
    },
    {
      question: 'What request cost should I assign to different endpoint types?',
      answer: 'A common scheme: simple reads = 1 token, writes = 2 tokens, list/search = 5 tokens, batch/export = 10–50 tokens. The goal is to reflect actual compute cost. Stripe uses 1 token per read and 2 per write. AWS API Gateway uses 1 token per request but lets you configure burst and steady-state limits separately. Calibrate based on P95 latency ratios between endpoint types.',
    },
    {
      question: 'Can I use this calculator for Redis-based rate limiters?',
      answer: 'Yes. A Redis token bucket stores the current token count and last refill timestamp in a key. On each request, it computes elapsed time × refill rate to add tokens (capped at capacity), then checks if cost can be deducted. The math is identical to this calculator. Use the output wait time as the TTL for a retry key or as the delay argument in a job queue. See also the <a href="/calculators/api-rate-limit-calculator">API Rate Limit Calculator</a> for request-window-based limiters.',
    },
  ],
  relatedSlugs: ['api-rate-limit-calculator', 'retry-backoff-calculator', 'qps-calculator', 'timeout-calculator'],
};

export const tokenBucketRateLimitCalculator: CalculatorDefinition = { meta, Component: TokenBucketRateLimitUI };
