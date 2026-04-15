import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function PaginationPerformanceUI() {
  const [totalRecords, setTotalRecords] = useState<string>('1000000');
  const [pageSize, setPageSize] = useState<string>('25');
  const [pageNumber, setPageNumber] = useState<string>('500');
  const [baseQueryMs, setBaseQueryMs] = useState<string>('5');

  const tR = Math.max(1, parseInt(totalRecords) || 1);
  const pS = Math.max(1, parseInt(pageSize) || 1);
  const pN = Math.max(1, parseInt(pageNumber) || 1);
  const bQ = parseFloat(baseQueryMs) || 0;

  const totalPages = Math.ceil(tR / pS);
  const offset = (pN - 1) * pS;
  const rowsOnPage = Math.min(pS, Math.max(0, tR - offset));
  const slowdownFactor = (offset + pS) / pS; // = page number for full pages
  const offsetQueryMs = bQ * slowdownFactor;
  const cursorQueryMs = bQ; // constant regardless of page

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Pagination Performance</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Records"
          type="number"
          value={totalRecords}
          onChange={(e) => setTotalRecords(e.target.value)}
          slotProps={{ htmlInput: { min: 1 } }}
          fullWidth
        />
        <TextField
          label="Page Size (rows/page)"
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          slotProps={{ htmlInput: { min: 1 } }}
          fullWidth
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Target Page Number"
          type="number"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
          slotProps={{ htmlInput: { min: 1 } }}
          fullWidth
        />
        <TextField
          label="Page 1 Query Time (ms)"
          type="number"
          value={baseQueryMs}
          onChange={(e) => setBaseQueryMs(e.target.value)}
          slotProps={{ htmlInput: { min: 0, step: '0.1' } }}
          fullWidth
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-around" textAlign="center">
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Pages</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{totalPages.toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Rows Skipped (Offset)</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{offset.toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Rows on This Page</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{rowsOnPage.toLocaleString()}</Typography>
          </Box>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-around" textAlign="center" mt={2}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Offset Query Time</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{offsetQueryMs.toFixed(1)} ms</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Cursor Query Time</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{cursorQueryMs.toFixed(1)} ms</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Slowdown Factor</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{slowdownFactor.toFixed(1)}×</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'pagination-performance-calculator',
  title: 'Pagination Performance Calculator',
  shortTitle: 'Pagination Perf',
  description: 'Calculate pagination performance for offset vs cursor-based queries. Enter total records, page size, and page number to see query time slowdown instantly.',
  keywords: [
    'pagination performance calculator',
    'offset pagination performance',
    'cursor pagination vs offset',
    'sql pagination slowdown',
    'keyset pagination calculator',
    'database pagination performance',
    'pagination query time estimator',
    'offset limit performance',
  ],
  category: 'data',
  icon: 'TableRows',
  tagline: 'Enter your dataset size, page size, and target page number to instantly compare offset vs cursor pagination query times. See exactly how much slower deep pages get with OFFSET.',
  lastUpdated: 'April 2026',
  intro: 'The pagination performance calculator shows you how much slower an offset-based pagination query gets as page number increases — a critical insight for any application that pages through large database tables.\n\nWith offset pagination (LIMIT n OFFSET m), the database engine must scan and discard every row before the target page. Page 500 with a page size of 25 forces the DB to scan 12,475 rows just to return 25. Cursor-based (keyset) pagination avoids this entirely by seeking directly to the last-seen row ID, keeping query time constant regardless of depth.\n\nThis calculator is used by backend engineers, DBAs, and architects diagnosing slow API list endpoints, planning index strategies, or making the case for migrating from OFFSET to cursor pagination. Use the slowdown factor output to quantify the performance regression before it hits production.',
  howItWorksTitle: 'How to Calculate Pagination Performance',
  howItWorksImage: '/images/calculators/pagination-performance-calculator-how-it-works.svg',
  howItWorks: '1. Enter the total number of records in the table or result set you are paginating.\n2. Set the page size — how many rows are returned per API or UI page.\n3. Enter the target page number you want to analyze (e.g. page 500).\n4. Enter the measured query time for page 1 in milliseconds — this is your baseline.\n5. The calculator derives the offset (rows skipped), the estimated offset query time, and the cursor query time.\n6. Compare the slowdown factor to decide whether keyset pagination is worth the migration cost.',
  formula: 'Offset          = (Page − 1) × Page Size\nTotal Pages     = ⌈Total Records ÷ Page Size⌉\nRows on Page    = min(Page Size, Total Records − Offset)\n\nSlowdown Factor = (Offset + Page Size) ÷ Page Size\n                = Page Number  (for full pages)\n\nOffset Query Time  = Page 1 Time × Slowdown Factor\nCursor Query Time  = Page 1 Time  (constant — no offset scanned)\n\nOffset          — rows the DB scans and discards before the target page\nSlowdown Factor — how many times slower the offset query is vs page 1',
  examplesTitle: 'Example Pagination Performance Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Admin list at page 500 (25 rows/page)',
      body: 'Total records: 1,000,000  |  Page size: 25  |  Target page: 500\n\nOffset         = (500 − 1) × 25 = 12,475 rows scanned and discarded\nTotal pages    = ⌈1,000,000 ÷ 25⌉ = 40,000\nSlowdown       = (12,475 + 25) ÷ 25 = 500×\n\nPage 1 query:  5 ms\nOffset query:  5 × 500 = 2,500 ms  ← 2.5 seconds per page\nCursor query:  5 ms   ← unchanged',
    },
    {
      title: 'Example 2 — E-commerce search results at page 20 (50 rows/page)',
      body: 'Total records: 200,000  |  Page size: 50  |  Target page: 20\n\nOffset         = (20 − 1) × 50 = 950 rows scanned and discarded\nTotal pages    = ⌈200,000 ÷ 50⌉ = 4,000\nSlowdown       = (950 + 50) ÷ 50 = 20×\n\nPage 1 query:  8 ms\nOffset query:  8 × 20 = 160 ms  ← noticeable latency\nCursor query:  8 ms   ← unchanged',
    },
    {
      title: 'Example 3 — Audit log export at page 10,000 (100 rows/page)',
      body: 'Total records: 5,000,000  |  Page size: 100  |  Target page: 10,000\n\nOffset         = (10,000 − 1) × 100 = 999,900 rows scanned and discarded\nTotal pages    = ⌈5,000,000 ÷ 100⌉ = 50,000\nSlowdown       = (999,900 + 100) ÷ 100 = 10,000×\n\nPage 1 query:  3 ms\nOffset query:  3 × 10,000 = 30,000 ms  ← 30 seconds, query will time out\nCursor query:  3 ms   ← safe to use at any depth',
    },
  ],
  tipsTitle: 'Tips to Improve Pagination Performance',
  tips: [
    'Switch to keyset (cursor) pagination for any list endpoint that users or jobs page beyond page 10 — offset cost grows linearly with page number and will eventually time out.',
    'Add a covering index on the sort column (e.g. <code>created_at</code>, <code>id</code>) so the DB can satisfy the pagination query from the index alone without touching the heap.',
    'Cap the maximum page size at a sensible limit (e.g. 100–200 rows). Large page sizes multiply both the offset scan cost and response payload size.',
    'Cache the total count separately — <code>COUNT(*)</code> on large tables is expensive. Store an approximate count in a materialized view or stats table and refresh it periodically.',
    'For read-heavy paginated APIs, use a read replica. Offset scans are CPU-intensive and can starve write queries on the primary if run frequently.',
    'Expose a <code>next_cursor</code> token in your API response instead of exposing raw page numbers. This forces clients into cursor pagination and prevents deep-offset abuse.',
  ],
  faq: [
    {
      question: 'Why does offset pagination get slower on later pages?',
      answer: 'With <code>LIMIT n OFFSET m</code>, the database engine must read and discard every row before the target page — it cannot skip ahead. Page 500 with a page size of 25 forces the DB to process 12,475 rows to return 25. No index can eliminate this scan; the engine must traverse the index in order from the start to reach the offset position.',
    },
    {
      question: 'What is cursor-based (keyset) pagination and how does it stay fast?',
      answer: 'Cursor pagination uses a <code>WHERE id &gt; last_seen_id</code> condition instead of an offset. The database index seeks directly to the cursor position in O(log n) time and returns the next page — no rows are discarded. Query time stays constant regardless of how deep into the result set you are, making it the correct choice for any large dataset.',
    },
    {
      question: 'When is offset pagination acceptable?',
      answer: 'Offset pagination is acceptable when the total result set is small (under ~10,000 rows), page depth is shallow (users rarely go beyond page 5–10), or you need arbitrary random access to any page number. For admin dashboards with small tables, or search results where users almost never go past page 3, offset simplicity often outweighs its performance cost.',
    },
    {
      question: 'What index should I add to speed up paginated queries?',
      answer: 'Create a covering index on the columns used in ORDER BY plus any WHERE filters. For example, if you query <code>WHERE status = \'active\' ORDER BY created_at DESC</code>, index <code>(status, created_at DESC)</code>. A covering index allows the database to satisfy the query entirely from the index without touching the main table, significantly reducing I/O even for offset queries.',
    },
    {
      question: 'Does this calculator work for Elasticsearch and NoSQL databases?',
      answer: 'The slowdown formula applies to any system that uses sequential scanning for deep pagination — Elasticsearch <code>from/size</code>, MongoDB <code>skip/limit</code>, and DynamoDB scan with offset all exhibit the same linear degradation. Elasticsearch\'s <code>search_after</code>, MongoDB\'s range queries, and DynamoDB\'s <code>ExclusiveStartKey</code> are the keyset equivalents. Use the slowdown factor to quantify the urgency of migrating.',
    },
  ],
  relatedSlugs: ['cache-hit-rate-calculator', 'sql-query-cost-estimator', 'qps-calculator'],
};

export const paginationPerformanceCalculator: CalculatorDefinition = { meta, Component: PaginationPerformanceUI };
