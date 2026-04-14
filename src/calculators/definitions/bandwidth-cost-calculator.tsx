import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function BandwidthCostUI() {
  const [dataGB, setDataGB] = useState<string>('1000');
  const [pricePerGB, setPricePerGB] = useState<string>('0.09');
  const [freeTierGB, setFreeTierGB] = useState<string>('100');

  const data = parseFloat(dataGB) || 0;
  const price = parseFloat(pricePerGB) || 0;
  const free = parseFloat(freeTierGB) || 0;

  const billableGB = Math.max(0, data - free);
  const totalCost = billableGB * price;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Bandwidth Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Monthly Transfer (GB)" type="number" value={dataGB} onChange={(e) => setDataGB(e.target.value)} />
        <TextField label="Price per GB ($)" type="number" value={pricePerGB} onChange={(e) => setPricePerGB(e.target.value)} slotProps={{ htmlInput: { step: '0.001' } }} />
        <TextField label="Free Tier (GB)" type="number" value={freeTierGB} onChange={(e) => setFreeTierGB(e.target.value)} />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Monthly Bandwidth Cost</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>${totalCost.toFixed(2)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>{billableGB.toFixed(1)} GB billed at ${price}/GB</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'bandwidth-cost-calculator',
  title: 'Bandwidth Cost Calculator',
  shortTitle: 'Bandwidth Cost',
  description: 'Calculate bandwidth cost by entering monthly transfer volume and price per GB. Instant egress cost estimates for AWS, GCP, Azure, Cloudflare, and major CDN providers.',
  keywords: [
    'bandwidth cost calculator',
    'egress cost calculator',
    'cloud bandwidth pricing',
    'data transfer cost estimator',
    'aws egress cost calculator',
    'cdn bandwidth cost',
    'network egress pricing',
    'monthly bandwidth estimate',
  ],
  category: 'performance',
  icon: 'CloudDownload',
  tagline: 'Enter your monthly data transfer volume and per-GB price to get an instant bandwidth cost estimate. Works with AWS, GCP, Azure, Cloudflare, and any pay-per-GB provider.',
  lastUpdated: 'April 2026',
  intro: 'The bandwidth cost calculator gives you the monthly egress bill for any cloud provider or CDN in seconds. Enter your transfer volume, per-GB price, and optional free tier allowance — the calculator handles the arithmetic and shows you exactly what you will be billed.\n\nCloud egress is consistently one of the most underestimated line items on infrastructure bills. AWS charges $0.09/GB for outbound transfer in us-east-1; GCP charges $0.08–$0.12/GB depending on destination; Cloudflare and Bunny CDN start as low as $0.01/GB. A service pushing 50 TB/month can see monthly bandwidth costs swing from under $500 to over $4,500 depending purely on provider and delivery strategy.\n\nUse this calculator before choosing a CDN or cloud region, when planning a migration, or when investigating a surprise bill spike. The free-tier field handles the first-N-GB-free structure used by most cloud providers — enter zero to model straightforward pay-per-GB plans without any included allowance.\n\nFor a fuller picture of infrastructure cost, pair this calculator with the Throughput Calculator to understand transfer rates over time, and the Latency Budget Calculator to model the performance tradeoffs of your CDN and origin strategy.',
  howItWorksTitle: 'How to Calculate Bandwidth Cost',
  howItWorksImage: '/images/calculators/bandwidth-cost-calculator-how-it-works.svg',
  howItWorks: '1. Find your provider\'s per-GB egress price — check the AWS EC2 data transfer page, GCP Network pricing, or your CDN\'s pricing documentation.\n2. Estimate your monthly outbound transfer in GB. Use your monitoring dashboard, or multiply average response size × daily requests × 30.\n3. Enter any free tier allowance — AWS gives 100 GB/month free on EC2; Cloudflare\'s CDN includes unlimited free egress to end users.\n4. The calculator subtracts the free tier from your total transfer to get billable GB.\n5. Multiply billable GB by the per-GB price to get your monthly bandwidth cost.\n6. Scale to an annual projection by multiplying your monthly result by 12.',
  formula: 'Billable GB   = max(0, Monthly Transfer GB − Free Tier GB)\nMonthly Cost  = Billable GB × Price per GB\n\nMonthly Transfer GB — total outbound data transferred in a calendar month\nFree Tier GB        — GB included at no charge (enter 0 if your plan has none)\nPrice per GB        — provider\'s egress rate (e.g. $0.09 for AWS us-east-1 to internet)',
  examplesTitle: 'Example Bandwidth Cost Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — AWS EC2 egress at 5 TB/month',
      body: 'Monthly Transfer:   5,120 GB  (5 TB)\nFree Tier:            100 GB  (AWS free tier)\nBillable GB:        5,020 GB\nPrice per GB:         $0.09  (EC2 us-east-1 to internet)\n─────────────────────────────────────\nMonthly Cost: $451.80   →   $5,421.60/year',
    },
    {
      title: 'Example 2 — CloudFront CDN at 50 TB/month',
      body: 'Monthly Transfer:  51,200 GB  (50 TB)\nFree Tier:          1,000 GB  (CloudFront free tier)\nBillable GB:       50,200 GB\nPrice per GB:         $0.009  (CloudFront first 10 TB tier, blended)\n─────────────────────────────────────\nMonthly Cost: $451.80   →   Same bill, 10× more transfer — CDN caching reduces origin egress 80%+',
    },
    {
      title: 'Example 3 — Cloudflare R2 (zero egress)',
      body: 'Monthly Transfer:  51,200 GB  (50 TB of static assets)\nFree Tier:         Unlimited  (R2 egress to Cloudflare CDN is free)\nBillable GB:            0 GB\nPrice per GB:           $0.00\n─────────────────────────────────────\nMonthly Cost: $0.00   →   R2 storage ($0.015/GB/month) replaces all bandwidth charges for static content',
    },
  ],
  tipsTitle: 'Tips to Reduce Bandwidth Costs',
  tips: [
    'Switch from EC2 direct egress ($0.09/GB) to CloudFront CDN ($0.009/GB for the first 10 TB) — a 10× cost reduction for any cacheable content at production volumes.',
    'Enable gzip or Brotli compression at your CDN or origin. Text-based responses (HTML, JSON, JS) typically compress 70–80%, cutting your billable GB by the same amount.',
    'Use Cloudflare R2 or Backblaze B2 for static asset storage — both charge zero egress fees when serving through Cloudflare\'s CDN edge, eliminating bandwidth costs for images, videos, and builds.',
    'Co-locate your origin and storage in the same cloud region. Cross-AZ traffic within AWS costs $0.01/GB each way on top of your internet egress charge — avoidable with same-AZ placement.',
    'Set up daily transfer alerts in CloudWatch, GCP Monitoring, or your CDN dashboard. Unexpected spikes from hot content, scraping bots, or DDoS traffic are easiest to catch before the monthly bill lands.',
    'Negotiate a committed-use or volume discount with your CDN if you exceed 1 PB/month. Most providers offer 20–40% off list price at that scale — a direct conversation with your account rep is worth the 30 minutes.',
  ],
  faq: [
    {
      question: 'What is egress bandwidth and why does it cost money?',
      answer: 'Egress bandwidth is data leaving a cloud or CDN data center to the internet or another region. Providers charge for it because network transit capacity — especially at high-traffic edge nodes — is expensive to provision. Ingress (data flowing in) is almost always free. Designing to minimise egress, using CDN caching, or choosing zero-egress storage like Cloudflare R2 are the main levers. Pair with the <a href="/calculators/throughput-calculator">Throughput Calculator</a> to model transfer rates alongside cost.',
    },
    {
      question: 'How do I estimate monthly data transfer in GB?',
      answer: 'Multiply your average response size in MB by daily request count, then multiply by 30 and divide by 1,000 to convert to GB: (avg_response_MB × daily_requests × 30) ÷ 1,000. For video streaming, use: (bitrate_Mbps × 0.125) × avg_session_seconds × daily_sessions ÷ 1,000. Cross-check against your CloudWatch, GCP Monitoring, or CDN analytics dashboard for actual measured numbers.',
    },
    {
      question: 'Which cloud provider has the cheapest egress bandwidth in 2026?',
      answer: 'Cloudflare R2 and Backblaze B2 offer zero egress fees when delivering through Cloudflare\'s CDN, making them the lowest-cost option for static assets. For compute egress, Hetzner and OVH are typically 5–10× cheaper than AWS or GCP in Europe (~$0.01/GB vs $0.09/GB). AWS, GCP, and Azure all charge $0.08–$0.09/GB for standard internet egress from major regions.',
    },
    {
      question: 'Does AWS charge for data transfer within the same region?',
      answer: 'Most same-region transfers within the same VPC are free in AWS. However, transfers between Availability Zones within the same region cost $0.01/GB each way. Inter-region transfers cost $0.02/GB or more depending on destination. Always check the EC2 data transfer pricing page for exact rates between your source and destination. Placing your compute, databases, and storage in the same AZ eliminates these hidden intra-region charges.',
    },
    {
      question: 'How much bandwidth does a typical SaaS app use per user per month?',
      answer: 'It varies widely by product type. A mostly-text SaaS app might use 100–500 MB per active user per month. A data-heavy dashboard with charts and file exports might use 1–5 GB. A video or media platform can use 50–500 GB per active user. Start by measuring per-request payload size in your CDN or server logs, then multiply by your DAU and average sessions per user to get a monthly total.',
    },
  ],
  relatedSlugs: ['throughput-calculator', 'latency-budget-calculator', 'openai-cost-calculator'],
};

export const bandwidthCostCalculator: CalculatorDefinition = { meta, Component: BandwidthCostUI };
