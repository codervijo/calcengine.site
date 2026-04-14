import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function PayloadSizeUI() {
  const [recordSize, setRecordSize] = useState<string>('512');
  const [recordsPerRequest, setRecordsPerRequest] = useState<string>('100');
  const [requestsPerDay, setRequestsPerDay] = useState<string>('10000');

  const rs = parseFloat(recordSize) || 0;
  const rpr = parseFloat(recordsPerRequest) || 0;
  const rpd = parseFloat(requestsPerDay) || 0;

  const payloadBytes = rs * rpr;
  const gzipBytes = payloadBytes * 0.3;
  const dailyBytes = payloadBytes * rpd;
  const dailyGB = dailyBytes / (1024 ** 3);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 ** 3)).toFixed(2)} GB`;
  };

  const dailyLabel = dailyGB >= 1
    ? `${dailyGB.toFixed(2)} GB/day`
    : `${(dailyBytes / (1024 * 1024)).toFixed(2)} MB/day`;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Payload Size</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Average Record Size (bytes)"
          type="number"
          value={recordSize}
          onChange={(e) => setRecordSize(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
        <TextField
          label="Records per Request"
          type="number"
          value={recordsPerRequest}
          onChange={(e) => setRecordsPerRequest(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
        <TextField
          label="Requests per Day"
          type="number"
          value={requestsPerDay}
          onChange={(e) => setRequestsPerDay(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Request Payload Size</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatSize(payloadBytes)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
          Gzip ≈ {formatSize(gzipBytes)} · {dailyLabel}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'payload-size-calculator',
  title: 'Payload Size Calculator',
  shortTitle: 'Payload Size',
  description: 'Estimate API payload size in bytes, KB, or MB. Enter record count and average record size to calculate request payload, gzip estimate, and daily data volume.',
  keywords: [
    'payload size calculator',
    'api payload size estimator',
    'json payload size',
    'request payload calculator',
    'api response size calculator',
    'rest api payload bytes',
    'gzip payload size estimate',
    'batch api size calculator',
  ],
  category: 'api',
  icon: 'DataObject',
  tagline: 'Instantly estimate the byte size of your API request or response payload. Enter your average record size and record count to see total payload, gzip estimate, and daily bandwidth at a glance.',
  lastUpdated: 'April 2026',
  intro: 'The payload size calculator helps API designers and backend engineers estimate how large their request and response bodies will be before deploying to production. Whether you\'re building a REST endpoint, a GraphQL query, or a batch-processing job, knowing your payload size upfront prevents nasty surprises — timeouts, mobile data overruns, and unexpected bandwidth bills.\n\nMost API frameworks have default body size limits (Express defaults to 100 KB; nginx to 1 MB). Exceeding them silently drops requests or returns cryptic 413 errors. Use this calculator during design to check whether your batch size is safe under your server\'s configured limit.\n\nCompression matters at scale. JSON compresses roughly 70% with gzip, so a 1 MB raw payload becomes ~300 KB on the wire. The calculator shows both figures so you can decide whether enabling Content-Encoding: gzip is worth the CPU cost for your use case.\n\nThe daily volume figure helps you size your API gateway egress budget, estimate CDN costs, and set meaningful rate limits. Pair it with the <a href="/calculators/bandwidth-cost-calculator">Bandwidth Cost Calculator</a> to translate bytes into dollars.',
  howItWorksTitle: 'How to Calculate API Payload Size',
  howItWorksImage: '/images/calculators/payload-size-calculator-how-it-works.svg',
  howItWorks: '1. Estimate your average record size in bytes — serialize a typical JSON object and check its byte length with Buffer.byteLength() (Node.js) or len(json.dumps(obj).encode()) (Python).\n2. Enter the number of records included in a single request or response (e.g. a pagination page size of 100).\n3. The calculator multiplies record size × record count to get raw payload bytes.\n4. Gzip estimate applies a 0.30 multiplier — typical for JSON payloads with repeated keys and string values.\n5. Daily volume multiplies per-request payload by your expected request count, giving a bandwidth planning figure.\n6. Adjust record size or count until the payload fits safely under your server and gateway body-size limits.',
  formula: 'Payload Bytes    = Record Size (bytes) × Records per Request\nGzip Estimate    = Payload Bytes × 0.30   (≈ 70% compression ratio for JSON)\nDaily Volume     = Payload Bytes × Requests per Day\nMonthly Volume   = Daily Volume × 30\n\nRecord Size      — serialised byte length of one JSON object (keys + values)\nRecords/Request  — items in a single API response or batch payload\nRequests/Day     — expected API calls per day for bandwidth planning',
  examplesTitle: 'Example Payload Size Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Paginated REST endpoint (50 records)',
      body: 'Record size:       256 bytes (small user object: id, name, email, role)\nRecords/request:   50\nRaw payload:       256 × 50 = 12,800 bytes  →  12.5 KB\nGzip estimate:     12,800 × 0.30 = 3,840 bytes  →  3.75 KB\nAt 5,000 req/day:  64 MB/day raw · 19.2 MB/day compressed',
    },
    {
      title: 'Example 2 — Large batch export (1,000 records)',
      body: 'Record size:       1,024 bytes (order object: ~20 fields, nested address)\nRecords/request:   1,000\nRaw payload:       1,024 × 1,000 = 1,048,576 bytes  →  1.00 MB\nGzip estimate:     1,048,576 × 0.30 = 314,573 bytes  →  307 KB\nNote: exceeds Express default 100 KB limit — must set bodyParser limit or stream.',
    },
    {
      title: 'Example 3 — High-frequency microservice (10 records)',
      body: 'Record size:       128 bytes (event: timestamp, type, user_id, value)\nRecords/request:   10\nRaw payload:       128 × 10 = 1,280 bytes  →  1.25 KB\nGzip estimate:     1,280 × 0.30 = 384 bytes  →  0.38 KB (compression barely worth it)\nAt 50,000 req/day: 64 MB/day  →  ~1.9 GB/month',
    },
  ],
  tipsTitle: 'Tips to Keep API Payloads Small',
  tips: [
    'Measure before you guess — serialize a real object in your language and call the byte-length function. Guessed sizes are almost always off by 2–5×.',
    'Use field projection (sparse fieldsets) so clients only receive the fields they need. GraphQL does this by design; REST can use <code>?fields=id,name,email</code> query params.',
    'Enable gzip/brotli compression at the reverse proxy layer (nginx, Caddy) rather than in application code — it\'s faster and requires zero code changes.',
    'Paginate aggressively. A page size of 20–50 records is usually enough for UI rendering and keeps p99 response times predictable under load.',
    'Replace repeated string enums with integer codes in high-frequency payloads. "status":"completed" (21 bytes) vs "s":3 (5 bytes) — a 4× saving across millions of records.',
    'Use <a href="/calculators/bandwidth-cost-calculator">Bandwidth Cost Calculator</a> to convert your daily volume estimate into a dollar amount and decide whether compression investment pays off.',
  ],
  faq: [
    {
      question: 'What is a good maximum size for an API payload?',
      answer: 'Keep individual API payloads under 1 MB for synchronous requests. Most reverse proxies default to 1–8 MB limits, and mobile clients struggle with larger bodies on slow connections. For bulk operations above 1 MB, use streaming, chunked transfer, or an async job endpoint that returns a download URL once processing completes.',
    },
    {
      question: 'How do I measure the actual byte size of a JSON object?',
      answer: 'In Node.js use <code>Buffer.byteLength(JSON.stringify(obj))</code>. In Python use <code>len(json.dumps(obj).encode("utf-8"))</code>. In the browser use <code>new TextEncoder().encode(JSON.stringify(obj)).length</code>. These all give UTF-8 byte counts, which is what HTTP Content-Length reports. Non-ASCII characters count as 2–4 bytes each.',
    },
    {
      question: 'How accurate is the 70% gzip compression estimate?',
      answer: 'It\'s a reasonable baseline for typical JSON API responses with repeated keys and mixed string/number values. Highly repetitive data (e.g., arrays of identical objects) can compress 85–90%. Dense numeric arrays or already-compressed binary data may compress less than 30%. Run <code>gzip -9</code> on a sample payload for a precise figure specific to your schema.',
    },
    {
      question: 'Does payload size affect API latency?',
      answer: 'Yes, in two ways. First, serialisation time grows linearly with payload size — large objects take longer to encode and decode on both ends. Second, network transfer time adds latency proportional to size divided by bandwidth. On a 10 Mbps mobile connection, a 1 MB payload adds ~800 ms of transfer time alone, before processing begins.',
    },
    {
      question: 'What causes a 413 Request Entity Too Large error?',
      answer: 'Your payload exceeds the server\'s configured body-size limit. Express defaults to 100 KB; nginx to 1 MB; AWS API Gateway to 10 MB. Increase the limit in your server config, or — better — reduce the payload by splitting it into smaller batches. For file uploads, use multipart streaming or a presigned S3 URL instead of sending the binary through your API server.',
    },
  ],
  relatedSlugs: ['json-size-calculator', 'api-rate-limit-calculator', 'bandwidth-cost-calculator'],
};

export const payloadSizeCalculator: CalculatorDefinition = { meta, Component: PayloadSizeUI };
