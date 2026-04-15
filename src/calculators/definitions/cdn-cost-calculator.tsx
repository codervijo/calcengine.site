import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function CdnCostUI() {
  const [dataTransferGB, setDataTransferGB] = useState<string>('500');
  const [requestsMillions, setRequestsMillions] = useState<string>('10');
  const [transferPrice, setTransferPrice] = useState<string>('0.085');
  const [requestPrice, setRequestPrice] = useState<string>('0.0100');

  const gb = parseFloat(dataTransferGB) || 0;
  const reqM = parseFloat(requestsMillions) || 0;
  const tp = parseFloat(transferPrice) || 0;
  const rp = parseFloat(requestPrice) || 0;

  const transferCost = gb * tp;
  const requestCost = (reqM * 1_000_000 / 10_000) * rp;
  const totalCost = transferCost + requestCost;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate CDN Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Data Transfer (GB/month)" type="number" value={dataTransferGB} onChange={(e) => setDataTransferGB(e.target.value)} slotProps={{ htmlInput: { step: '1', min: '0' } }} />
        <TextField label="Monthly Requests (millions)" type="number" value={requestsMillions} onChange={(e) => setRequestsMillions(e.target.value)} slotProps={{ htmlInput: { step: '0.1', min: '0' } }} />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Transfer Price ($/GB)" type="number" value={transferPrice} onChange={(e) => setTransferPrice(e.target.value)} slotProps={{ htmlInput: { step: '0.001', min: '0' } }} />
        <TextField label="Request Price ($/10k requests)" type="number" value={requestPrice} onChange={(e) => setRequestPrice(e.target.value)} slotProps={{ htmlInput: { step: '0.0001', min: '0' } }} />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Monthly CDN Cost</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>${totalCost.toFixed(2)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          Transfer: ${transferCost.toFixed(2)} + Requests: ${requestCost.toFixed(2)}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'cdn-cost-calculator',
  title: 'CDN Cost Calculator',
  shortTitle: 'CDN Cost',
  description: 'Calculate your monthly CDN cost by data transfer and requests. Estimate CloudFront, Cloudflare, and Fastly pricing instantly — no sign-up required.',
  keywords: ['cdn cost calculator', 'cdn pricing calculator', 'cloudfront cost calculator', 'cloudflare cost estimator', 'cdn bandwidth cost', 'cdn request cost', 'content delivery network pricing'],
  category: 'performance',
  icon: 'AttachMoney',
  tagline: 'Estimate your monthly CDN bill from data transfer volume and request count. Works with AWS CloudFront, Cloudflare, Fastly, and any per-GB CDN provider.',
  lastUpdated: 'April 2026',
  intro: 'A CDN cost calculator helps you forecast your monthly bill before traffic spikes catch you off guard. CDN providers charge along two dimensions: the volume of data transferred out to end users (per GB) and the number of HTTP requests served (per 10,000). Both costs grow with traffic, and they scale independently — a site serving large files pays more on transfer, while a high-QPS API pays more on requests.\n\nThis calculator covers the core cost model used by AWS CloudFront, Cloudflare Pay-As-You-Go, Fastly, and most other CDNs. Enter your expected monthly data transfer in GB, your request volume in millions, and the per-GB and per-10k-request prices from your provider\'s pricing page. The result is your projected monthly CDN spend, split by line item.\n\nUse the calculator when budgeting a new product launch, estimating costs for a marketing campaign that will spike traffic, or comparing providers. You can also run multiple scenarios — current traffic, 5× growth, 10× growth — to understand how your CDN costs scale before they appear on your bill.',
  howItWorksTitle: 'How to Calculate CDN Cost',
  howItWorksImage: '/images/calculators/cdn-cost-calculator-how-it-works.svg',
  howItWorks: '1. Find your CDN provider\'s data transfer price ($/GB) and request price ($/10,000 requests) on their pricing page.\n2. Measure or estimate your monthly data transfer in GB — check your CDN dashboard or web analytics.\n3. Measure or estimate your monthly request count in millions — HTTP requests served, not unique visitors.\n4. Enter all four values into the calculator above.\n5. The calculator multiplies transfer GB × $/GB, then adds (requests × 1,000,000 ÷ 10,000) × $/10k to produce your total monthly CDN cost.',
  formula: 'Total CDN Cost = Transfer Cost + Request Cost\n\nTransfer Cost = Data Transfer (GB) × Transfer Price ($/GB)\nRequest Cost  = (Monthly Requests × 1,000,000 ÷ 10,000) × Request Price ($/10k)\n\nData Transfer     — gigabytes served to end users per month\nMonthly Requests  — HTTP requests served per month (in millions)\nTransfer Price    — CDN provider\'s per-GB egress rate (e.g. $0.085 for CloudFront)\nRequest Price     — CDN provider\'s per-10,000-request rate (e.g. $0.0100 for CloudFront)',
  examplesTitle: 'Example CDN Cost Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Small SaaS app (CloudFront pricing)',
      body: 'Transfer:  100 GB  × $0.085 / GB       =  $8.50\nRequests:  2M      × (1,000,000 ÷ 10,000) × $0.0100  =  $2.00\n                                                        ─────────\nTotal per month: $10.50',
    },
    {
      title: 'Example 2 — Media streaming site (500 GB, high requests)',
      body: 'Transfer:  500 GB  × $0.085 / GB       =  $42.50\nRequests:  10M     × (1,000,000 ÷ 10,000) × $0.0100  =  $10.00\n                                                        ─────────\nTotal per month: $52.50   →   $630 / year',
    },
    {
      title: 'Example 3 — High-traffic e-commerce (2TB transfer, 50M requests)',
      body: 'Transfer:  2,000 GB  × $0.085 / GB     =  $170.00\nRequests:  50M      × (1,000,000 ÷ 10,000) × $0.0100  =  $50.00\n                                                          ─────────\nTotal per month: $220.00   →   switching to Cloudflare Pro ($20/mo flat) saves ~$200/mo',
    },
  ],
  pricingTableTitle: 'CDN Pricing by Provider',
  pricingTable: [
    { model: 'AWS CloudFront',        inputPer1M: '$0.085/GB',  outputPer1M: '$0.0100/10k req', notes: 'First 10 TB/month' },
    { model: 'Cloudflare Pay-As-You-Go', inputPer1M: '$0.000/GB', outputPer1M: '$0.0050/10k req', notes: 'Free egress, request-based pricing' },
    { model: 'Cloudflare Pro',        inputPer1M: '$20/mo flat', outputPer1M: 'Included',        notes: 'Best value under ~$100/mo CDN spend' },
    { model: 'Fastly',                inputPer1M: '$0.120/GB',  outputPer1M: '$0.0090/10k req', notes: 'North America/Europe' },
    { model: 'Azure CDN (Microsoft)', inputPer1M: '$0.087/GB',  outputPer1M: '$0.0090/10k req', notes: 'First 10 TB/month, Zone 1' },
    { model: 'Google Cloud CDN',      inputPer1M: '$0.080/GB',  outputPer1M: '$0.0075/10k req', notes: 'North America/Europe egress' },
    { model: 'BunnyCDN',              inputPer1M: '$0.010/GB',  outputPer1M: 'Included',         notes: 'Cheapest egress, good for media' },
  ],
  tipsTitle: 'Tips to Reduce Your CDN Bill',
  tips: [
    'Enable long-lived cache headers (Cache-Control: max-age=31536000) on static assets. Every cache hit is a request that doesn\'t hit origin and reduces both request and transfer costs.',
    'Use Cloudflare\'s free or Pro plan if your traffic profile matches — free egress and low request pricing makes it dramatically cheaper than CloudFront for most web apps.',
    'Compress all text assets (HTML, CSS, JS, JSON) with Brotli or gzip before delivery. Compression can reduce transfer volume by 60–80%, directly cutting your per-GB bill.',
    'Serve images in modern formats (WebP, AVIF) and size them to display dimensions. Oversized images are the single largest source of avoidable CDN egress on content sites.',
    'Use a <a href="/calculators/bandwidth-cost-calculator">Bandwidth Cost Calculator</a> alongside this tool to model your full egress spend including non-CDN traffic.',
    'Review your CDN dashboard monthly. Unexplained spikes in request count often indicate hotlinking, bot traffic, or missing cache rules — all of which you can cut before they hit your bill.',
  ],
  faq: [
    {
      question: 'How is CDN cost calculated?',
      answer: 'CDN providers charge on two dimensions: data transfer (GB served to end users) and HTTP requests. Multiply your monthly GB by the per-GB price, then add your request count divided by 10,000 multiplied by the per-10k-request price. The sum is your total monthly CDN spend. This calculator handles both dimensions automatically.',
    },
    {
      question: 'Is Cloudflare cheaper than AWS CloudFront?',
      answer: 'For most websites, yes. Cloudflare charges $0 for egress (data transfer) on all plans — you only pay per request. CloudFront charges $0.085/GB plus $0.0100 per 10k requests. At 500 GB/month with 10M requests, CloudFront costs ~$52 vs Cloudflare Pay-As-You-Go at ~$10. Cloudflare Pro ($20/mo flat) beats both at moderate volumes.',
    },
    {
      question: 'What counts as a CDN request?',
      answer: 'Each HTTP request served by the CDN — HTML pages, images, CSS files, JS files, API calls, font files — counts as one request. A single page load typically generates 50–200 requests. Use your CDN provider\'s analytics dashboard to find your actual monthly request count, or estimate from page views × average requests per page.',
    },
    {
      question: 'How much data transfer does a typical website use?',
      answer: 'A small blog serving 10,000 visitors/month at ~500 KB average page weight uses roughly 5 GB/month. A mid-size SaaS app with 100,000 monthly sessions might transfer 50–200 GB. Media-heavy or video sites can easily exceed 1 TB/month. Use your web analytics or CDN dashboard to get your actual transfer volume before estimating costs.',
    },
    {
      question: 'When should I use a CDN pricing calculator?',
      answer: 'Use a CDN cost calculator before a product launch, when evaluating a provider switch, or when modeling traffic growth scenarios. It\'s especially useful for comparing providers side-by-side — enter the same traffic numbers with each provider\'s per-GB and per-request rates to see the cost difference. Also use the <a href="/calculators/data-transfer-cost-calculator">Data Transfer Cost Calculator</a> to model origin egress alongside CDN costs.',
    },
  ],
  relatedSlugs: ['bandwidth-cost-calculator', 'data-transfer-cost-calculator', 'storage-cost-calculator'],
};

export const cdnCostCalculator: CalculatorDefinition = { meta, Component: CdnCostUI };
