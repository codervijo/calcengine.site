import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function CacheHitRateUI() {
  const [totalRequests, setTotalRequests] = useState<string>('10000');
  const [cacheHits, setCacheHits] = useState<string>('9000');

  const total = parseFloat(totalRequests) || 0;
  const hits = parseFloat(cacheHits) || 0;

  const hitRate = total > 0 ? (hits / total) * 100 : 0;
  const missRate = 100 - hitRate;
  const misses = total - hits;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Cache Hit Rate</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Requests"
          type="number"
          value={totalRequests}
          onChange={(e) => setTotalRequests(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
          fullWidth
        />
        <TextField
          label="Cache Hits"
          type="number"
          value={cacheHits}
          onChange={(e) => setCacheHits(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
          fullWidth
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Cache Hit Rate</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{hitRate.toFixed(2)}%</Typography>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">Cache Miss Rate</Typography>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>{missRate.toFixed(2)}%</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">Requests to Origin</Typography>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>{misses.toLocaleString()}</Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'cache-hit-rate-calculator',
  title: 'Cache Hit Rate Calculator',
  shortTitle: 'Cache Hit Rate',
  description: 'Calculate cache hit rate instantly — enter total requests and cache hits to get hit %, miss %, and origin load. Works for CDN, Redis, Memcached, and browser caches.',
  keywords: [
    'cache hit rate calculator',
    'cache miss rate calculator',
    'cdn hit rate calculator',
    'redis cache hit ratio',
    'memcached hit rate',
    'cache efficiency calculator',
    'cache hit ratio formula',
    'http cache hit rate',
  ],
  category: 'performance',
  icon: 'Speed',
  tagline: 'Enter your total requests and cache hits to instantly see your hit rate, miss rate, and how many requests are reaching your origin server.',
  lastUpdated: 'April 2026',
  intro: 'The cache hit rate calculator tells you what percentage of requests are served from cache versus forwarded to your origin. A cache hit rate of 90% means only 1 in 10 requests hits your database or upstream service — that ratio directly determines your infrastructure cost and response latency.\n\nEngineers use this metric to validate CDN configuration (Cloudflare, Fastly, CloudFront), tune Redis or Memcached TTLs, and identify under-caching patterns in API or database layers. A sudden drop in hit rate is often the first signal of a misconfigured cache key, a new query pattern bypassing the cache, or an expiry window set too short.\n\nThe formula is straightforward: divide cache hits by total requests and multiply by 100. What matters is how you instrument and act on it. A hit rate below 80% in a CDN usually points to low cache-control TTLs or too many unique URLs. A hit rate below 50% in an application cache often means cache keys are too granular or invalidation is too aggressive.\n\nThis calculator works for any cache layer — CDN edge caches, in-process memory caches, distributed key-value stores, HTTP reverse proxies, and browser caches. Paste in your access log counts or APM dashboard numbers to get an instant read.',
  howItWorksTitle: 'How to Calculate Cache Hit Rate',
  howItWorksImage: '/images/calculators/cache-hit-rate-calculator-how-it-works.svg',
  howItWorks: '1. Count your total requests over a fixed time window — pull this from your CDN dashboard, APM tool, or access logs.\n2. Count the requests served from cache (cache hits) over the same window.\n3. Divide cache hits by total requests to get the hit ratio.\n4. Multiply by 100 to express it as a percentage.\n5. Subtract the hit rate from 100 to get the miss rate — this is the fraction of requests forwarded to your origin.',
  formula: 'Cache Hit Rate (%) = (Cache Hits ÷ Total Requests) × 100\n\nCache Miss Rate (%) = 100 − Cache Hit Rate\n\nRequests to Origin = Total Requests − Cache Hits\n\nCache Hits     — requests served directly from cache without touching the origin\nTotal Requests — all incoming requests including hits and misses\nRequests to Origin — misses that are forwarded to the upstream server or database',
  examplesTitle: 'Example Cache Hit Rate Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — CDN serving a marketing site',
      body: 'Total Requests:  100,000 / hour\nCache Hits:       94,000 / hour\n\nHit Rate  = (94,000 ÷ 100,000) × 100 = 94.00%\nMiss Rate = 100 − 94.00             =  6.00%\nOrigin load: 6,000 req/hr  →  only 1.67 req/sec reach the origin server',
    },
    {
      title: 'Example 2 — Redis cache for an API endpoint',
      body: 'Total Requests:  50,000 / hour\nCache Hits:       32,000 / hour\n\nHit Rate  = (32,000 ÷ 50,000) × 100 = 64.00%\nMiss Rate = 100 − 64.00             = 36.00%\nOrigin load: 18,000 req/hr  →  indicates TTL is too short or cache keys are too specific',
    },
    {
      title: 'Example 3 — Database query cache after tuning',
      body: 'Total Queries:   200,000 / hour\nCache Hits:      188,000 / hour\n\nHit Rate  = (188,000 ÷ 200,000) × 100 = 94.00%\nMiss Rate = 100 − 94.00               =  6.00%\nDB queries avoided: 188,000/hr  →  ~94% reduction in database read load',
    },
  ],
  tipsTitle: 'Tips to Improve Your Cache Hit Rate',
  tips: [
    'Set long cache TTLs for static assets and use content-addressed filenames (e.g. <code>main.abc123.js</code>) so you can cache indefinitely without serving stale files.',
    'Normalise your cache keys. Strip tracking parameters (<code>utm_source</code>, <code>fbclid</code>) from URLs before caching — each variant creates a separate cache entry and tanks your hit rate.',
    'Warm your cache on deploy. Pre-populate high-traffic keys immediately after a cache flush or deployment to avoid a cold-start miss storm reaching your origin.',
    'Use <code>stale-while-revalidate</code> in HTTP cache headers to serve stale content while a background refresh happens — this keeps hit rates high during cache expiry windows.',
    'Monitor hit rate by route, not just globally. A single high-traffic endpoint with a 20% hit rate can drag your overall average down while everything else is healthy.',
    'For Redis and Memcached, use the <code>INFO stats</code> command to pull <code>keyspace_hits</code> and <code>keyspace_misses</code> — these give you per-instance hit rates without needing an APM tool.',
  ],
  faq: [
    {
      question: 'What is a good cache hit rate?',
      answer: 'For a CDN serving static assets, 95%+ is the target. For dynamic API caches (Redis, Memcached), 80–90% is healthy. Anything below 60% usually means cache keys are too granular, TTLs are too short, or invalidation logic is firing too aggressively. The right target depends on your workload and how expensive a cache miss is — measure latency and origin cost alongside the raw hit rate.',
    },
    {
      question: 'How do I measure cache hits and misses in production?',
      answer: 'For CDNs, check the dashboard — Cloudflare, Fastly, and CloudFront all surface hit/miss counts directly. For Redis, run <code>INFO stats</code> and read <code>keyspace_hits</code> and <code>keyspace_misses</code>. For Nginx, log the <code>$upstream_cache_status</code> variable. For browser caches, Chrome DevTools Network tab shows "from cache" vs "from network" for each request.',
    },
    {
      question: 'What causes a sudden drop in cache hit rate?',
      answer: 'Common causes: a deploy that flushed the cache without warming it back up; a new query parameter being added to URLs that creates unique cache keys for what was previously one entry; a TTL reduction; or a surge in first-time users hitting uncached personalised content. Segment your hit rate by route and time of day to isolate the pattern quickly.',
    },
    {
      question: 'Does cache hit rate affect SEO or Core Web Vitals?',
      answer: 'Indirectly, yes. A high CDN hit rate means lower Time to First Byte (TTFB), which directly improves Largest Contentful Paint (LCP) — a Core Web Vitals metric Google uses for ranking. Pages served from cache edge nodes respond in single-digit milliseconds vs. hundreds of milliseconds from origin. Use the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> to model the impact on your overall request latency.',
    },
    {
      question: 'What is the difference between cache hit rate and cache hit ratio?',
      answer: 'They are the same metric expressed differently. Cache hit rate is the percentage form (e.g. 90%), and cache hit ratio is the decimal form (e.g. 0.90). Most monitoring tools use "hit rate" or "hit ratio" interchangeably. When comparing across systems, confirm whether a vendor reports the value as a percentage or a decimal to avoid misreading a 0.90 ratio as 0.90%.',
    },
  ],
  relatedSlugs: ['latency-budget-calculator', 'api-rate-limit-calculator', 'json-size-calculator'],
};

export const cacheHitRateCalculator: CalculatorDefinition = { meta, Component: CacheHitRateUI };
