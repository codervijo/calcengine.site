import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function LeakyBucketRateUI() {
  const [incomingRate, setIncomingRate] = useState<string>('15');
  const [leakRate, setLeakRate] = useState<string>('10');
  const [bucketCapacity, setBucketCapacity] = useState<string>('100');

  const lambda = parseFloat(incomingRate) || 0;
  const R = parseFloat(leakRate) || 0;
  const C = parseFloat(bucketCapacity) || 0;

  const effectiveThroughput = Math.min(lambda, R);
  const dropRate = Math.max(0, lambda - R);
  const fillTime = lambda > R && R > 0 ? C / (lambda - R) : Infinity;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Leaky Bucket Rate</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Incoming Rate (req/s)"
          type="number"
          value={incomingRate}
          onChange={(e) => setIncomingRate(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
        <TextField
          label="Leak Rate (req/s)"
          type="number"
          value={leakRate}
          onChange={(e) => setLeakRate(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
        <TextField
          label="Bucket Capacity (requests)"
          type="number"
          value={bucketCapacity}
          onChange={(e) => setBucketCapacity(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-around">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Effective Throughput</Typography>
            <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{effectiveThroughput.toFixed(1)} req/s</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Drop Rate</Typography>
            <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{dropRate.toFixed(1)} req/s</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Bucket Fill Time</Typography>
            <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>
              {fillTime === Infinity ? '∞' : `${fillTime.toFixed(1)}s`}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'leaky-bucket-rate-calculator',
  title: 'Leaky Bucket Rate Calculator',
  shortTitle: 'Leaky Bucket',
  description: 'Calculate leaky bucket rate limiting: effective throughput, drop rate, and bucket fill time from incoming request rate, leak rate, and bucket capacity.',
  keywords: [
    'leaky bucket rate calculator',
    'leaky bucket algorithm calculator',
    'rate limiting calculator',
    'leaky bucket throughput',
    'api rate limit leaky bucket',
    'request drop rate calculator',
    'bucket fill time calculator',
    'leaky bucket vs token bucket',
  ],
  category: 'api',
  icon: 'Speed',
  tagline: 'Instantly calculate effective throughput, request drop rate, and bucket fill time for leaky bucket rate limiting. Designed for API engineers sizing their rate-limit configuration.',
  lastUpdated: 'April 2026',
  intro: 'The leaky bucket rate calculator helps you model the leaky bucket algorithm — one of the most widely used traffic-shaping mechanisms in API gateways, reverse proxies, and network infrastructure. Enter your incoming request rate, leak rate, and bucket capacity to see exactly how many requests will pass through, how many will be dropped, and how long the bucket will take to overflow.\n\nThe leaky bucket algorithm processes requests at a constant leak rate (R) regardless of how fast they arrive. Incoming requests fill a fixed-size bucket; once it overflows, excess requests are immediately dropped. This produces a smooth, predictable outbound stream even under bursty inbound traffic — making it popular in NGINX rate limiting, AWS API Gateway, and Cloudflare rate rules.\n\nEngineers use this calculator when sizing a new rate-limit policy, debugging dropped requests under load, or comparing leaky bucket against token bucket behaviour. If your incoming rate is below or equal to the leak rate the bucket never fills and nothing is dropped — the interesting regime is when λ > R, where the bucket accumulates and you need to know how long you have before it overflows.\n\nFor token bucket modelling (which allows controlled bursting unlike leaky bucket), see the Token Bucket Rate Limit Calculator linked below.',
  howItWorksTitle: 'How the Leaky Bucket Rate Calculator Works',
  howItWorksImage: '/images/calculators/leaky-bucket-rate-calculator-how-it-works.svg',
  howItWorks: '1. Enter your incoming request rate (λ) — how many requests arrive per second on average.\n2. Set your leak rate (R) — how many requests the bucket allows through per second.\n3. Enter the bucket capacity (C) — the maximum number of queued requests before dropping starts.\n4. The calculator computes effective throughput = min(λ, R), the actual rate requests exit the bucket.\n5. Drop rate = max(0, λ − R) shows how many requests per second are discarded when the bucket is full.\n6. Bucket fill time = C ÷ (λ − R) tells you how many seconds until the bucket overflows (only applies when λ > R).',
  formula: 'Effective Throughput = min(λ, R)\nDrop Rate            = max(0, λ − R)\nBucket Fill Time     = C ÷ (λ − R)   [only when λ > R]\n\nλ  — incoming request rate (requests per second)\nR  — leak rate: requests allowed through per second\nC  — bucket capacity: max queue depth before dropping\nBucket Fill Time is ∞ when λ ≤ R (bucket never fills)',
  examplesTitle: 'Example Leaky Bucket Rate Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Moderate overload (API gateway)',
      body: 'Incoming rate λ = 15 req/s\nLeak rate     R = 10 req/s\nBucket capacity C = 100 requests\n\nEffective throughput = min(15, 10) = 10 req/s\nDrop rate            = 15 − 10    =  5 req/s\nBucket fill time     = 100 ÷ (15 − 10) = 20 seconds\n\n→ 33 % of requests are dropped once the bucket overflows after 20 s',
    },
    {
      title: 'Example 2 — No overload (incoming ≤ leak rate)',
      body: 'Incoming rate λ =  8 req/s\nLeak rate     R = 10 req/s\nBucket capacity C = 200 requests\n\nEffective throughput = min(8, 10) =  8 req/s\nDrop rate            = max(0, 8 − 10) = 0 req/s\nBucket fill time     = ∞ (bucket never overflows)\n\n→ All 8 req/s pass through, bucket stays empty — no drops at all',
    },
    {
      title: 'Example 3 — Severe burst (DDoS / traffic spike)',
      body: 'Incoming rate λ = 500 req/s\nLeak rate     R =  50 req/s\nBucket capacity C =  200 requests\n\nEffective throughput = min(500, 50)  =  50 req/s\nDrop rate            = 500 − 50      = 450 req/s\nBucket fill time     = 200 ÷ (500 − 50) = 0.44 seconds\n\n→ 90 % of requests dropped; bucket overflows in under half a second',
    },
  ],
  tipsTitle: 'Tips for Tuning Leaky Bucket Rate Limits',
  tips: [
    'Set your leak rate (R) to your backend\'s safe sustained capacity — not its peak capacity. The bucket gives you a burst buffer, not a sustained overload buffer.',
    'Size the bucket capacity to absorb the longest expected burst without dropping. A short spike of 2× traffic for 5 seconds needs a bucket of at least 5 × (λ − R) requests.',
    'Monitor drop rate in production. A non-zero drop rate under normal load means your leak rate is set too low. Use the <a href="/calculators/api-rate-limit-calculator">API Rate Limit Calculator</a> to cross-check your QPS headroom.',
    'Prefer leaky bucket when you need smooth outbound traffic (e.g. calling a third-party API with strict per-second limits). Prefer token bucket when you want to allow short bursts — see the <a href="/calculators/token-bucket-rate-limit-calculator">Token Bucket Rate Limit Calculator</a>.',
    'Combine leaky bucket with retry backoff on the client side. When the bucket drops a request, the client should wait before retrying — check the <a href="/calculators/retry-backoff-calculator">Retry Backoff Calculator</a> to size the delay.',
    'In distributed systems, use a shared atomic counter (Redis INCR + TTL) to implement the leak rate across multiple nodes. Per-node leaky buckets can allow 2–5× your intended leak rate in a multi-instance deployment.',
  ],
  faq: [
    {
      question: 'What is the leaky bucket algorithm?',
      answer: 'The leaky bucket algorithm queues incoming requests in a fixed-size bucket and processes them at a constant leak rate. When the bucket fills, new arrivals are dropped. It produces a smooth, metered output stream regardless of bursty input — ideal for enforcing a strict per-second rate limit on downstream services or APIs.',
    },
    {
      question: 'What is the difference between leaky bucket and token bucket?',
      answer: 'Leaky bucket enforces a strict constant output rate — bursts are absorbed by the queue and excess is dropped. Token bucket allows bursting up to the bucket size as long as tokens are available, then falls back to the refill rate. Use leaky bucket for smoothing; use token bucket when short bursts are acceptable. See the <a href="/calculators/token-bucket-rate-limit-calculator">Token Bucket Rate Limit Calculator</a> to compare.',
    },
    {
      question: 'How do I choose the right bucket capacity?',
      answer: 'Bucket capacity should match your expected burst duration multiplied by the excess rate. If you expect 2× your leak rate for up to 10 seconds, set capacity to at least 10 × (λ − R). Too small a bucket drops legitimate traffic during normal spikes; too large a bucket delays the signal that your system is overloaded.',
    },
    {
      question: 'Does the leaky bucket algorithm prevent DDoS attacks?',
      answer: 'It limits the rate of requests reaching your backend, which reduces the blast radius of a DDoS attack. However, the bucket itself can be exhausted in milliseconds under a high-volume attack (as Example 3 shows). Combine leaky bucket rate limiting with upstream IP-based blocking, a WAF, and CDN-level protection for robust DDoS defence.',
    },
    {
      question: 'How is leaky bucket implemented in NGINX or AWS API Gateway?',
      answer: 'NGINX uses <code>limit_req_zone</code> and <code>limit_req</code> directives which implement a leaky bucket. Set <code>rate=10r/s</code> as the leak rate and <code>burst=100</code> as the bucket capacity. AWS API Gateway\'s usage plans also implement leaky bucket semantics with "rate" (leak rate) and "burst" (bucket size) parameters. Both map directly to this calculator\'s inputs.',
    },
  ],
  relatedSlugs: ['token-bucket-rate-limit-calculator', 'api-rate-limit-calculator', 'retry-backoff-calculator'],
};

export const leakyBucketRateCalculator: CalculatorDefinition = { meta, Component: LeakyBucketRateUI };
