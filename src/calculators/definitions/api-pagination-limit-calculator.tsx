import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function ApiPaginationLimitUI() {
  const [totalRecords, setTotalRecords] = useState<string>('10000');
  const [pageSize, setPageSize] = useState<string>('100');
  const [rateLimit, setRateLimit] = useState<string>('10');

  const records = parseFloat(totalRecords) || 0;
  const limit = parseFloat(pageSize) || 1;
  const rate = parseFloat(rateLimit) || 1;

  const totalPages = Math.ceil(records / limit);
  const totalSeconds = totalPages / rate;
  const totalMinutes = totalSeconds / 60;
  const requestsPerMin = rate * 60;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
    return `${(seconds / 3600).toFixed(2)} hours`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate API Pagination</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Records"
          type="number"
          value={totalRecords}
          onChange={(e) => setTotalRecords(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
        <TextField
          label="Page Size (records per request)"
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Rate Limit (requests / second)"
          type="number"
          value={rateLimit}
          onChange={(e) => setRateLimit(e.target.value)}
          slotProps={{ htmlInput: { min: '0.1', step: '0.1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Pages Required</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{totalPages.toLocaleString()}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 1.5 }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Fetch Time</Typography>
            <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>{formatTime(totalSeconds)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Requests per Minute</Typography>
            <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>{requestsPerMin.toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Minutes</Typography>
            <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>{totalMinutes.toFixed(2)}</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'api-pagination-limit-calculator',
  title: 'API Pagination Limit Calculator',
  shortTitle: 'API Pagination',
  description: 'Calculate total pages, fetch time, and request count for paginated API calls. Enter total records, page size, and rate limit to plan your data sync instantly.',
  keywords: [
    'api pagination limit calculator',
    'api pagination calculator',
    'pagination page size calculator',
    'rest api pagination calculator',
    'total pages calculator',
    'api rate limit pagination',
    'paginated api fetch time',
    'cursor pagination calculator',
  ],
  category: 'api',
  icon: 'LayersOutlined',
  tagline: 'Enter your total record count, page size, and rate limit to instantly calculate how many API requests you need and how long a full data sync will take.',
  lastUpdated: 'April 2026',
  intro: 'The API pagination limit calculator helps you plan how many requests a paginated API endpoint will require to retrieve a full dataset. Whether you are syncing a CRM, exporting database records, or hydrating a cache from a third-party service, underestimating request volume is a common source of budget overruns and rate-limit errors.\n\nMost REST APIs enforce a maximum page size — Stripe caps at 100 objects per request, GitHub at 100 items, Salesforce at 2,000 records. Multiply that ceiling by your record count and rate limit and you get a clear picture of the minimum time and request budget you need to allocate.\n\nBackend engineers use this calculator to size background job timeouts, set worker pool concurrency, and verify that a nightly sync finishes before the next run begins. It is equally useful for capacity planning when switching from cursor-based to offset-based pagination, where deeper pages are progressively slower.\n\nThe formula is simple but the implications compound quickly at scale. A 1-million-record export with a page size of 100 and a 10 req/s rate limit takes over 27 minutes — knowing that in advance prevents surprise timeouts and helps you choose the right async architecture from the start.',
  howItWorksTitle: 'How to Calculate API Pagination Limit and Fetch Time',
  howItWorksImage: '/images/calculators/api-pagination-limit-calculator-how-it-works.svg',
  howItWorks: '1. Determine your total record count — query your database or use the API\'s total_count field in the first response.\n2. Find the maximum page size your API allows (check the docs for a "limit" or "per_page" cap).\n3. Divide total records by page size and round up — that is your minimum request count.\n4. Enter your API\'s rate limit in requests per second (convert from "per minute" by dividing by 60).\n5. Divide total pages by rate limit to get total fetch time in seconds.\n6. Add a buffer of 10–20% for retries, network jitter, and token refresh requests.',
  formula: 'Total Pages   = ⌈ Total Records ÷ Page Size ⌉\nFetch Time    = Total Pages ÷ Rate Limit   (seconds)\n\nTotal Records — number of objects you need to retrieve\nPage Size     — records returned per API request (your "limit" param)\nRate Limit    — maximum requests per second your API key allows\nFetch Time    — minimum wall-clock seconds to retrieve all records',
  examplesTitle: 'Example API Pagination Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Stripe customer export (100 records/page, 100 req/s)',
      body: 'Total records:  50,000 customers\nPage size:     100  (Stripe max)\nRate limit:    100 req/s\n\nTotal pages  = ⌈ 50,000 ÷ 100 ⌉ = 500 requests\nFetch time   = 500 ÷ 100       = 5 seconds\n\n→ A 50k-customer sync completes in 5 seconds — fits easily in a webhook handler timeout.',
    },
    {
      title: 'Example 2 — GitHub issues export (100 items/page, 10 req/min)',
      body: 'Total records:  8,400 issues\nPage size:     100  (GitHub max)\nRate limit:    10 req/min  →  0.167 req/s\n\nTotal pages  = ⌈ 8,400 ÷ 100 ⌉ = 84 requests\nFetch time   = 84 ÷ 0.167       ≈ 503 seconds  (~8.4 minutes)\n\n→ Must run as a background job; too slow for a synchronous HTTP response.',
    },
    {
      title: 'Example 3 — Internal analytics API (1,000 rows/page, 5 req/s)',
      body: 'Total records:  2,000,000 rows\nPage size:     1,000\nRate limit:    5 req/s\n\nTotal pages  = ⌈ 2,000,000 ÷ 1,000 ⌉ = 2,000 requests\nFetch time   = 2,000 ÷ 5               = 400 seconds  (~6.7 minutes)\n\n→ Increase page size to 5,000 rows → 400 requests → 80 seconds saved per run.',
    },
  ],
  tipsTitle: 'Tips to Optimise Paginated API Calls',
  tips: [
    'Always use the maximum allowed page size. Fetching 1,000 records in one request is identical in rate-limit cost to fetching 10 records — maximising page size minimises total requests.',
    'Prefer cursor-based pagination over offset pagination for large datasets. Offset queries get slower as the offset grows; cursors maintain constant response time regardless of depth.',
    'Parallelise independent pagination streams. If the API allows it, fan out multiple concurrent requests to different data partitions (e.g., by date range or shard key) and merge results.',
    'Cache the total_count from the first response. Most APIs return it on page 1 — store it so subsequent logic can pre-allocate arrays and show accurate progress bars.',
    'Budget 10–20% extra requests for retries. Rate-limited requests return 429 errors; your fetch loop must handle these with exponential backoff, adding to actual request count. Use the <a href="/calculators/retry-backoff-calculator">Retry Backoff Calculator</a> to size your retry window.',
    'Set job timeouts based on calculated fetch time plus a safety margin. If your sync takes 8 minutes, set your worker timeout to at least 12 minutes to avoid silent failures.',
  ],
  faq: [
    {
      question: 'What is the optimal page size for a paginated API?',
      answer: 'Use the maximum page size your API allows. Common ceilings are 100 (Stripe, GitHub), 200 (Twitter/X), 1,000 (Google APIs), and 2,000 (Salesforce). Larger pages reduce total request count, lower rate-limit pressure, and cut network round-trip overhead. Only reduce page size if the response body is so large it causes timeout or memory issues on the receiving end.',
    },
    {
      question: 'How do I convert a "per minute" rate limit to "per second"?',
      answer: 'Divide the per-minute figure by 60. For example, a 600 req/min limit equals 10 req/s. Most API rate limits are expressed per minute or per hour — always convert to per second for this calculator. If your limit is per hour, divide by 3,600. Be aware that some APIs enforce burst limits shorter than one second, so the sustained rate may be lower than the raw cap suggests.',
    },
    {
      question: 'What is the difference between offset and cursor pagination?',
      answer: 'Offset pagination (page=2&limit=100) skips a fixed number of records in the database, which gets progressively slower on large tables. Cursor pagination uses an opaque pointer to the last seen record, giving constant-time performance regardless of depth. For datasets over 10,000 records, cursor pagination is strongly preferred. This calculator\'s formula applies to both — total pages and fetch time are the same regardless of pagination style.',
    },
    {
      question: 'How do I estimate total records if the API does not return a count?',
      answer: 'Fetch the first page and inspect the response. Many APIs include total_count, x-total-count (HTTP header), or a meta.total field even when not documented. If absent, use a separate count endpoint or database query. For third-party APIs without totals, fetch one page at a time and stop when a page returns fewer records than the page size — that signals the final page.',
    },
    {
      question: 'How much extra time should I add for retries and 429 errors?',
      answer: 'Add 10–20% to your calculated fetch time for typical workloads. Under heavy load or with aggressive rate limits, budget up to 50% overhead. Each 429 response requires a retry-after wait (usually 1–60 seconds) and re-sending the same request. Use exponential backoff with jitter to distribute retry pressure. The <a href="/calculators/retry-backoff-calculator">Retry Backoff Calculator</a> can help you size your maximum backoff window correctly.',
    },
  ],
  relatedSlugs: ['api-rate-limit-calculator', 'retry-backoff-calculator', 'pagination-performance-calculator', 'timeout-calculator'],
};

export const apiPaginationLimitCalculator: CalculatorDefinition = { meta, Component: ApiPaginationLimitUI };
