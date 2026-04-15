import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function CacheTTLImpactUI() {
  const [rps, setRps] = useState<string>('1000');
  const [uniqueObjects, setUniqueObjects] = useState<string>('5000');
  const [ttl, setTtl] = useState<string>('300');
  const [originResponseTime, setOriginResponseTime] = useState<string>('200');
  const [responseSize, setResponseSize] = useState<string>('50');
  const [bandwidthCost, setBandwidthCost] = useState<string>('0.085');

  const R = parseFloat(rps) || 0;
  const N = parseFloat(uniqueObjects) || 0;
  const T = parseFloat(ttl) || 0;
  const latency = parseFloat(originResponseTime) || 0;
  const sizeKB = parseFloat(responseSize) || 0;
  const bwCost = parseFloat(bandwidthCost) || 0;

  const missesPerSec = T > 0 && R > 0 ? Math.min(N / T, R) : 0;
  const hitRate = R > 0 ? Math.max(0, (R - missesPerSec) / R) : 0;
  const hitsPerSec = R * hitRate;

  const secondsPerMonth = 2_592_000; // 30 days
  const bwSavedGB = (hitsPerSec * secondsPerMonth * sizeKB) / 1_048_576;
  const monthlySavings = bwSavedGB * bwCost;
  const avgLatencySaved = hitRate * latency;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Cache TTL Impact</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Request Rate (req/s)" type="number" value={rps} onChange={(e) => setRps(e.target.value)} />
        <TextField label="Unique Objects (cache keys)" type="number" value={uniqueObjects} onChange={(e) => setUniqueObjects(e.target.value)} />
        <TextField label="TTL (seconds)" type="number" value={ttl} onChange={(e) => setTtl(e.target.value)} />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Origin Response Time (ms)" type="number" value={originResponseTime} onChange={(e) => setOriginResponseTime(e.target.value)} />
        <TextField label="Response Size (KB)" type="number" value={responseSize} onChange={(e) => setResponseSize(e.target.value)} />
        <TextField label="Bandwidth Cost ($/GB)" type="number" value={bandwidthCost} onChange={(e) => setBandwidthCost(e.target.value)} slotProps={{ htmlInput: { step: '0.001' } }} />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Cache Hit Rate</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{(hitRate * 100).toFixed(1)}%</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Origin Requests / sec</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{missesPerSec.toFixed(1)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Avg Latency Saved</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{avgLatencySaved.toFixed(0)} ms</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Monthly BW Savings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>${monthlySavings.toFixed(2)}</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'cache-ttl-impact-calculator',
  title: 'Cache TTL Impact Calculator',
  shortTitle: 'Cache TTL',
  description: 'Use the cache TTL impact calculator to estimate hit rate, origin load reduction, and monthly bandwidth savings for your CDN or application cache configuration',
  keywords: ['cache ttl impact calculator', 'cache ttl calculator', 'cache hit rate estimator', 'ttl optimization calculator', 'cdn cache ttl calculator', 'origin load reduction calculator', 'cache efficiency calculator', 'cache bandwidth savings'],
  category: 'performance',
  icon: 'Speed',
  tagline: 'Estimate cache hit rate, origin request reduction, and monthly bandwidth savings based on TTL, request rate, and unique object count. Adjust the inputs to tune your CDN or application cache for optimal performance.',
  lastUpdated: 'April 2026',
  intro: 'The cache TTL impact calculator helps engineers quantify what a given Time-to-Live value actually does to your infrastructure. TTL is the single most influential cache knob — too short and you flood your origin with unnecessary requests; too long and users see stale data. This calculator makes the tradeoff visible with real numbers.\n\nThe core model is straightforward: every unique cache key needs to be refreshed once per TTL window. Divide your unique object count by the TTL in seconds and you get the minimum number of origin requests per second — your irreducible miss floor. Every request above that floor is served from cache without touching origin.\n\nThis calculator is useful for capacity planning, cost estimation, and TTL tuning. API engineers use it to set sensible Cache-Control headers. Platform engineers use it to size origin capacity when a CDN sits in front of a service. SREs use it to model the blast radius of a cache flush — resetting TTLs to zero temporarily is effectively a denial-of-service on your own origin, and knowing the hit rate tells you exactly how much origin headroom you need.\n\nBandwidth savings are calculated by multiplying cache hits per second by the response size and by the number of seconds per month (2,592,000), then pricing it at your per-GB egress rate. AWS CloudFront charges approximately $0.085/GB for the first 10 TB. Cloudflare CDN does not charge for bandwidth served from cache, so savings on Cloudflare show up as origin offload rather than direct cost reduction.',
  howItWorksTitle: 'How to Calculate Cache TTL Impact',
  howItWorksImage: '/images/calculators/cache-ttl-impact-calculator-how-it-works.svg',
  howItWorks: '1. Enter your total request rate — the number of HTTP requests per second hitting the cache layer (from your CDN dashboard or APM tool).\n2. Enter the number of unique cache keys in your working set — distinct URLs or object identifiers that the cache must store.\n3. Enter the TTL in seconds. Convert minutes (5 min = 300 s) or hours (1 hr = 3600 s) before entering.\n4. The calculator divides unique objects by TTL to find misses per second — this is the minimum origin load regardless of total traffic volume.\n5. Cache hit rate = (request rate − misses per second) ÷ request rate, expressed as a percentage.\n6. Bandwidth savings and average latency saved are derived from the hit rate, your response size, and origin response time.',
  formula: 'Miss Rate   = min(1,  Unique_Objects / (Request_Rate × TTL))\nHit Rate    = 1 − Miss Rate\n\nMisses/sec  = Request_Rate × Miss Rate\nHits/sec    = Request_Rate × Hit Rate\n\nAvg Latency Saved    = Hit_Rate × Origin_Response_Time\nMonthly BW Saved(GB) = Hits/sec × 2,592,000 × Response_Size(KB) / 1,048,576\nMonthly BW Cost($)   = Monthly_BW_Saved_GB × Bandwidth_Cost_per_GB\n\nRequest_Rate         — total requests per second hitting the cache layer\nUnique_Objects       — number of distinct cache keys in your working set\nTTL                  — cache Time-to-Live in seconds\nOrigin_Response_Time — round-trip time to origin in milliseconds\nResponse_Size        — average cached response size in kilobytes\nBandwidth_Cost       — egress cost per GB (e.g. $0.085 for AWS CloudFront)',
  examplesTitle: 'Example Cache TTL Impact Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Small REST API with 5-minute TTL',
      body: 'Request Rate: 100 req/s  |  Unique Objects: 1,000  |  TTL: 300 s\nOrigin RT: 150 ms  |  Response Size: 10 KB  |  BW Cost: $0.085/GB\n\nMisses/sec  = 1,000 / 300                     =   3.3 /s\nHit Rate    = (100 − 3.3) / 100               =  96.7%\nHits/sec    = 96.7 /s\n\nAvg Latency Saved  = 0.967 × 150              = 145 ms\nMonthly BW Saved   = 96.7 × 2,592,000 × 10 / 1,048,576  =  2,389 GB\nMonthly Savings    = 2,389 × $0.085           = $203/month',
    },
    {
      title: 'Example 2 — E-commerce CDN with 1-hour TTL',
      body: 'Request Rate: 5,000 req/s  |  Unique Objects: 50,000  |  TTL: 3,600 s\nOrigin RT: 300 ms  |  Response Size: 100 KB  |  BW Cost: $0.085/GB\n\nMisses/sec  = 50,000 / 3,600                  =  13.9 /s\nHit Rate    = (5,000 − 13.9) / 5,000          =  99.7%\nHits/sec    = 4,986 /s\n\nAvg Latency Saved  = 0.997 × 300              = 299 ms\nMonthly BW Saved   = 4,986 × 2,592,000 × 100 / 1,048,576  = 1,232,015 GB\nMonthly Savings    = 1,232,015 × $0.085       = $104,721/month',
    },
    {
      title: 'Example 3 — TTL tradeoff: 30 s vs 300 s',
      body: 'Request Rate: 1,000 req/s  |  Unique Objects: 10,000  |  Response Size: 20 KB\n\nWith TTL = 30 s (very short):\n  Misses/sec  = 10,000 / 30   =  333.3 /s\n  Hit Rate    = (1,000 − 333.3) / 1,000  =  66.7%\n  Origin load = 333.3 req/s\n\nWith TTL = 300 s (10× longer):\n  Misses/sec  = 10,000 / 300  =   33.3 /s\n  Hit Rate    = (1,000 − 33.3) / 1,000   =  96.7%\n  Origin load =  33.3 req/s\n\n→ 10× increase in TTL → 10× reduction in origin hit count → 30% increase in hit rate',
    },
  ],
  tipsTitle: 'Tips to Optimize Cache TTL',
  tips: [
    'Set TTL proportional to content change frequency — static assets like JS bundles can safely use year-long TTLs with cache-busting via filename hashing, while mutable API responses should stay under 60 seconds.',
    'Use <code>stale-while-revalidate</code> in Cache-Control headers. This serves the cached version instantly while refreshing in the background, eliminating the latency penalty on cache misses without reducing TTL.',
    'Segment TTLs by content type. A product catalog changes hourly; a user profile changes in minutes; a static banner changes daily. Match TTL to volatility rather than using one global default across all routes.',
    'Monitor your cache hit ratio in production — most CDNs expose it as a dashboard metric. A ratio below 80% usually signals that TTL is too short, your unique object count exceeds cache capacity, or the cache key includes unbounded dynamic query parameters.',
    'Warm the cache on deployment by pre-populating popular keys immediately after a release. A cold cache after a deploy causes a traffic spike on origin proportional to your miss rate — knowing that rate in advance lets you provision extra capacity.',
    'Combine a short TTL with ETags or Last-Modified headers. Clients revalidate on expiry with a conditional GET — if content is unchanged, origin returns 304 Not Modified with no body, saving most bandwidth even on technically stale entries.',
  ],
  faq: [
    {
      question: 'What is a good cache TTL for a REST API?',
      answer: 'It depends on data freshness requirements. For public, read-heavy endpoints like product listings or search results, 60–300 seconds is a safe starting point. For user-specific or transactional data, keep TTL under 30 seconds or bypass the cache entirely. Measure your hit ratio in production and adjust upward — a ratio below 80% is a strong signal to increase TTL or narrow the set of cached objects.',
    },
    {
      question: 'What happens when TTL is set too short?',
      answer: 'A very short TTL increases origin load proportionally. With 10,000 unique objects and a 5-second TTL, you generate 2,000 origin requests per second just to refresh stale entries — regardless of actual user traffic. This creates a background hammering effect that can overwhelm origin during traffic spikes. Use this calculator to find the minimum TTL that keeps origin load within your provisioned capacity.',
    },
    {
      question: 'How does cache hit rate affect request latency?',
      answer: 'Each cache hit avoids a full round trip to origin. If origin takes 200 ms and your hit rate is 95%, average latency attributable to origin drops to 200 × 0.05 = 10 ms per request. At 99% hit rate it falls to 2 ms. The savings compound quickly — moving from 90% to 95% hit rate halves the fraction of requests that pay the full origin latency penalty.',
    },
    {
      question: 'What is the difference between Cache-Control max-age and CDN TTL?',
      answer: 'They are the same concept expressed at different layers. Cache-Control: max-age=300 instructs all downstream caches — browsers, CDN edges, and reverse proxies — to treat the response as fresh for 300 seconds. A CDN-level TTL configuration overrides or extends max-age at the edge only, without changing what the browser sees. Use CDN TTL overrides when you want the edge to cache longer than the origin header specifies.',
    },
    {
      question: 'How do I calculate bandwidth savings from caching?',
      answer: 'Multiply cache hits per second by your average response size in KB, then by seconds per month (2,592,000). Divide by 1,048,576 to convert KB to GB and multiply by your per-GB egress rate. This calculator does it automatically. For <a href="/calculators/cdn-cost-calculator">CDN cost estimation</a>, note that Cloudflare does not charge for bandwidth served from cache — savings there appear as origin offload rather than direct dollar cost reduction.',
    },
  ],
  relatedSlugs: ['cache-hit-rate-calculator', 'cdn-cost-calculator', 'latency-budget-calculator'],
};

export const cacheTTLImpactCalculator: CalculatorDefinition = { meta, Component: CacheTTLImpactUI };
