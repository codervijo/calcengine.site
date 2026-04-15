import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function HttpRequestSizeUI() {
  const [methodBytes, setMethodBytes] = useState<string>('4');
  const [urlLength, setUrlLength] = useState<string>('80');
  const [headerCount, setHeaderCount] = useState<string>('8');
  const [avgHeaderSize, setAvgHeaderSize] = useState<string>('45');
  const [bodyBytes, setBodyBytes] = useState<string>('512');

  const method = parseFloat(methodBytes) || 0;
  const url = parseFloat(urlLength) || 0;
  const headers = parseFloat(headerCount) || 0;
  const headerSize = parseFloat(avgHeaderSize) || 0;
  const body = parseFloat(bodyBytes) || 0;

  // Request line: METHOD SP URL SP HTTP/1.1 CRLF = method + 1 + url + 10
  const requestLine = method + 1 + url + 10;
  const headersTotal = headers * headerSize;
  const blankLine = 2;
  const totalBytes = requestLine + headersTotal + blankLine + body;
  const totalKB = totalBytes / 1024;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate HTTP Request Size</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="HTTP Method Size (bytes)"
          type="number"
          value={methodBytes}
          onChange={(e) => setMethodBytes(e.target.value)}
          helperText="GET=3  POST=4  PUT=3  DELETE=6"
          slotProps={{ htmlInput: { min: 1 } }}
        />
        <TextField
          label="URL Length (bytes)"
          type="number"
          value={urlLength}
          onChange={(e) => setUrlLength(e.target.value)}
          helperText="Characters in the full path + query string"
          slotProps={{ htmlInput: { min: 1 } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Number of Headers"
          type="number"
          value={headerCount}
          onChange={(e) => setHeaderCount(e.target.value)}
          helperText="Typical API call: 6–12 headers"
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Avg Header Line Size (bytes)"
          type="number"
          value={avgHeaderSize}
          onChange={(e) => setAvgHeaderSize(e.target.value)}
          helperText='e.g. "Content-Type: application/json\r\n" ≈ 34 bytes'
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Body Size (bytes)"
          type="number"
          value={bodyBytes}
          onChange={(e) => setBodyBytes(e.target.value)}
          helperText="0 for GET requests"
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total HTTP Request Size</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>
          {totalBytes.toLocaleString()} bytes
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          ≈ {totalKB.toFixed(2)} KB &nbsp;|&nbsp; Request line: {requestLine} B &nbsp;|&nbsp; Headers: {headersTotal} B &nbsp;|&nbsp; Body: {body} B
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'http-request-size-calculator',
  title: 'HTTP Request Size Calculator',
  shortTitle: 'HTTP Request Size',
  description: 'Calculate HTTP request size in bytes instantly. Enter method, URL length, headers, and body to estimate total payload size for API calls, gateways, and load balancers.',
  keywords: [
    'http request size calculator',
    'http request payload size',
    'api request size bytes',
    'http header size calculator',
    'request body size estimator',
    'rest api payload calculator',
    'http bandwidth estimator',
    'request size limit checker',
  ],
  category: 'api',
  icon: 'Http',
  tagline: 'Estimate the total byte size of any HTTP request — method, URL, headers, and body combined. Built for developers debugging gateway limits, API quotas, and network bandwidth.',
  lastUpdated: 'April 2026',
  intro: 'The HTTP request size calculator helps you measure exactly how many bytes an HTTP request consumes before it ever leaves your application. Every HTTP request has four cost-bearing parts: the request line (method + URL + protocol version), the header block, a mandatory blank line, and the optional body. Most developers think only about the body, but headers from authentication tokens, tracing IDs, and content negotiation routinely add 400–1,200 bytes per request.\n\nUnderstanding request size matters whenever you hit API gateway payload limits (AWS API Gateway caps requests at 10 MB), CDN size restrictions, load balancer timeouts triggered by large payloads, or mobile network constraints where every kilobyte of overhead affects latency and cost at scale.\n\nUse this calculator when you are debugging a 413 Payload Too Large error, estimating bandwidth costs for high-volume API calls, optimising a microservice that sends millions of requests per day, or validating that your serialised request fits within a messaging system\'s frame size. Pair it with the Payload Size Calculator to compare JSON vs MessagePack vs Protobuf body sizes before committing to a wire format.\n\nThe formula applies to HTTP/1.1 requests. HTTP/2 uses HPACK header compression, which can reduce the header portion by 50–90% on repeated requests — but the uncompressed byte count calculated here is the right baseline for capacity planning.',
  howItWorksTitle: 'How to Calculate HTTP Request Size',
  howItWorksImage: '/images/calculators/http-request-size-calculator-how-it-works.svg',
  howItWorks: '1. Determine the HTTP method ("POST" = 4 bytes, "GET" = 3 bytes, "DELETE" = 6 bytes).\n2. Measure the URL length — count every character in the path and query string.\n3. Count the number of request headers your client sends (use browser DevTools or a proxy).\n4. Estimate the average header line size in bytes — a typical Authorization header with a JWT is 250–500 bytes alone.\n5. Enter the body size in bytes — 0 for GET/HEAD, or the serialised body for POST/PUT/PATCH.\n6. The calculator adds a request line overhead (method + URL + " HTTP/1.1\\r\\n" = +10 bytes) and a mandatory blank CRLF line (+2 bytes) to give the full wire size.',
  formula: 'Total Size = Request Line + Headers + Blank Line + Body\n\nRequest Line  = method_bytes + 1 (space) + url_bytes + 10 ("HTTP/1.1\\r\\n" + space)\nHeaders       = number_of_headers × avg_header_line_bytes\nBlank Line    = 2 bytes (CRLF separator between headers and body)\nBody          = serialised payload bytes (0 for GET)\n\nmethod_bytes      — byte length of the HTTP verb (GET=3, POST=4, DELETE=6)\nurl_bytes         — byte length of the full URL path + query string\nnumber_of_headers — count of distinct header lines sent\navg_header_bytes  — mean bytes per header line including name, colon, value, CRLF',
  examplesTitle: 'Example HTTP Request Size Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Minimal GET request',
      body: 'Method:  GET (3 bytes)\nURL:     /api/users?page=1 (20 bytes)\nHeaders: 5 headers × 38 bytes avg = 190 bytes\nBody:    0 bytes\n──────────────────────────────────────\nRequest line: 3 + 1 + 20 + 10 = 34 bytes\nTotal: 34 + 190 + 2 + 0 = 226 bytes  (0.22 KB)',
    },
    {
      title: 'Example 2 — Authenticated POST with JSON body',
      body: 'Method:  POST (4 bytes)\nURL:     /api/v1/events (16 bytes)\nHeaders: 9 headers × 55 bytes avg = 495 bytes\n         (includes Authorization: Bearer <jwt> ≈ 300 bytes)\nBody:    1,024 bytes (JSON payload)\n──────────────────────────────────────\nRequest line: 4 + 1 + 16 + 10 = 31 bytes\nTotal: 31 + 495 + 2 + 1024 = 1,552 bytes  (1.52 KB)',
    },
    {
      title: 'Example 3 — Large bulk upload near gateway limit',
      body: 'Method:  POST (4 bytes)\nURL:     /api/v2/bulk-ingest (22 bytes)\nHeaders: 12 headers × 60 bytes avg = 720 bytes\nBody:    9,437,184 bytes (9 MB JSON array)\n──────────────────────────────────────\nRequest line: 4 + 1 + 22 + 10 = 37 bytes\nTotal: 37 + 720 + 2 + 9,437,184 = 9,437,943 bytes  (9.00 MB)\n→ Within AWS API Gateway\'s 10 MB hard limit by ~1 MB',
    },
  ],
  tipsTitle: 'Tips to Reduce HTTP Request Size',
  tips: [
    'Audit your headers with browser DevTools (Network tab → Headers). Long JWT tokens, verbose tracing headers, and redundant content-negotiation fields are common bloat sources.',
    'Use HTTP/2 wherever possible — HPACK compression eliminates repeated header bytes across requests on the same connection, reducing header overhead by 50–90% after the first call.',
    'Compress request bodies with gzip or Brotli for large payloads. Most HTTP clients and servers support Content-Encoding: gzip, and a 10 KB JSON body typically compresses to 1–2 KB.',
    'Switch to a binary serialisation format (MessagePack, Protobuf, CBOR) for high-volume internal APIs. Protobuf bodies are typically 30–60% smaller than equivalent JSON. Use the <a href="/calculators/payload-size-calculator">Payload Size Calculator</a> to compare formats.',
    'Shorten query strings by using short parameter names or POST bodies for complex filters. Every extra character in the URL adds to the request line cost on every single call.',
    'Monitor per-request byte costs at scale: at 1M requests/day, trimming 500 bytes per request saves 500 MB of inbound traffic — which matters for load balancer data processing fees.',
  ],
  faq: [
    {
      question: 'What is the typical size of an HTTP request?',
      answer: 'A minimal GET request with 5–8 headers is typically 200–600 bytes. An authenticated API POST request with a JSON body is commonly 1–5 KB. Requests grow quickly when Authorization headers carry long JWT tokens (300–600 bytes each) or when tracing/correlation headers are added by API gateways. Always measure with DevTools for your specific stack rather than relying on estimates.',
    },
    {
      question: 'What HTTP header size limits should I know about?',
      answer: 'Apache and Nginx default to an 8 KB header limit; AWS Application Load Balancer caps headers at 64 KB total. AWS API Gateway allows up to 10 MB per request including headers. If you receive a 431 Request Header Fields Too Large error, your combined header block exceeds the server\'s configured limit. Trim large tokens or move them to the request body or a pre-signed URL pattern.',
    },
    {
      question: 'How do I measure the actual size of an HTTP request?',
      answer: 'In Chrome or Firefox DevTools, open the Network tab, select a request, and check the "Headers" section — browser DevTools shows header byte sizes. For programmatic measurement, use curl with --trace or a proxy like mitmproxy. In Node.js, sum Buffer.byteLength of your headers and body. To estimate before sending, use this calculator with your actual header count and URL length.',
    },
    {
      question: 'Does HTTP/2 change how request size is calculated?',
      answer: 'HTTP/2 uses HPACK compression for headers, which dramatically reduces header size on repeated requests to the same host — common headers like :method and :path can be sent as a single byte after the first exchange. The uncompressed size this calculator provides is still the right baseline for capacity planning and one-off requests, but sustained HTTP/2 traffic will consume significantly less bandwidth for the header portion.',
    },
    {
      question: 'Why does request body size matter for API rate limits and costs?',
      answer: 'Many API gateways charge based on payload bytes processed (e.g. AWS API Gateway charges per GB of data processed). Large bodies also affect latency — a 5 MB body at 10 Mbps takes 4 seconds just to transmit. At scale, even 1 KB of unnecessary overhead per request adds up to gigabytes per day. Use the <a href="/calculators/bandwidth-cost-calculator">Bandwidth Cost Calculator</a> to convert your total daily request bytes into a dollar figure.',
    },
  ],
  relatedSlugs: ['payload-size-calculator', 'json-size-calculator', 'api-rate-limit-calculator', 'bandwidth-cost-calculator'],
};

export const httpRequestSizeCalculator: CalculatorDefinition = { meta, Component: HttpRequestSizeUI };
